// 4-point spacing scale: consistent gaps without picking magic numbers.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// Minimum touch target (Apple HIG 44pt; Android recommends 48dp).
export const minTouchTarget = 44;
