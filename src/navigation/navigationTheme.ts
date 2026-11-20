import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import type { ColorTokens } from '@/theme';

export function getNavigationTheme(
  colors: ColorTokens,
  isDark: boolean,
): Theme {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };
}
