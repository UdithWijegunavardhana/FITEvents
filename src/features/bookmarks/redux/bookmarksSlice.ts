import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FitEvent } from '@/features/events/types';
import { loadBookmarks } from '@/features/bookmarks/utils/bookmarksStorage';

type BookmarksState = {
  items: FitEvent[];
};

const initialState: BookmarksState = {
  items: loadBookmarks(),
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark(state, action: PayloadAction<FitEvent>) {
      const index = state.items.findIndex(
        item => item.id === action.payload.id,
      );
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(action.payload);
      }
    },
  },
});

export const { toggleBookmark } = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
