export const lightColors = {
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
  chartPurple: '#AF52DE',
  chartPink: '#FF2D55',

  // Additional accent backgrounds
  accentBackgroundTeal: '#E8F4F5',

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

export const darkColors: typeof lightColors = {
  // Primary brand colors
  primary: '#2AABB8',
  primaryLight: '#35BCC9',
  primaryDark: '#1F8A95',

  // Background colors
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  card: '#1E1E1E',

  // Text colors
  textPrimary: '#E8E8E8',
  textSecondary: '#AAAAAA',
  textTertiary: '#777777',
  textInverse: '#121212',

  // Semantic colors
  danger: '#FF6B7A',
  dangerLight: '#3D2023',
  success: '#4ADE80',
  successLight: '#1A3D2A',
  warning: '#FFD060',
  warningLight: '#3D3520',

  // Accent colors
  accentBlue: '#5AC8FA',
  accentOrange: '#FFB340',
  accentGreen: '#4ADE80',
  accentTeal: '#2AABB8',

  // Chart colors
  chartWork: '#2AABB8',
  chartStudy: '#FFB340',
  chartReading: '#5AC8FA',
  chartExercise: '#4ADE80',
  chartPurple: '#BF7AF0',
  chartPink: '#FF6B8A',

  // Additional accent backgrounds
  accentBackgroundTeal: '#1A2F32',

  // Border and divider colors
  border: '#333333',
  borderLight: '#2A2A2A',
  divider: '#333333',

  // Button states
  buttonPrimary: '#2AABB8',
  buttonPrimaryPressed: '#35BCC9',
  buttonDanger: '#FF6B7A',
  buttonDangerPressed: '#FF8A96',
  buttonOutline: '#1E1E1E',
  buttonOutlineBorder: '#333333',
  buttonDark: '#E8E8E8',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Transparent
  transparent: 'transparent',
} as const;

// Default export for backward compatibility — will be overridden by useThemeColors hook
export const colors = lightColors;

export type ColorKey = keyof typeof lightColors;
