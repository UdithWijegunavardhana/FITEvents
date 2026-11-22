import { createAction } from '@reduxjs/toolkit';
import type { FitEvent } from '@/features/events/types';

export const bookmarksSagaActions = {
  toggle: createAction<FitEvent>('Bookmarks/Toggle'),
  restore: createAction('Bookmarks/Restore'),
};
