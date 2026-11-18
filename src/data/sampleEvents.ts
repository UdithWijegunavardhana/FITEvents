import type { FitEvent } from '@/types/event';

// Hardcoded data for S1. S3 replaces this with the mock API.
export const sampleEvents: FitEvent[] = [
  {
    id: 'evt-001',
    title: 'Hands-on React Native: Build Your First Mobile App',
    description:
      'A three-hour workshop where you build and run a small React Native app on your own phone. Bring a laptop with Node.js and Android Studio installed.',
    category: 'workshop',
    startsAt: '2026-11-25T14:00:00+05:30',
    endsAt: '2026-11-25T17:00:00+05:30',
    venue: 'Computer Lab 3',
    organizer: 'IT Society',
    imageUrl: 'https://picsum.photos/seed/fit-evt-001/800/450',
    capacity: 60,
    registeredCount: 42,
    tags: ['mobile', 'react-native'],
  },
];
