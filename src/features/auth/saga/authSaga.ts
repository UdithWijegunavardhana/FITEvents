import { call, put, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getErrorMessage } from '@/api/errors';
import { authApi } from '@/features/auth/api/auth.api';
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logout,
} from '@/features/auth/redux/authSlice';
import { authSagaActions } from '@/features/auth/saga/authSagaActions';
import type { AuthSession } from '@/features/auth/types';
import {
  clearUser,
  loadUser,
  saveUser,
} from '@/features/auth/utils/authStorage';
import { dispatchThunk } from '@/redux/dispatchThunk';
import {
  clearTokens,
  loadTokens,
  saveTokens,
  type AuthTokens,
} from '@/services/secureStorage';

type LoginResult =
  | { data: AuthSession }
  | { error: FetchBaseQueryError | SerializedError };

function* loginSaga(
  action: ReturnType<typeof authSagaActions.login>,
): SagaIterator {
  try {
    yield put(loginRequest());
    const result: LoginResult = yield call(
      dispatchThunk,
      authApi.endpoints.login.initiate(action.payload),
    );
    if ('error' in result) {
      yield put(loginFailure(getErrorMessage(result.error)));
      return;
    }
    const session = result.data;
    yield call(saveTokens, {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
    yield call(saveUser, session.user);
    yield put(loginSuccess({ token: session.accessToken, user: session.user }));
  } catch (error) {
    yield put(loginFailure(getErrorMessage(error as SerializedError)));
  }
}

function* restoreSessionSaga(): SagaIterator {
  try {
    const tokens: AuthTokens | undefined = yield call(loadTokens);
    if (!tokens) {
      yield put(logout());
      return;
    }
    yield put(
      loginSuccess({ token: tokens.accessToken, user: loadUser() ?? null }),
    );
  } catch {
    yield put(logout());
  }
}

function* logoutSaga(): SagaIterator {
  try {
    yield call(clearTokens);
    yield call(clearUser);
  } finally {
    yield put(logout());
  }
}

export function* authSaga(): SagaIterator {
  yield takeLatest(authSagaActions.login.type, loginSaga);
  yield takeLatest(authSagaActions.restoreSession.type, restoreSessionSaga);
  yield takeLatest(authSagaActions.logout.type, logoutSaga);
}
