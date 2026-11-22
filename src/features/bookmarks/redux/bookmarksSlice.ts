import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FitEvent } from '@/features/events/types';

type BookmarksState = {
  items: FitEvent[];
};

const initialState: BookmarksState = {
  items: [],
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setBookmarks(state, action: PayloadAction<FitEvent[]>) {
      state.items = action.payload;
    },
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

export const { setBookmarks, toggleBookmark } = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
