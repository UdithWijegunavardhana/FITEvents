import type { EventCategory } from '@/features/events/types';

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  workshop: 'Workshop',
  talk: 'Tech talk',
  hackathon: 'Hackathon',
  career: 'Career',
  social: 'Social',
};

export const CATEGORY_FILTERS: EventCategory[] = [
  'workshop',
  'talk',
  'hackathon',
  'career',
  'social',
];

export const FILTER_LABELS = {
  all: 'All',
  searchPlaceholder: 'Search events',
  searchAccessibility: 'Search events by title, venue or organiser',
  chipHint: 'Filters the event list',
};

export const EVENT_CARD_HINT = 'Opens event details';

export const HOME_TITLE = 'Upcoming events';

export const EVENTS_EMPTY = {
  title: 'No upcoming events',
  message: 'Check back soon for new events.',
};

export const EVENTS_NO_MATCH = {
  title: 'No matching events',
  message: 'Try another category or search term.',
};

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
