
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, WorkoutGroup, WorkoutProgress, LeaderboardEntry } from '../types';

export const useWorkouts = () => {
  const [groups, setGroups] = useState<WorkoutGroup[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [progress, setProgress] = useState<WorkoutProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [groupsData, workoutsData, progressData] = await Promise.all([
        AsyncStorage.getItem('groups'),
        AsyncStorage.getItem('workouts'),
        AsyncStorage.getItem('progress'),
      ]);

      if (groupsData) setGroups(JSON.parse(groupsData));
      if (workoutsData) setWorkouts(JSON.parse(workoutsData));
      if (progressData) setProgress(JSON.parse(progressData));
    } catch (error) {
      console.log('Error loading workout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (name: string, description: string, userId: string): Promise<WorkoutGroup> => {
    const newGroup: WorkoutGroup = {
      id: Date.now().toString(),
      name,
      description,
      createdBy: userId,
      members: [userId],
      workouts: [],
      createdAt: new Date(),
      isPublic: true,
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
    return newGroup;
  };

  const joinGroup = async (groupId: string, userId: string): Promise<boolean> => {
    try {
      const updatedGroups = groups.map(group => {
        if (group.id === groupId && !group.members.includes(userId)) {
          return { ...group, members: [...group.members, userId] };
        }
        return group;
      });

      setGroups(updatedGroups);
      await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
      return true;
    } catch (error) {
      console.log('Error joining group:', error);
      return false;
    }
  };

  const createWorkout = async (workout: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> => {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));

    // Add workout to group
    const updatedGroups = groups.map(group => {
      if (group.id === workout.groupId) {
        return { ...group, workouts: [...group.workouts, newWorkout.id] };
      }
      return group;
    });
    setGroups(updatedGroups);
    await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));

    return newWorkout;
  };

  const logProgress = async (workoutProgress: Omit<WorkoutProgress, 'id'>): Promise<void> => {
    const newProgress: WorkoutProgress = {
      ...workoutProgress,
      id: Date.now().toString(),
    };

    const updatedProgress = [...progress, newProgress];
    setProgress(updatedProgress);
    await AsyncStorage.setItem('progress', JSON.stringify(updatedProgress));
  };

  const getLeaderboard = (groupId: string): LeaderboardEntry[] => {
    const groupWorkouts = workouts.filter(w => w.groupId === groupId);
    const workoutIds = groupWorkouts.map(w => w.id);
    
    const userScores: { [userId: string]: { totalScore: number; completedWorkouts: number; userName: string } } = {};

    progress.forEach(p => {
      if (workoutIds.includes(p.workoutId)) {
        if (!userScores[p.userId]) {
          userScores[p.userId] = {
            totalScore: 0,
            completedWorkouts: 0,
            userName: `User ${p.userId.slice(-4)}`,
          };
        }
        userScores[p.userId].totalScore += p.totalScore;
        userScores[p.userId].completedWorkouts += 1;
      }
    });

    const leaderboard: LeaderboardEntry[] = Object.entries(userScores)
      .map(([userId, data]) => ({
        userId,
        userName: data.userName,
        totalScore: data.totalScore,
        completedWorkouts: data.completedWorkouts,
        rank: 0,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    return leaderboard;
  };

  return {
    groups,
    workouts,
    progress,
    loading,
    createGroup,
    joinGroup,
    createWorkout,
    logProgress,
    getLeaderboard,
  };
};
