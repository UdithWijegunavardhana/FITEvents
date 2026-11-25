import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { spacing, typography, useColors } from '@/theme';

type PermissionPromptProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
};

export function PermissionPrompt({
  title,
  message,
  actionLabel,
  onAction,
  testID,
}: Readonly<PermissionPromptProps>) {
  const colors = useColors();

  return (
    <View
      testID={testID}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Ionicons
        name="camera-outline"
        size={48}
        color={colors.textSecondary}
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
      {actionLabel && onAction ? (
        <Button
          testID="permission-action"
          label={actionLabel}
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
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
  action: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
  },
});
