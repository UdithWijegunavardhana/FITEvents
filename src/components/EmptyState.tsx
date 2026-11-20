import { StyleSheet, Text, View } from 'react-native';
import { spacing, typography, useColors } from '@/theme';

type EmptyStateProps = {
  title: string;
  message: string;
  testID?: string;
};

export function EmptyState({ title, message, testID }: EmptyStateProps) {
  const colors = useColors();

  return (
    <View testID={testID} style={styles.container}>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.text }]}
      >
        {title}
      </Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    textAlign: 'center',
  },
});
