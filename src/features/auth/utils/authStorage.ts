import type { AuthUser } from '@/features/auth/types';
import { storage, StorageKeys } from '@/utils/storage';

function isStoredUser(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.username === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.firstName === 'string' &&
    typeof candidate.lastName === 'string'
  );
}

export function loadUser(): AuthUser | undefined {
  const raw = storage.getString(StorageKeys.USER);
  if (!raw) {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return isStoredUser(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function saveUser(user: AuthUser): void {
  storage.set(StorageKeys.USER, JSON.stringify(user));
}

export function clearUser(): void {
  storage.remove(StorageKeys.USER);
}
