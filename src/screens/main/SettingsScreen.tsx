import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Share,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui';
import { useActivities } from '../../hooks/useActivities';
import { useSettings, TimeFormat, WeekStart, ThemeMode } from '../../contexts/SettingsContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { exportActivitiesAsCSV } from '../../services/activitiesService';
import { spacing, typography, borderRadius } from '../../theme';
import type { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Settings'>;

const APP_VERSION = '0.0.1';

const SettingsScreen: React.FC<Props> = () => {
  const colors = useThemeColors();
  const { activities, setActivities } = useActivities();
  const { timeFormat, setTimeFormat, weekStart, setWeekStart, themeMode, setThemeMode } = useSettings();

  const handleExportData = async () => {
    if (activities.length === 0) {
      Alert.alert('No Data', 'There are no activities to export.');
      return;
    }

    const csv = exportActivitiesAsCSV(activities);

    try {
      await Share.share({
        message: csv,
        title: 'Time Tracking Export',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all activities and time entries. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setActivities([]);
          },
        },
      ]
    );
  };

  const toggleTimeFormat = () => {
    setTimeFormat(timeFormat === 'hms' ? 'hm' : 'hms');
  };

  const toggleWeekStart = () => {
    setWeekStart(weekStart === 'monday' ? 'sunday' : 'monday');
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.content}>
          <Card padding="none" shadow={false} style={{ backgroundColor: colors.card }}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <TouchableOpacity style={styles.row} onPress={toggleTheme}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.accentBackgroundTeal }]}>
                  <Ionicons
                    name={themeMode === 'dark' ? 'moon' : 'sunny'}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.rowLabel}>Appearance</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>{themeMode === 'dark' ? 'Dark' : 'Light'}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            <TouchableOpacity style={styles.row} onPress={toggleTimeFormat}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.accentBackgroundTeal }]}>
                  <Ionicons name="time-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.rowLabel}>Time display</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>{timeFormat === 'hms' ? 'HH:MM:SS' : 'HH:MM'}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            <TouchableOpacity style={styles.row} onPress={toggleWeekStart}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.accentBackgroundTeal }]}>
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.rowLabel}>Week starts on</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>{weekStart === 'monday' ? 'Monday' : 'Sunday'}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>
          </Card>

          <View style={styles.sectionSpacer} />

          <Card padding="none" shadow={false} style={{ backgroundColor: colors.card }}>
            <Text style={styles.sectionTitle}>Data</Text>

            <TouchableOpacity style={styles.row} onPress={handleExportData}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.accentBackgroundTeal }]}>
                  <Ionicons name="download-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.rowLabel}>Export data (CSV)</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            <TouchableOpacity style={styles.row} onPress={handleClearAllData}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.dangerLight }]}>
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.danger }]}>Clear all data</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </Card>

          <View style={styles.sectionSpacer} />

          <Card padding="none" shadow={false} style={{ backgroundColor: colors.card }}>
            <Text style={styles.sectionTitle}>About</Text>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.accentBackgroundTeal }]}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.rowLabel}>Version</Text>
              </View>
              <Text style={styles.rowValue}>{APP_VERSION}</Text>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.accentBackgroundTeal }]}>
                  <Ionicons name="timer-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.rowLabel}>Simple time tracking</Text>
              </View>
            </View>
          </Card>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (colors: ReturnType<typeof import('../../hooks/useThemeColors').useThemeColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
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
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    sectionTitle: {
      ...typography.body,
      fontWeight: '600',
      color: colors.textPrimary,
      padding: spacing.lg,
      paddingBottom: spacing.sm,
    },
    sectionSpacer: {
      height: spacing.xl,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    rowLabel: {
      ...typography.body,
      color: colors.textPrimary,
    },
    rowValue: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    rowDivider: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginLeft: 60,
    },
    bottomPadding: {
      height: spacing['3xl'],
    },
  });

export default SettingsScreen;
