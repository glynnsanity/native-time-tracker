import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ActivityInput from '../../components/ActivityInput';
import ActivityList from '../../components/ActivityList';
import ActivityEditModal from '../../components/ActivityEditModal';
import { useActivities } from '../../hooks/useActivities';
import { Activity } from '../../types';
import { colors, spacing, typography } from '../../theme';
import type { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Home'>;

const HomeScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const { activities, addActivity, toggleActivityRunning, deleteActivity } = useActivities();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleMenuPress = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsEditModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsEditModalVisible(false);
    setSelectedActivity(null);
  };

  const handleDelete = (id: string) => {
    deleteActivity(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Today</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Calendar">
          <Ionicons name="calendar-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ActivityInput onAddActivity={addActivity} />
        <ActivityList
          activities={activities}
          onStartStop={toggleActivityRunning}
          onMenuPress={handleMenuPress}
        />
      </View>

      <ActivityEditModal
        visible={isEditModalVisible}
        activity={selectedActivity}
        onClose={handleCloseModal}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
});

export default HomeScreen;
