export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Common layout values
export const layout = {
  screenPadding: spacing.lg,
  cardPadding: spacing.lg,
  inputPadding: spacing.lg,
  buttonPaddingVertical: spacing.lg,
  buttonPaddingHorizontal: spacing['2xl'],
  iconSize: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
  bottomTabHeight: 60,
  headerHeight: 56,
} as const;

export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
