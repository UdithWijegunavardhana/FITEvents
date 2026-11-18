import type { EventCategory, FitEvent } from '@/features/events/types';

// A plain function (no React) so the same rules are easy to test and reuse.
export function filterEvents(
  events: FitEvent[],
  category: EventCategory | null,
  query: string,
): FitEvent[] {
  const search = query.trim().toLowerCase();

  return events.filter(event => {
    const matchesCategory = category === null || event.category === category;
    const matchesSearch =
      search === '' ||
      event.title.toLowerCase().includes(search) ||
      event.venue.toLowerCase().includes(search) ||
      event.organizer.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });
}
