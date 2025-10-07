
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '../styles/commonStyles';
import { useAuth } from '../hooks/useAuth';
import { useWorkouts } from '../hooks/useWorkouts';
import GroupCard from '../components/GroupCard';

export default function JoinGroupScreen() {
  const { user } = useAuth();
  const { groups, joinGroup } = useWorkouts();

  if (!user) {
    return (
      <View style={commonStyles.centerContent}>
        <Text style={commonStyles.text}>Please log in to join groups</Text>
      </View>
    );
  }

  const availableGroups = groups.filter(group => 
    group.isPublic && !group.members.includes(user.id)
  );

  const handleJoinGroup = async (groupId: string) => {
    const success = await joinGroup(groupId, user.id);
    if (success) {
      Alert.alert('Success', 'You have joined the group!', [
        { text: 'OK', onPress: () => router.replace(`/group/${groupId}`) }
      ]);
    } else {
      Alert.alert('Error', 'Failed to join group');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Join Group',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={commonStyles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <IconSymbol name="person.2.fill" size={48} color={colors.primary} />
          </View>
          <Text style={commonStyles.title}>Join a Group</Text>
          <Text style={commonStyles.textSecondary}>
            Find a fitness community that matches your goals
          </Text>
        </View>

        {availableGroups.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="magnifyingglass" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No groups available</Text>
            <Text style={styles.emptyStateSubtext}>
              All public groups have been joined or there are no groups yet.
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.replace('/create-group')}
            >
              <Text style={styles.createButtonText}>Create Your Own Group</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.groupsList}>
            {availableGroups.map(group => (
              <View key={group.id} style={styles.groupItem}>
                <GroupCard
                  group={group}
                  onPress={() => {}} // Disabled for join screen
                  memberCount={group.members.length}
                  workoutCount={group.workouts.length}
                />
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => handleJoinGroup(group.id)}
                >
                  <IconSymbol name="plus.circle.fill" size={20} color={colors.card} />
                  <Text style={styles.joinButtonText}>Join Group</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  groupsList: {
    paddingBottom: 100,
  },
  groupItem: {
    position: 'relative',
    marginBottom: 16,
  },
  joinButton: {
    position: 'absolute',
    bottom: 16,
    right: 32,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  joinButtonText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '600',
  },
});
