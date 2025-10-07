
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles } from '../styles/commonStyles';
import { WorkoutGroup } from '../types';

interface GroupCardProps {
  group: WorkoutGroup;
  onPress: () => void;
  memberCount?: number;
  workoutCount?: number;
}

export default function GroupCard({ group, onPress, memberCount = 0, workoutCount = 0 }: GroupCardProps) {
  return (
    <TouchableOpacity style={[commonStyles.card, styles.card]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <IconSymbol name="figure.strengthtraining.traditional" size={24} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupDescription} numberOfLines={2}>
            {group.description}
          </Text>
        </View>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.stat}>
          <IconSymbol name="person.2.fill" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{memberCount} members</Text>
        </View>
        <View style={styles.stat}>
          <IconSymbol name="dumbbell.fill" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{workoutCount} workouts</Text>
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
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  groupDescription: {
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
