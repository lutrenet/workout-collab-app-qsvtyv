
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import { useWorkouts } from '../../hooks/useWorkouts';
import WorkoutCard from '../../components/WorkoutCard';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { groups, workouts, progress } = useWorkouts();
  const [activeTab, setActiveTab] = useState<'workouts' | 'members' | 'leaderboard'>('workouts');

  if (!user || !id) {
    return (
      <View style={commonStyles.centerContent}>
        <Text style={commonStyles.text}>Loading...</Text>
      </View>
    );
  }

  const group = groups.find(g => g.id === id);
  if (!group) {
    return (
      <View style={commonStyles.centerContent}>
        <Text style={commonStyles.text}>Group not found</Text>
      </View>
    );
  }

  const groupWorkouts = workouts.filter(w => w.groupId === id);
  const isMember = group.members.includes(user.id);
  const isCreator = group.createdBy === user.id;

  const handleCreateWorkout = () => {
    router.push(`/create-workout?groupId=${id}`);
  };

  const handleWorkoutPress = (workoutId: string) => {
    router.push(`/workout/${workoutId}`);
  };

  const getWorkoutCompletedCount = (workoutId: string) => {
    return progress.filter(p => p.workoutId === workoutId).length;
  };

  const renderWorkouts = () => (
    <View style={styles.tabContent}>
      {groupWorkouts.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="dumbbell" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyStateText}>No workouts yet</Text>
          <Text style={styles.emptyStateSubtext}>
            {isMember ? 'Create the first workout for this group!' : 'Join the group to see workouts'}
          </Text>
          {isMember && (
            <TouchableOpacity
              style={[buttonStyles.primary, styles.createButton]}
              onPress={handleCreateWorkout}
            >
              <Text style={commonStyles.buttonText}>Create Workout</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        groupWorkouts.map(workout => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onPress={() => handleWorkoutPress(workout.id)}
            completedCount={getWorkoutCompletedCount(workout.id)}
          />
        ))
      )}
    </View>
  );

  const renderMembers = () => (
    <View style={styles.tabContent}>
      <Text style={styles.memberCount}>{group.members.length} Members</Text>
      {group.members.map((memberId, index) => (
        <View key={memberId} style={[commonStyles.card, styles.memberCard]}>
          <View style={styles.memberAvatar}>
            <IconSymbol name="person.fill" size={20} color={colors.card} />
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>User {memberId.slice(-4)}</Text>
            <Text style={styles.memberRole}>
              {memberId === group.createdBy ? 'Creator' : 'Member'}
            </Text>
          </View>
          {memberId === group.createdBy && (
            <IconSymbol name="crown.fill" size={20} color={colors.secondary} />
          )}
        </View>
      ))}
    </View>
  );

  const renderLeaderboard = () => {
    // This would use the getLeaderboard function from useWorkouts
    return (
      <View style={styles.tabContent}>
        <Text style={styles.comingSoon}>Leaderboard coming soon!</Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: group.name,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
          headerRight: isMember ? () => (
            <TouchableOpacity onPress={handleCreateWorkout}>
              <IconSymbol name="plus" size={24} color={colors.primary} />
            </TouchableOpacity>
          ) : undefined,
        }}
      />
      <ScrollView style={commonStyles.container}>
        <View style={styles.header}>
          <View style={styles.groupIcon}>
            <IconSymbol name="figure.strengthtraining.traditional" size={32} color={colors.primary} />
          </View>
          <Text style={commonStyles.title}>{group.name}</Text>
          <Text style={commonStyles.textSecondary}>{group.description}</Text>
          
          <View style={styles.groupStats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{group.members.length}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{groupWorkouts.length}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'workouts' && styles.activeTab]}
            onPress={() => setActiveTab('workouts')}
          >
            <Text style={[styles.tabText, activeTab === 'workouts' && styles.activeTabText]}>
              Workouts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'members' && styles.activeTab]}
            onPress={() => setActiveTab('members')}
          >
            <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
              Members
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
            onPress={() => setActiveTab('leaderboard')}
          >
            <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>
              Leaderboard
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'workouts' && renderWorkouts()}
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  groupIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupStats: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.card,
  },
  tabContent: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 32,
  },
  memberCount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  memberRole: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  comingSoon: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 32,
  },
});
