
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import { useWorkouts } from '../../hooks/useWorkouts';
import AuthScreen from '../../components/AuthScreen';

export default function ProfileScreen() {
  const { user, logout, loading: authLoading } = useAuth();
  const { groups, progress } = useWorkouts();

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
  const userProgress = progress.filter(p => p.userId === user.id);
  const totalScore = userProgress.reduce((sum, p) => sum + p.totalScore, 0);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout}>
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color={colors.error} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={commonStyles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <IconSymbol name="person.fill" size={48} color={colors.card} />
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="person.2.fill" size={24} color={colors.primary} />
            <Text style={styles.statNumber}>{userGroups.length}</Text>
            <Text style={styles.statLabel}>Groups Joined</Text>
          </View>
          
          <View style={styles.statCard}>
            <IconSymbol name="flame.fill" size={24} color={colors.secondary} />
            <Text style={styles.statNumber}>{userProgress.length}</Text>
            <Text style={styles.statLabel}>Workouts Done</Text>
          </View>
          
          <View style={styles.statCard}>
            <IconSymbol name="star.fill" size={24} color={colors.accent} />
            <Text style={styles.statNumber}>{totalScore}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Recent Activity</Text>
          {userProgress.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="clock" size={32} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No activity yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start working out to see your progress here!
              </Text>
            </View>
          ) : (
            <View style={commonStyles.card}>
              {userProgress.slice(-5).reverse().map((p, index) => (
                <View key={p.id} style={[styles.activityItem, index > 0 && styles.activityItemBorder]}>
                  <View style={styles.activityIcon}>
                    <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>Workout Completed</Text>
                    <Text style={styles.activityDate}>
                      {new Date(p.completedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.activityScore}>+{p.totalScore}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[buttonStyles.outline, styles.logoutButton]}
            onPress={handleLogout}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={colors.error} />
            <Text style={[commonStyles.buttonTextOutline, { color: colors.error }]}>
              Logout
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
    padding: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  activityIcon: {
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  activityDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activityScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderColor: colors.error,
  },
});
