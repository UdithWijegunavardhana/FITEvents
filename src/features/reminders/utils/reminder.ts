import { REMINDER_LEAD_MINUTES } from '@/features/reminders/constants';

export function reminderId(eventId: string): string {
  return `event-reminder-${eventId}`;
}

export function reminderTimestamp(startsAt: string): number {
  return Date.parse(startsAt) - REMINDER_LEAD_MINUTES * 60 * 1000;
}
