import type { RootState } from '@/redux/store';

export const selectEvents = (state: RootState) => state.events.items;
export const selectEventsLoading = (state: RootState) => state.events.loading;
export const selectEventsError = (state: RootState) => state.events.error;
