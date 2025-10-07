
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles } from '../styles/commonStyles';
import { LeaderboardEntry } from '../types';

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  index: number;
}

export default function LeaderboardItem({ entry, index }: LeaderboardItemProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return { name: 'trophy.fill', color: '#FFD700' };
      case 2:
        return { name: 'medal.fill', color: '#C0C0C0' };
      case 3:
        return { name: 'medal.fill', color: '#CD7F32' };
      default:
        return { name: 'number', color: colors.textSecondary };
    }
  };

  const rankIcon = getRankIcon(entry.rank);

  return (
    <View style={[commonStyles.card, styles.card]}>
      <View style={styles.rankContainer}>
        <IconSymbol name={rankIcon.name as any} size={24} color={rankIcon.color} />
        <Text style={styles.rankText}>#{entry.rank}</Text>
      </View>
      
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <IconSymbol name="person.fill" size={20} color={colors.card} />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{entry.userName}</Text>
          <Text style={styles.workoutCount}>{entry.completedWorkouts} workouts</Text>
        </View>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{entry.totalScore}</Text>
        <Text style={styles.scoreLabel}>points</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    paddingVertical: 12,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 40,
  },
  rankText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  workoutCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
