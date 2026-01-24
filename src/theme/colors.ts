export const colors = {
  // Primary brand colors
  primary: '#0B4850',
  primaryLight: '#0D5A64',
  primaryDark: '#073A42',

  // Background colors
  background: '#F5F7F9',
  backgroundSecondary: '#F6F6F6',
  card: '#FFFFFF',

  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',

  // Semantic colors
  danger: '#DC3545',
  dangerLight: '#F8D7DA',
  success: '#28A745',
  successLight: '#D4EDDA',
  warning: '#FFC107',
  warningLight: '#FFF3CD',

  // Accent colors (for charts and visual elements)
  accentBlue: '#007AFF',
  accentOrange: '#FF9500',
  accentGreen: '#34C759',
  accentTeal: '#0B4850',

  // Chart colors
  chartWork: '#0B4850',
  chartStudy: '#FF9500',
  chartReading: '#007AFF',
  chartExercise: '#34C759',

  // Border and divider colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  divider: '#E0E0E0',

  // Button states
  buttonPrimary: '#0B4850',
  buttonPrimaryPressed: '#0D5A64',
  buttonDanger: '#DC3545',
  buttonDangerPressed: '#C82333',
  buttonOutline: '#FFFFFF',
  buttonOutlineBorder: '#E0E0E0',
  buttonDark: '#000000',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;
