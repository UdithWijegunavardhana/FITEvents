import type { ColorSchemeName } from 'react-native';
import { darkColors, lightColors, type ColorTokens } from './colors';

export { darkColors, lightColors, type ColorTokens } from './colors';
export { minTouchTarget, spacing } from './spacing';
export { radius } from './radius';
export { typography } from './typography';

export function getColors(scheme: ColorSchemeName | null): ColorTokens {
  return scheme === 'dark' ? darkColors : lightColors;
}
