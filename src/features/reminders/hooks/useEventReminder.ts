import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import type { FitEvent } from '@/features/events/types';
import { formatTime } from '@/features/events/utils/formatDate';
import {
  DEMO_REMINDER_DELAY_SECONDS,
  REMINDER_CHANNEL,
  REMINDER_LABELS,
  reminderBody,
  reminderTitle,
} from '@/features/reminders/constants';
import {
  reminderId,
  reminderTimestamp,
} from '@/features/reminders/utils/reminder';
import { eventDeepLink } from '@/navigation/linking';
import {
  cancelScheduledNotification,
  isNotificationScheduled,
  requestNotificationPermission,
  scheduleNotification,
} from '@/services/notifications';

export function useEventReminder(event: FitEvent) {
  const [isScheduled, setIsScheduled] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      isNotificationScheduled(reminderId(event.id))
        .then(scheduled => {
          if (active) {
            setIsScheduled(scheduled);
          }
        })
        .catch(() => undefined);
    };
    refresh();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh();
      }
    });
    return () => {
      active = false;
      subscription.remove();
    };
  }, [event.id]);

  const scheduleAt = useCallback(
    async (timestamp: number) => {
      if (timestamp <= Date.now()) {
        setMessage(REMINDER_LABELS.tooLate);
        return;
      }
      if (!(await requestNotificationPermission())) {
        setMessage(REMINDER_LABELS.notificationsOff);
        return;
      }
      await scheduleNotification({
        id: reminderId(event.id),
        title: reminderTitle(event.title),
        body: reminderBody(event.venue),
        url: eventDeepLink(event.id),
        timestamp,
        channel: REMINDER_CHANNEL,
      });
      setIsScheduled(true);
      setMessage(
        REMINDER_LABELS.scheduledFor(
          formatTime(new Date(timestamp).toISOString()),
        ),
      );
    },
    [event],
  );

  const cancel = useCallback(async () => {
    await cancelScheduledNotification(reminderId(event.id));
    setIsScheduled(false);
    setMessage(null);
  }, [event.id]);

  const runWhileBusy = useCallback(async (task: () => Promise<void>) => {
    setBusy(true);
    try {
      await task();
    } catch {
      setMessage(REMINDER_LABELS.failed);
    } finally {
      setBusy(false);
    }
  }, []);

  const toggleReminder = useCallback(
    () =>
      runWhileBusy(() =>
        isScheduled ? cancel() : scheduleAt(reminderTimestamp(event.startsAt)),
      ),
    [cancel, event.startsAt, isScheduled, runWhileBusy, scheduleAt],
  );

  const scheduleDemoReminder = useCallback(
    () =>
      runWhileBusy(() =>
        scheduleAt(Date.now() + DEMO_REMINDER_DELAY_SECONDS * 1000),
      ),
    [runWhileBusy, scheduleAt],
  );

  return {
    isScheduled,
    message,
    busy,
    toggleReminder,
    scheduleDemoReminder,
  };
}
