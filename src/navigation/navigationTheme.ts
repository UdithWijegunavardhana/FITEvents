import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import type { ColorTokens } from '@/theme';

// React Navigation draws its own headers and tab bar, so we hand it our
// colour tokens to keep them in step with the screens.
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
