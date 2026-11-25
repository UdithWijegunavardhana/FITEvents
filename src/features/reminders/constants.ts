export const REMINDER_LEAD_MINUTES = 30;

export const REMINDER_CHANNEL = {
  id: 'event-reminders',
  name: 'Event reminders',
};

export const REMINDER_LABELS = {
  add: 'Remind me 30 min before',
  remove: 'Cancel reminder',
  addHint: 'Schedules a notification 30 minutes before the event starts',
  removeHint: 'Removes the scheduled notification',
  scheduledFor: (time: string) => `Reminder set for ${time}`,
  tooLate: 'This event starts in less than 30 minutes.',
  notificationsOff:
    'Notifications are off for FIT Events. Turn them on in Settings.',
  failed: 'Could not update the reminder. Please try again.',
};

export const reminderTitle = (eventTitle: string) =>
  `Starting soon: ${eventTitle}`;

export const reminderBody = (venue: string) =>
  `Starts in ${REMINDER_LEAD_MINUTES} minutes at ${venue}.`;
