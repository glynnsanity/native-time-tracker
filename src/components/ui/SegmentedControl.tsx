import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { spacing, borderRadius, typography } from '../../theme';

interface Segment {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  segments: Segment[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: ViewStyle;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  selectedValue,
  onValueChange,
  style,
}) => {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }, style]}>
      {segments.map((segment) => {
        const isSelected = segment.value === selectedValue;
        return (
          <TouchableOpacity
            key={segment.value}
            style={[
              styles.segment,
              isSelected && [styles.segmentSelected, { backgroundColor: colors.card }],
            ]}
            onPress={() => onValueChange(segment.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              style={[
                styles.segmentText,
                { color: colors.textSecondary },
                isSelected && { color: colors.textPrimary },
              ]}
            >
              {segment.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  segmentSelected: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  segmentText: {
    ...typography.buttonSmall,
  },
});

export default SegmentedControl;
