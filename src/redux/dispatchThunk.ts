import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import type { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

export function* dispatchThunk<Result>(
  thunk: ThunkAction<PromiseLike<Result>, unknown, unknown, UnknownAction>,
): SagaIterator<Result> {
  const pending: PromiseLike<Result> = yield put(thunk);
  return yield call(() => pending);
}
