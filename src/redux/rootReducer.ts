import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '@/api/baseApi';
import bookmarksReducer from '@/features/bookmarks/redux/bookmarksSlice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  bookmarks: bookmarksReducer,
});

export default rootReducer;
