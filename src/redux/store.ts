import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { baseApi } from '@/api/baseApi';
import { startBookmarksListeners } from '@/features/bookmarks/redux/bookmarksListeners';
import { listenerMiddleware } from '@/redux/listenerMiddleware';
import rootReducer from '@/redux/rootReducer';
import rootSaga from '@/redux/rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(baseApi.middleware, sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
startBookmarksListeners();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
