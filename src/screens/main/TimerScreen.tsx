import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';
import type { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Timer'>;

type TimerMode = 'focus' | 'break';

interface TimerPreset {
  label: string;
  minutes: number;
}

const PRESETS: TimerPreset[] = [
  { label: '15m', minutes: 15 },
  { label: '25m', minutes: 25 },
  { label: '45m', minutes: 45 },
  { label: '60m', minutes: 60 },
];

const TimerScreen: React.FC<Props> = () => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60); // Default 25 minutes
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(1); // 25m selected by default

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (remainingSeconds === 0 && isRunning) {
      setIsRunning(false);
      // Timer completed - could add notification here
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handlePresetSelect = (index: number) => {
    const preset = PRESETS[index];
    setSelectedPreset(index);
    setTotalSeconds(preset.minutes * 60);
    setRemainingSeconds(preset.minutes * 60);
    setIsRunning(false);
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setRemainingSeconds(totalSeconds);
    setIsRunning(false);
  };

  const toggleMode = () => {
    const newMode = mode === 'focus' ? 'break' : 'focus';
    setMode(newMode);
    const newTime = newMode === 'focus' ? 25 * 60 : 5 * 60;
    setTotalSeconds(newTime);
    setRemainingSeconds(newTime);
    setIsRunning(false);
    setSelectedPreset(newMode === 'focus' ? 1 : -1);
  };

  const progress = remainingSeconds / totalSeconds;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Focus Timer</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'focus' && styles.modeButtonActive]}
            onPress={() => mode !== 'focus' && toggleMode()}
          >
            <Text style={[styles.modeButtonText, mode === 'focus' && styles.modeButtonTextActive]}>
              Focus
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'break' && styles.modeButtonActive]}
            onPress={() => mode !== 'break' && toggleMode()}
          >
            <Text style={[styles.modeButtonText, mode === 'break' && styles.modeButtonTextActive]}>
              Break
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerContainer}>
          <View style={styles.circleContainer}>
            <Svg width={260} height={260} style={styles.svgContainer}>
              <Circle
                cx={130}
                cy={130}
                r={120}
                stroke={colors.border}
                strokeWidth={8}
                fill="none"
              />
              <Circle
                cx={130}
                cy={130}
                r={120}
                stroke={mode === 'focus' ? colors.primary : colors.accentGreen}
                strokeWidth={8}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 130 130)"
              />
            </Svg>
            <View style={styles.timerTextContainer}>
              <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
              <Text style={styles.timerLabel}>{mode === 'focus' ? 'Focus Time' : 'Break Time'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.presetsContainer}>
          {PRESETS.map((preset, index) => (
            <TouchableOpacity
              key={preset.label}
              style={[styles.presetButton, selectedPreset === index && styles.presetButtonActive]}
              onPress={() => handlePresetSelect(index)}
            >
              <Text style={[styles.presetText, selectedPreset === index && styles.presetTextActive]}>
                {preset.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="refresh" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, isRunning && styles.pauseButton]}
            onPress={handleStartPause}
          >
            <Ionicons
              name={isRunning ? 'pause' : 'play'}
              size={32}
              color={colors.textInverse}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={toggleMode}>
            <Ionicons name="play-skip-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Simple SVG components for the circular progress
const Svg = ({ width, height, style, children }: { width: number; height: number; style?: any; children: React.ReactNode }) => (
  <View style={[{ width, height }, style]}>{children}</View>
);

const Circle = ({
  cx,
  cy,
  r,
  stroke,
  strokeWidth,
  fill,
  strokeDasharray,
  strokeDashoffset,
  strokeLinecap,
  transform,
}: {
  cx: number;
  cy: number;
  r: number;
  stroke: string;
  strokeWidth: number;
  fill: string;
  strokeDasharray?: number;
  strokeDashoffset?: number;
  strokeLinecap?: string;
  transform?: string;
}) => {
  // This is a placeholder - in production, use react-native-svg
  const size = r * 2;
  const borderStyle = {
    width: size,
    height: size,
    borderRadius: r,
    borderWidth: strokeWidth,
    borderColor: stroke,
    position: 'absolute' as const,
    left: cx - r,
    top: cy - r,
  };

  if (strokeDasharray) {
    // For the progress circle, we'll use opacity based on progress
    const progress = strokeDashoffset ? 1 - (strokeDashoffset / strokeDasharray) : 1;
    return (
      <View
        style={[
          borderStyle,
          {
            borderColor: stroke,
            opacity: progress > 0 ? 1 : 0,
          },
        ]}
      />
    );
  }

  return <View style={borderStyle} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.full,
    padding: spacing.xs,
    marginTop: spacing.lg,
  },
  modeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  modeButtonTextActive: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    position: 'absolute',
  },
  timerTextContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timerLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  presetsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  presetButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetButtonActive: {
    backgroundColor: colors.accentBackgroundTeal,
    borderColor: colors.primary,
  },
  presetText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  presetTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing['3xl'],
  },
  resetButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: colors.warning,
  },
  skipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default TimerScreen;
