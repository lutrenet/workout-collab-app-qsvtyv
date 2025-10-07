
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles } from '../styles/commonStyles';
import { Workout } from '../types';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  completedCount?: number;
}

export default function WorkoutCard({ workout, onPress, completedCount = 0 }: WorkoutCardProps) {
  return (
    <TouchableOpacity style={[commonStyles.card, styles.card]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <IconSymbol name="flame.fill" size={24} color={colors.secondary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDescription} numberOfLines={2}>
            {workout.description}
          </Text>
        </View>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.stat}>
          <IconSymbol name="list.bullet" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
        </View>
        <View style={styles.stat}>
          <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
          <Text style={styles.statText}>{completedCount} completed</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
