import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ActivityInput from '../../components/ActivityInput';
import ActivityList from '../../components/ActivityList';
import ActivityEditModal from '../../components/ActivityEditModal';
import { useActivities } from '../../hooks/useActivities';
import { useThemeColors } from '../../hooks/useThemeColors';
import { Activity } from '../../types';
import { spacing, typography, borderRadius } from '../../theme';
import type { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Home'>;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const HomeScreen: React.FC<Props> = () => {
  const colors = useThemeColors();
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

  const filteredActivities = useMemo(() => {
    return activities;
  }, [activities, selectedDate]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} testID="home-screen">
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{formatHeaderDate()}</Text>
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
  const colors = useThemeColors();
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

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={calendarStyles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const selected = isSelected(day);
      const today = isTodayDate(day);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            calendarStyles.dayCell,
            selected && [calendarStyles.selectedDay, { backgroundColor: colors.primary }],
            today && !selected && [calendarStyles.todayDay, { borderColor: colors.primary }],
          ]}
          onPress={() => handleSelectDate(day)}
        >
          <Text
            style={[
              calendarStyles.dayText,
              { color: colors.textPrimary },
              selected && calendarStyles.selectedDayText,
              today && !selected && { color: colors.primary, fontWeight: '600' as const },
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
      <TouchableOpacity style={[calendarStyles.overlay, { backgroundColor: colors.overlay }]} activeOpacity={1} onPress={onClose}>
        <View style={[calendarStyles.container, { backgroundColor: colors.card }]}>
          <View style={calendarStyles.header}>
            <TouchableOpacity onPress={() => navigateMonth(-1)}>
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[calendarStyles.monthYear, { color: colors.textPrimary }]}>
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth(1)}>
              <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={calendarStyles.weekdays}>
            {WEEKDAYS.map((day) => (
              <Text key={day} style={[calendarStyles.weekdayText, { color: colors.textTertiary }]}>
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
            <Text style={[calendarStyles.todayButtonText, { color: colors.primary }]}>Go to Today</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const calendarStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
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
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    ...typography.bodySmall,
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
  },
  selectedDay: {
    borderRadius: borderRadius.full,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  todayDay: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
  },
  todayButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  todayButtonText: {
    ...typography.body,
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  content: {
    flex: 1,
  },
});

export default HomeScreen;
