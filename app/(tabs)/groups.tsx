
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import { useWorkouts } from '../../hooks/useWorkouts';
import AuthScreen from '../../components/AuthScreen';
import GroupCard from '../../components/GroupCard';

export default function GroupsScreen() {
  const { user, loading: authLoading } = useAuth();
  const { groups, loading: workoutsLoading } = useWorkouts();

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

  const publicGroups = groups.filter(group => group.isPublic);

  const handleGroupPress = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  const handleCreateGroup = () => {
    router.push('/create-group');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Discover Groups',
          headerRight: () => (
            <TouchableOpacity onPress={handleCreateGroup}>
              <IconSymbol name="plus" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={commonStyles.container}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Find Your Tribe</Text>
          <Text style={commonStyles.textSecondary}>
            Join workout groups and achieve your goals together
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Public Groups</Text>
          {publicGroups.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="magnifyingglass" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No public groups yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Be the first to create a public group!
              </Text>
              <TouchableOpacity
                style={[buttonStyles.primary, styles.createButton]}
                onPress={handleCreateGroup}
              >
                <Text style={commonStyles.buttonText}>Create Group</Text>
              </TouchableOpacity>
            </View>
          ) : (
            publicGroups.map(group => (
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
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 32,
  },
});
