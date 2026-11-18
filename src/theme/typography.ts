import type { TextStyle } from 'react-native';

// Sizes only — the system font scales with the user's dynamic type setting.
export const typography = {
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
} satisfies Record<string, TextStyle>;
