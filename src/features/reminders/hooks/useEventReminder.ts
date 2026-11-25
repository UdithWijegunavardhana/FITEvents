import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import type { FitEvent } from '@/features/events/types';
import { formatTime } from '@/features/events/utils/formatDate';
import {
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

  const schedule = useCallback(async () => {
    const timestamp = reminderTimestamp(event.startsAt);
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
  }, [event]);

  const cancel = useCallback(async () => {
    await cancelScheduledNotification(reminderId(event.id));
    setIsScheduled(false);
    setMessage(null);
  }, [event.id]);

  const toggleReminder = useCallback(async () => {
    setBusy(true);
    try {
      await (isScheduled ? cancel() : schedule());
    } catch {
      setMessage(REMINDER_LABELS.failed);
    } finally {
      setBusy(false);
    }
  }, [cancel, isScheduled, schedule]);

  return { isScheduled, message, busy, toggleReminder };
}
