import type { EventCategory } from '@/features/events/types';

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  workshop: 'Workshop',
  talk: 'Tech talk',
  hackathon: 'Hackathon',
  career: 'Career',
  social: 'Social',
};

export const HOME_TITLE = 'Upcoming events';

export const EVENT_DETAIL_TITLE = 'Event';

export const EVENT_NOT_FOUND = {
  title: 'Event not found',
  message: 'This event may have been removed.',
};

export const DETAIL_LABELS = {
  when: 'When',
  where: 'Where',
  organizer: 'Organiser',
  capacity: 'Capacity',
  about: 'About this event',
  bookmark: 'Bookmark',
  register: 'Register',
};

export function capacityText(registered: number, capacity: number): string {
  return `${registered} of ${capacity} places taken`;
}
