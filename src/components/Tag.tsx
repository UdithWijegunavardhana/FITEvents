import { StyleSheet, Text, View } from 'react-native';
import { radius, spacing, typography, useColors } from '@/theme';

type TagProps = {
  label: string;
};

export function Tag({ label }: TagProps) {
  const colors = useColors();

  return (
    <View style={[styles.tag, { backgroundColor: colors.accentSubtle }]}>
      <Text style={[styles.text, { color: colors.accent }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start', // shrink to fit the text instead of stretching
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  text: {
    ...typography.label,
  },
});
