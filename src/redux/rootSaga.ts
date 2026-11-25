import type { SagaIterator } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { bookmarksSaga } from '@/features/bookmarks/saga/bookmarksSaga';
import { authSaga } from '@/features/auth/saga/authSaga';
import { remindersSaga } from '@/features/reminders/saga/remindersSaga';

export default function* rootSaga(): SagaIterator {
  yield all([fork(authSaga), fork(bookmarksSaga), fork(remindersSaga)]);
}
