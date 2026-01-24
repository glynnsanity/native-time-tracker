import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { DailyData } from '../../hooks/useAnalytics';
import { colors, spacing, typography } from '../../theme';

interface SimpleAreaChartProps {
  data: DailyData[];
  maxValue: number;
  width?: number;
  height?: number;
}

const SimpleAreaChart: React.FC<SimpleAreaChartProps> = ({
  data,
  maxValue,
  width = Dimensions.get('window').width - 80,
  height = 200,
}) => {
  const padding = { top: 20, right: 10, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate points
  const points = data.map((item, index) => ({
    x: padding.left + (index / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - (item.totalSeconds / maxValue) * chartHeight,
    ...item,
  }));

  // Create path for the area
  const createAreaPath = () => {
    if (points.length === 0) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    // Create smooth curve through points
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    // Close the area
    path += ` L ${points[points.length - 1].x} ${padding.top + chartHeight}`;
    path += ` L ${points[0].x} ${padding.top + chartHeight}`;
    path += ' Z';

    return path;
  };

  // Create path for the line
  const createLinePath = () => {
    if (points.length === 0) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  // Y-axis labels
  const yLabels = [0, 4, 8, 12];

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {yLabels.map((label, index) => {
          const y = padding.top + chartHeight - (label * 3600 / maxValue) * chartHeight;
          return (
            <Line
              key={index}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke={colors.borderLight}
              strokeWidth={1}
            />
          );
        })}

        {/* Area */}
        <Path d={createAreaPath()} fill="url(#areaGradient)" />

        {/* Line */}
        <Path
          d={createLinePath()}
          stroke={colors.primary}
          strokeWidth={2}
          fill="none"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={colors.card}
            stroke={colors.primary}
            strokeWidth={2}
          />
        ))}
      </Svg>

      {/* Y-axis labels */}
      <View style={[styles.yAxisLabels, { height: chartHeight, top: padding.top }]}>
        {yLabels.reverse().map((label, index) => (
          <Text key={index} style={styles.yLabel}>
            {label}h
          </Text>
        ))}
      </View>

      {/* X-axis labels */}
      <View style={[styles.xAxisLabels, { left: padding.left, width: chartWidth }]}>
        {data.map((item, index) => (
          <View key={index} style={styles.xLabelContainer}>
            <Text style={styles.xLabel}>{item.dayName}</Text>
            <Text style={styles.xLabelDate}>{item.dayNum}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    width: 35,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: spacing.xs,
  },
  yLabel: {
    ...typography.labelSmall,
    color: colors.textTertiary,
  },
  xAxisLabels: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xLabelContainer: {
    alignItems: 'center',
  },
  xLabel: {
    ...typography.labelSmall,
    color: colors.textTertiary,
  },
  xLabelDate: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
});

export default SimpleAreaChart;
