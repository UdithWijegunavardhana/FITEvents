import { all, fork } from 'redux-saga/effects';
import { eventsSaga } from '@/features/events/saga/eventsSaga';

export default function* rootSaga() {
  yield all([fork(eventsSaga)]);
}
