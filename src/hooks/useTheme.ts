import { THEME } from '@/lib/theme';
import { useThemeStore } from '@/stores/themeStore';
import { useColorScheme } from 'react-native';

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const systemScheme = useColorScheme() ?? 'light';
  const resolved = mode === 'system' ? systemScheme : mode;
  return THEME[resolved];
}

export function useThemeMode() {
  return useThemeStore((s) => ({ mode: s.mode, setMode: s.setMode }));
}
