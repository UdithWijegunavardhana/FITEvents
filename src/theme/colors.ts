const palette = {
  maroon600: '#8A1538',
  maroon300: '#E07A98',
  maroon50: '#F8E6EC',
  maroon900: '#3D0A1A',
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F7F7F8',
  gray100: '#EDEDF0',
  gray300: '#C9C9D1',
  gray500: '#6E6E7A',
  gray700: '#3A3A44',
  gray800: '#24242C',
  gray900: '#16161C',
  gray950: '#0E0E12',
  red500: '#D93025',
  red300: '#F28B82',
  green600: '#1E8E3E',
  green300: '#81C995',
};

export type ColorTokens = {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentSubtle: string;
  onAccent: string;
  error: string;
  success: string;
  shadow: string;
};

export const lightColors: ColorTokens = {
  background: palette.gray50,
  surface: palette.white,
  text: palette.gray900,
  textSecondary: palette.gray500,
  border: palette.gray100,
  accent: palette.maroon600,
  accentSubtle: palette.maroon50,
  onAccent: palette.white,
  error: palette.red500,
  success: palette.green600,
  shadow: palette.black,
};

export const darkColors: ColorTokens = {
  background: palette.gray950,
  surface: palette.gray800,
  text: palette.gray50,
  textSecondary: palette.gray300,
  border: palette.gray700,
  accent: palette.maroon300,
  accentSubtle: palette.maroon900,
  onAccent: palette.gray950,
  error: palette.red300,
  success: palette.green300,
  shadow: palette.black,
};
