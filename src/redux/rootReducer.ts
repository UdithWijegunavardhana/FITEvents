import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '@/api/baseApi';
import authReducer from '@/features/auth/redux/authSlice';
import bookmarksReducer from '@/features/bookmarks/redux/bookmarksSlice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  bookmarks: bookmarksReducer,
});

export default rootReducer;
