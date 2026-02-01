import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ActivityInput from '../../components/ActivityInput';
import ActivityList from '../../components/ActivityList';
import ActivityEditModal from '../../components/ActivityEditModal';
import { useActivities } from '../../hooks/useActivities';
import { Activity } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../theme';
import type { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Home'>;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const HomeScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const {
    activities,
    addActivity,
    toggleActivityRunning,
    deleteActivity,
    editActivityName,
    editActivityTime,
  } = useActivities();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  const handleEditName = (id: string, newName: string) => {
    editActivityName(id, newName);
  };

  const handleEditTime = (id: string, newTime: number) => {
    editActivityTime(id, newTime);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatHeaderDate = (): string => {
    if (isToday(selectedDate)) {
      return 'Today';
    }
    return `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}`;
  };

  // Filter activities by selected date (based on when they were last updated)
  const filteredActivities = useMemo(() => {
    // For now, show all activities. In a full implementation,
    // you'd filter by timeEntries that fall on the selected date.
    return activities;
  }, [activities, selectedDate]);

  return (
    <SafeAreaView style={styles.container} testID="home-screen">
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          testID="settings-button"
        >
          <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{formatHeaderDate()}</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Calendar"
          onPress={() => setIsCalendarVisible(true)}
          testID="calendar-button"
        >
          <Ionicons name="calendar-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ActivityInput onAddActivity={addActivity} />
        <ActivityList
          activities={filteredActivities}
          onStartStop={toggleActivityRunning}
          onMenuPress={handleMenuPress}
        />
      </View>

      <ActivityEditModal
        visible={isEditModalVisible}
        activity={selectedActivity}
        onClose={handleCloseModal}
        onDelete={handleDelete}
        onEditName={handleEditName}
        onEditTime={handleEditTime}
      />

      <CalendarModal
        visible={isCalendarVisible}
        selectedDate={selectedDate}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setIsCalendarVisible(false);
        }}
        onClose={() => setIsCalendarVisible(false)}
      />
    </SafeAreaView>
  );
};

// Calendar Modal Component
interface CalendarModalProps {
  visible: boolean;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
}) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setViewDate(newDate);
  };

  const handleSelectDate = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onSelectDate(newDate);
  };

  const isSelected = (day: number): boolean => {
    return (
      day === selectedDate.getDate() &&
      viewDate.getMonth() === selectedDate.getMonth() &&
      viewDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isTodayDate = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={calendarStyles.dayCell} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const selected = isSelected(day);
      const today = isTodayDate(day);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            calendarStyles.dayCell,
            selected && calendarStyles.selectedDay,
            today && !selected && calendarStyles.todayDay,
          ]}
          onPress={() => handleSelectDate(day)}
        >
          <Text
            style={[
              calendarStyles.dayText,
              selected && calendarStyles.selectedDayText,
              today && !selected && calendarStyles.todayDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableOpacity style={calendarStyles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={calendarStyles.container}>
          <View style={calendarStyles.header}>
            <TouchableOpacity onPress={() => navigateMonth(-1)}>
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={calendarStyles.monthYear}>
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth(1)}>
              <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={calendarStyles.weekdays}>
            {WEEKDAYS.map((day) => (
              <Text key={day} style={calendarStyles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={calendarStyles.daysGrid}>{renderCalendarDays()}</View>

          <TouchableOpacity
            style={calendarStyles.todayButton}
            onPress={() => {
              onSelectDate(new Date());
            }}
          >
            <Text style={calendarStyles.todayButtonText}>Go to Today</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const calendarStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 340,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  monthYear: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    ...typography.bodySmall,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  selectedDay: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  selectedDayText: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  todayDay: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  todayDayText: {
    color: colors.primary,
    fontWeight: '600',
  },
  todayButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  todayButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});

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
