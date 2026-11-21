import { useTheme } from '@/contexts/ThemeContext';
import type { ColorTokens } from './colors';

export { darkColors, lightColors, type ColorTokens } from './colors';
export { minTouchTarget, spacing } from './spacing';
export { radius } from './radius';
export { typography } from './typography';

export function useColors(): ColorTokens {
  return useTheme().colors;
}
