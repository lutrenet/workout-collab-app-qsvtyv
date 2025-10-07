
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface WorkoutGroup {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[];
  workouts: string[];
  createdAt: Date;
  isPublic: boolean;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  groupId: string;
  createdBy: string;
  createdAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  type: 'reps' | 'time' | 'distance' | 'weight';
  targetValue?: number;
  unit?: string;
  description?: string;
}

export interface WorkoutProgress {
  id: string;
  userId: string;
  workoutId: string;
  exerciseProgresses: ExerciseProgress[];
  completedAt: Date;
  totalScore: number;
}

export interface ExerciseProgress {
  exerciseId: string;
  value: number;
  unit: string;
  notes?: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalScore: number;
  completedWorkouts: number;
  rank: number;
  avatar?: string;
}
