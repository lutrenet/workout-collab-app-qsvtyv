
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useAuth } from '../hooks/useAuth';
import { useWorkouts } from '../hooks/useWorkouts';
import { Exercise } from '../types';

export default function CreateWorkoutScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { createWorkout } = useWorkouts();

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      type: 'reps',
      targetValue: 0,
      unit: 'reps',
      description: '',
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleCreateWorkout = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in workout name and description');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    const incompleteExercises = exercises.filter(ex => !ex.name.trim());
    if (incompleteExercises.length > 0) {
      Alert.alert('Error', 'Please fill in all exercise names');
      return;
    }

    if (!user || !groupId) {
      Alert.alert('Error', 'Missing required information');
      return;
    }

    setLoading(true);
    try {
      const workout = await createWorkout({
        name: name.trim(),
        description: description.trim(),
        exercises,
        groupId,
        createdBy: user.id,
      });
      
      Alert.alert('Success', 'Workout created successfully!', [
        { text: 'OK', onPress: () => router.replace(`/workout/${workout.id}`) }
      ]);
    } catch (error) {
      console.log('Create workout error:', error);
      Alert.alert('Error', 'Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Workout',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView 
        style={commonStyles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <IconSymbol name="flame.fill" size={48} color={colors.secondary} />
            </View>
            <Text style={commonStyles.title}>Create Workout</Text>
            <Text style={commonStyles.textSecondary}>
              Design a workout routine for your group
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Workout Name</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="e.g., Full Body HIIT, Upper Body Strength"
              value={name}
              onChangeText={setName}
              maxLength={50}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[commonStyles.input, styles.textArea]}
              placeholder="Describe the workout, its goals, and any special instructions..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={200}
            />

            <View style={styles.exercisesSection}>
              <View style={styles.exercisesHeader}>
                <Text style={styles.label}>Exercises</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addExercise}
                >
                  <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {exercises.map((exercise, index) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseNumber}>Exercise {index + 1}</Text>
                    <TouchableOpacity
                      onPress={() => removeExercise(index)}
                      style={styles.removeButton}
                    >
                      <IconSymbol name="trash" size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={commonStyles.input}
                    placeholder="Exercise name (e.g., Push-ups, Squats)"
                    value={exercise.name}
                    onChangeText={(value) => updateExercise(index, 'name', value)}
                  />

                  <View style={styles.exerciseRow}>
                    <View style={styles.typeSelector}>
                      <Text style={styles.inputLabel}>Type:</Text>
                      <View style={styles.typeButtons}>
                        {(['reps', 'time', 'distance', 'weight'] as const).map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.typeButton,
                              exercise.type === type && styles.selectedTypeButton
                            ]}
                            onPress={() => {
                              updateExercise(index, 'type', type);
                              updateExercise(index, 'unit', type === 'time' ? 'seconds' : 
                                type === 'distance' ? 'meters' : 
                                type === 'weight' ? 'kg' : 'reps');
                            }}
                          >
                            <Text style={[
                              styles.typeButtonText,
                              exercise.type === type && styles.selectedTypeButtonText
                            ]}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  <View style={styles.exerciseRow}>
                    <View style={styles.targetInput}>
                      <Text style={styles.inputLabel}>Target:</Text>
                      <TextInput
                        style={[commonStyles.input, styles.smallInput]}
                        placeholder="0"
                        value={exercise.targetValue?.toString() || ''}
                        onChangeText={(value) => updateExercise(index, 'targetValue', parseInt(value) || 0)}
                        keyboardType="numeric"
                      />
                    </View>
                    <Text style={styles.unitText}>{exercise.unit}</Text>
                  </View>
                </View>
              ))}

              {exercises.length === 0 && (
                <View style={styles.noExercises}>
                  <IconSymbol name="dumbbell" size={32} color={colors.textSecondary} />
                  <Text style={styles.noExercisesText}>No exercises added yet</Text>
                  <TouchableOpacity
                    style={styles.addFirstButton}
                    onPress={addExercise}
                  >
                    <Text style={styles.addFirstButtonText}>Add First Exercise</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[buttonStyles.primary, loading && styles.disabledButton]}
              onPress={handleCreateWorkout}
              disabled={loading}
            >
              <Text style={commonStyles.buttonText}>
                {loading ? 'Creating...' : 'Create Workout'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  exercisesSection: {
    marginTop: 24,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    padding: 4,
  },
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  removeButton: {
    padding: 4,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  typeSelector: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  selectedTypeButtonText: {
    color: colors.card,
  },
  targetInput: {
    flex: 1,
  },
  smallInput: {
    marginVertical: 0,
  },
  unitText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  noExercises: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  noExercisesText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 16,
  },
  addFirstButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addFirstButtonText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
