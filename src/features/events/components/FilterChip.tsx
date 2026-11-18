import { Pressable, StyleSheet, Text } from 'react-native';
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
      accessibilityState={{ selected }}
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
