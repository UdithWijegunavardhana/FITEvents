import type { RootState } from '@/redux/store';

export const selectBookmarks = (state: RootState) => state.bookmarks.items;

export const selectBookmarkCount = (state: RootState) =>
  state.bookmarks.items.length;

export const selectBookmarkById = (state: RootState, eventId: string) =>
  state.bookmarks.items.find(item => item.id === eventId);

export const selectIsBookmarked = (state: RootState, eventId: string) =>
  state.bookmarks.items.some(item => item.id === eventId);
