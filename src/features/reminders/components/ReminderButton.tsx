import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import type { FitEvent } from '@/features/events/types';
import { REMINDER_LABELS } from '@/features/reminders/constants';
import { useEventReminder } from '@/features/reminders/hooks/useEventReminder';
import { spacing, typography, useColors } from '@/theme';

type ReminderButtonProps = {
  event: FitEvent;
};

export function ReminderButton({ event }: Readonly<ReminderButtonProps>) {
  const colors = useColors();
  const { isScheduled, message, busy, toggleReminder, scheduleDemoReminder } =
    useEventReminder(event);

  return (
    <View style={styles.container}>
      <Button
        testID="reminder-button"
        label={isScheduled ? REMINDER_LABELS.remove : REMINDER_LABELS.add}
        variant="secondary"
        selected={isScheduled}
        disabled={busy}
        onPress={toggleReminder}
      />
      {__DEV__ && !isScheduled ? (
        <Button
          testID="reminder-demo-button"
          label={REMINDER_LABELS.demo}
          variant="secondary"
          disabled={busy}
          onPress={scheduleDemoReminder}
        />
      ) : null}
      {message ? (
        <Text
          testID="reminder-message"
          accessibilityLiveRegion="polite"
          style={[styles.message, { color: colors.textSecondary }]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  message: {
    ...typography.body,
    textAlign: 'center',
  },
});
