import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { baseApi } from '@/api/baseApi';
import { bookmarksSagaActions } from '@/features/bookmarks/saga/bookmarksSagaActions';
import rootReducer from '@/redux/rootReducer';
import rootSaga from '@/redux/rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware, sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
store.dispatch(bookmarksSagaActions.restore());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
