
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import { useWorkouts } from '../../hooks/useWorkouts';
import AuthScreen from '../../components/AuthScreen';
import LeaderboardItem from '../../components/LeaderboardItem';

export default function LeaderboardScreen() {
  const { user, loading: authLoading } = useAuth();
  const { groups, getLeaderboard } = useWorkouts();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  if (authLoading) {
    return (
      <View style={commonStyles.centerContent}>
        <Text style={commonStyles.text}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const userGroups = groups.filter(group => group.members.includes(user.id));
  const currentGroup = selectedGroupId ? groups.find(g => g.id === selectedGroupId) : null;
  const leaderboard = selectedGroupId ? getLeaderboard(selectedGroupId) : [];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Leaderboard',
        }}
      />
      <ScrollView style={commonStyles.container}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>🏆 Leaderboard</Text>
          <Text style={commonStyles.textSecondary}>
            See how you stack up against your workout buddies
          </Text>
        </View>

        {userGroups.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="trophy" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No groups joined</Text>
            <Text style={styles.emptyStateSubtext}>
              Join a group to see leaderboards and compete with others!
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.groupSelector}>
              <Text style={styles.selectorLabel}>Select Group:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {userGroups.map(group => (
                  <TouchableOpacity
                    key={group.id}
                    style={[
                      styles.groupChip,
                      selectedGroupId === group.id && styles.selectedGroupChip
                    ]}
                    onPress={() => setSelectedGroupId(group.id)}
                  >
                    <Text style={[
                      styles.groupChipText,
                      selectedGroupId === group.id && styles.selectedGroupChipText
                    ]}>
                      {group.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {selectedGroupId && currentGroup ? (
              <View style={styles.leaderboardContainer}>
                <Text style={styles.leaderboardTitle}>{currentGroup.name}</Text>
                {leaderboard.length === 0 ? (
                  <View style={styles.emptyLeaderboard}>
                    <IconSymbol name="chart.bar" size={32} color={colors.textSecondary} />
                    <Text style={styles.emptyLeaderboardText}>No progress yet</Text>
                    <Text style={styles.emptyLeaderboardSubtext}>
                      Complete some workouts to see rankings!
                    </Text>
                  </View>
                ) : (
                  leaderboard.map((entry, index) => (
                    <LeaderboardItem
                      key={entry.userId}
                      entry={entry}
                      index={index}
                    />
                  ))
                )}
              </View>
            ) : (
              <View style={styles.selectPrompt}>
                <IconSymbol name="hand.point.up.left" size={32} color={colors.textSecondary} />
                <Text style={styles.selectPromptText}>Select a group above to view leaderboard</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    alignItems: 'center',
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
  },
  groupSelector: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  groupChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedGroupChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  groupChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectedGroupChipText: {
    color: colors.card,
  },
  leaderboardContainer: {
    marginBottom: 24,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyLeaderboard: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 16,
  },
  emptyLeaderboardText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyLeaderboardSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectPrompt: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 16,
  },
  selectPromptText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
});
