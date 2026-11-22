import type { SagaIterator } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { bookmarksSaga } from '@/features/bookmarks/saga/bookmarksSaga';

export default function* rootSaga(): SagaIterator {
  yield all([fork(bookmarksSaga)]);
}
