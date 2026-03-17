import { useSettings } from '../contexts/SettingsContext';
import { lightColors, darkColors } from '../theme/colors';

export function useThemeColors() {
  const { themeMode } = useSettings();
  return themeMode === 'dark' ? darkColors : lightColors;
}
