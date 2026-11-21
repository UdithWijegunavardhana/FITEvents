import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '@/api/baseApi';
import bookmarksReducer from '@/features/bookmarks/redux/bookmarksSlice';
import eventsReducer from '@/features/events/redux/eventsSlice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  bookmarks: bookmarksReducer,
  events: eventsReducer,
});

export default rootReducer;
