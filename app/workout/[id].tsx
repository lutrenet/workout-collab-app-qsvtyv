
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import { useWorkouts } from '../../hooks/useWorkouts';
import { ExerciseProgress } from '../../types';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { workouts, logProgress, progress } = useWorkouts();
  const [exerciseValues, setExerciseValues] = useState<{ [key: string]: string }>({});
  const [isLogging, setIsLogging] = useState(false);

  if (!user || !id) {
    return (
      <View style={commonStyles.centerContent}>
        <Text style={commonStyles.text}>Loading...</Text>
      </View>
    );
  }

  const workout = workouts.find(w => w.id === id);
  if (!workout) {
    return (
      <View style={commonStyles.centerContent}>
        <Text style={commonStyles.text}>Workout not found</Text>
      </View>
    );
  }

  const userProgress = progress.filter(p => p.workoutId === id && p.userId === user.id);
  const hasCompleted = userProgress.length > 0;
  const lastProgress = userProgress[userProgress.length - 1];

  const handleLogProgress = async () => {
    const exerciseProgresses: ExerciseProgress[] = workout.exercises.map(exercise => ({
      exerciseId: exercise.id,
      value: parseInt(exerciseValues[exercise.id] || '0'),
      unit: exercise.unit || 'reps',
      notes: '',
    }));

    // Calculate total score (simple scoring system)
    const totalScore = exerciseProgresses.reduce((sum, ep) => {
      const exercise = workout.exercises.find(e => e.id === ep.exerciseId);
      if (!exercise || !exercise.targetValue) return sum;
      
      const percentage = (ep.value / exercise.targetValue) * 100;
      return sum + Math.min(percentage, 150); // Cap at 150% for bonus points
    }, 0);

    setIsLogging(true);
    try {
      await logProgress({
        userId: user.id,
        workoutId: id,
        exerciseProgresses,
        completedAt: new Date(),
        totalScore: Math.round(totalScore),
      });

      Alert.alert('Success', 'Progress logged successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.log('Log progress error:', error);
      Alert.alert('Error', 'Failed to log progress');
    } finally {
      setIsLogging(false);
    }
  };

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case 'reps': return 'repeat';
      case 'time': return 'clock';
      case 'distance': return 'location';
      case 'weight': return 'scalemass';
      default: return 'dumbbell';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: workout.name,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={commonStyles.container}>
        <View style={styles.header}>
          <View style={styles.workoutIcon}>
            <IconSymbol name="flame.fill" size={32} color={colors.secondary} />
          </View>
          <Text style={commonStyles.title}>{workout.name}</Text>
          <Text style={commonStyles.textSecondary}>{workout.description}</Text>
          
          {hasCompleted && (
            <View style={styles.completedBadge}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={styles.completedText}>
                Last completed: {new Date(lastProgress.completedAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {workout.exercises.map((exercise, index) => {
            const lastValue = lastProgress?.exerciseProgresses.find(ep => ep.exerciseId === exercise.id)?.value;
            
            return (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseInfo}>
                    <View style={styles.exerciseIconContainer}>
                      <IconSymbol 
                        name={getExerciseIcon(exercise.type) as any} 
                        size={20} 
                        color={colors.primary} 
                      />
                    </View>
                    <View style={styles.exerciseDetails}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseTarget}>
                        Target: {exercise.targetValue} {exercise.unit}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.progressSection}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Your Result:</Text>
                    <View style={styles.inputRow}>
                      <TextInput
                        style={styles.progressInput}
                        placeholder="0"
                        value={exerciseValues[exercise.id] || ''}
                        onChangeText={(value) => setExerciseValues(prev => ({
                          ...prev,
                          [exercise.id]: value
                        }))}
                        keyboardType="numeric"
                      />
                      <Text style={styles.unitLabel}>{exercise.unit}</Text>
                    </View>
                  </View>

                  {lastValue !== undefined && (
                    <View style={styles.lastResult}>
                      <Text style={styles.lastResultLabel}>Last: {lastValue} {exercise.unit}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[buttonStyles.primary, isLogging && styles.disabledButton]}
            onPress={handleLogProgress}
            disabled={isLogging}
          >
            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.card} />
            <Text style={[commonStyles.buttonText, styles.buttonTextWithIcon]}>
              {isLogging ? 'Logging...' : 'Log Progress'}
            </Text>
          </TouchableOpacity>
        </View>
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
  workoutIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
    gap: 6,
  },
  completedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  exercisesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  exerciseHeader: {
    marginBottom: 16,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  exerciseTarget: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.text,
    minWidth: 80,
    textAlign: 'center',
  },
  unitLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  lastResult: {
    alignItems: 'flex-end',
  },
  lastResultLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  actionSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonTextWithIcon: {
    marginLeft: 8,
  },
});
