
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '../../../styles/commonStyles';
import { useAuth } from '../../../hooks/useAuth';
import { useWorkouts } from '../../../hooks/useWorkouts';
import AuthScreen from '../../../components/AuthScreen';
import GroupCard from '../../../components/GroupCard';

export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth();
  const { groups, workouts, loading: workoutsLoading } = useWorkouts();

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

  const handleCreateGroup = () => {
    router.push('/create-group');
  };

  const handleJoinGroup = () => {
    router.push('/join-group');
  };

  const handleGroupPress = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'FitGroup',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <IconSymbol name="person.circle.fill" size={28} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={commonStyles.container}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Welcome back, {user.name}!</Text>
          <Text style={commonStyles.textSecondary}>
            Ready to crush your fitness goals?
          </Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[buttonStyles.primary, styles.actionButton]}
            onPress={handleCreateGroup}
          >
            <IconSymbol name="plus.circle.fill" size={20} color={colors.card} />
            <Text style={[commonStyles.buttonText, styles.actionButtonText]}>
              Create Group
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.outline, styles.actionButton]}
            onPress={handleJoinGroup}
          >
            <IconSymbol name="person.2.fill" size={20} color={colors.primary} />
            <Text style={[commonStyles.buttonTextOutline, styles.actionButtonText]}>
              Join Group
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Your Groups</Text>
          {userGroups.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="figure.strengthtraining.traditional" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No groups yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Create or join a group to start working out together!
              </Text>
            </View>
          ) : (
            userGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onPress={() => handleGroupPress(group.id)}
                memberCount={group.members.length}
                workoutCount={group.workouts.length}
              />
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    marginLeft: 0,
  },
  section: {
    marginBottom: 24,
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
});
