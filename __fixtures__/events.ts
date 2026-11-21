import type { FitEvent } from '@/features/events/types';

export const fixtureEvents: FitEvent[] = [
  {
    id: 'evt-001',
    title: 'Hands-on React Native: Build Your First Mobile App',
    description: 'A three-hour workshop where you build a small app.',
    category: 'workshop',
    startsAt: '2026-11-25T14:00:00+05:30',
    endsAt: '2026-11-25T17:00:00+05:30',
    venue: 'Computer Lab 3',
    organizer: 'IT Society',
    imageUrl: 'https://picsum.photos/seed/fit-evt-001/800/450',
    capacity: 60,
    registeredCount: 42,
    tags: ['mobile'],
  },
  {
    id: 'evt-002',
    title: 'Tech Talk: Scaling Payments Infrastructure in Sri Lanka',
    description: 'An engineering lead from a local fintech.',
    category: 'talk',
    startsAt: '2026-11-27T15:30:00+05:30',
    endsAt: '2026-11-27T17:00:00+05:30',
    venue: 'Auditorium',
    organizer: 'Faculty of IT',
    imageUrl: 'https://picsum.photos/seed/fit-evt-002/800/450',
    capacity: 250,
    registeredCount: 188,
    tags: ['fintech'],
  },
];
