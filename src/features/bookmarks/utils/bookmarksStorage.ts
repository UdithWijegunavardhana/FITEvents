import type { FitEvent } from '@/features/events/types';
import { storage, StorageKeys } from '@/utils/storage';

function isStoredEvent(value: unknown): value is FitEvent {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.category === 'string' &&
    typeof candidate.startsAt === 'string' &&
    typeof candidate.venue === 'string'
  );
}

export function loadBookmarks(): FitEvent[] {
  const raw = storage.getString(StorageKeys.BOOKMARKS);
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isStoredEvent) : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(items: FitEvent[]): void {
  storage.set(StorageKeys.BOOKMARKS, JSON.stringify(items));
}
