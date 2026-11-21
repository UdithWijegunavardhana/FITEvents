import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ERROR_STATE } from '@/components/constants';
import { spacing, typography, useColors } from '@/theme';

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
  title?: string;
  testID?: string;
};

export function ErrorState({
  message,
  onRetry,
  title = ERROR_STATE.title,
  testID = 'error-state',
}: Readonly<ErrorStateProps>) {
  const colors = useColors();

  return (
    <View
      testID={testID}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Ionicons
        name="alert-circle-outline"
        size={48}
        color={colors.error}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.text }]}
      >
        {title}
      </Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
      <Button
        testID="retry-button"
        label={ERROR_STATE.retry}
        onPress={onRetry}
        style={styles.retry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  retry: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
  },
});
