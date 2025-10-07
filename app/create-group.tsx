
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
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useAuth } from '../hooks/useAuth';
import { useWorkouts } from '../hooks/useWorkouts';

export default function CreateGroupScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { createGroup } = useWorkouts();

  const handleCreateGroup = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a group');
      return;
    }

    setLoading(true);
    try {
      const newGroup = await createGroup(name.trim(), description.trim(), user.id);
      Alert.alert('Success', 'Group created successfully!', [
        { text: 'OK', onPress: () => router.replace(`/group/${newGroup.id}`) }
      ]);
    } catch (error) {
      console.log('Create group error:', error);
      Alert.alert('Error', 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Group',
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
              <IconSymbol name="plus.circle.fill" size={48} color={colors.primary} />
            </View>
            <Text style={commonStyles.title}>Create New Group</Text>
            <Text style={commonStyles.textSecondary}>
              Start a fitness community and invite others to join your journey
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="e.g., Morning Warriors, HIIT Squad"
              value={name}
              onChangeText={setName}
              maxLength={50}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[commonStyles.input, styles.textArea]}
              placeholder="Describe your group's goals, workout style, and what members can expect..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={200}
            />

            <TouchableOpacity
              style={[buttonStyles.primary, loading && styles.disabledButton]}
              onPress={handleCreateGroup}
              disabled={loading}
            >
              <Text style={commonStyles.buttonText}>
                {loading ? 'Creating...' : 'Create Group'}
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
    backgroundColor: colors.highlight,
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
    height: 100,
    textAlignVertical: 'top',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
