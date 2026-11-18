import { Pressable, StyleSheet, Text } from 'react-native';
import { FILTER_LABELS } from '@/features/events/constants';
import { radius, spacing, typography, useColors } from '@/theme';

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

export function FilterChip({
  label,
  selected,
  onPress,
  testID,
}: FilterChipProps) {
  const colors = useColors();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={FILTER_LABELS.chipHint}
      accessibilityState={{ selected }}
      // The chip is drawn 36pt tall; hitSlop grows the touch area to the
      // 44pt minimum without changing how it looks.
      hitSlop={CHIP_HIT_SLOP}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected
          ? { backgroundColor: colors.accent, borderColor: colors.accent }
          : { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: selected ? colors.onAccent : colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// Vertical only: horizontally the chips sit 8pt apart, so a side slop
// would make neighbouring chips' touch areas overlap.
const CHIP_HIT_SLOP = { top: spacing.xs, bottom: spacing.xs };

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  text: {
    ...typography.label,
  },
  pressed: {
    opacity: 0.7,
  },
});
