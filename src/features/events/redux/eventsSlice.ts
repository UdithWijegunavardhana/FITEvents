// Redux-Saga demo (s3-saga-demo): the slice holds data, loading and error.
// With RTK Query none of this is written by hand: `useGetEventsQuery()` returns
// data, isLoading, isFetching and error, and the cache lives in the `api` slice.
// `loading` starts as true because the screen dispatches the fetch on mount;
// starting as false would flash the empty state for one frame.
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FitEvent } from '@/features/events/types';

type EventsState = {
  items: FitEvent[];
  loading: boolean;
  error: string | null;
};

const initialState: EventsState = {
  items: [],
  loading: true,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    getEventsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getEventsSuccess(state, action: PayloadAction<FitEvent[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    getEventsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { getEventsRequest, getEventsSuccess, getEventsFailure } =
  eventsSlice.actions;

export default eventsSlice.reducer;
