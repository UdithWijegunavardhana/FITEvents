import * as Keychain from 'react-native-keychain';
import { authSagaActions } from '@/features/auth/saga/authSagaActions';
import { store } from '@/redux/store';
import { storage, StorageKeys } from '@/utils/storage';
import {
  fixtureSignInResponse,
  fixtureStoredTokens,
} from '../__fixtures__/auth';

function flushSaga() {
  return new Promise<void>(resolve => setTimeout(resolve, 0));
}

function mockLoginResponse(status: number, body: unknown) {
  return jest.spyOn(globalThis, 'fetch').mockImplementation(() =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(Keychain.setGenericPassword).mockResolvedValue({
    service: 'fitevents.auth.tokens',
    storage: 'keychain',
  });
  jest.mocked(Keychain.getGenericPassword).mockResolvedValue(false);
  jest.mocked(Keychain.resetGenericPassword).mockResolvedValue(true);
});

afterEach(async () => {
  store.dispatch(authSagaActions.logout());
  await flushSaga();
  jest.restoreAllMocks();
});

test('login stores tokens in the keychain and the user in MMKV', async () => {
  mockLoginResponse(200, fixtureSignInResponse);

  store.dispatch(
    authSagaActions.login({ username: 'emilys', password: 'emilyspass' }),
  );
  await flushSaga();

  const { auth } = store.getState();
  expect(auth.token).toBe('access-token');
  expect(auth.user?.firstName).toBe('Emily');
  expect(auth.user).not.toHaveProperty('accessToken');
  expect(auth.error).toBeNull();
  expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
    'tokens',
    fixtureStoredTokens.password,
    { service: 'fitevents.auth.tokens' },
  );
  expect(storage.getString(StorageKeys.USER)).toContain('emilys');
});

test('login failure surfaces the server message and stays signed out', async () => {
  mockLoginResponse(400, { message: 'Invalid credentials' });

  store.dispatch(
    authSagaActions.login({ username: 'emilys', password: 'wrongpass' }),
  );
  await flushSaga();

  const { auth } = store.getState();
  expect(auth.token).toBeNull();
  expect(auth.loading).toBe(false);
  expect(auth.error).toBe('Invalid credentials');
  expect(Keychain.setGenericPassword).not.toHaveBeenCalled();
});

test('logout clears the keychain, MMKV and the session', async () => {
  mockLoginResponse(200, fixtureSignInResponse);
  store.dispatch(
    authSagaActions.login({ username: 'emilys', password: 'emilyspass' }),
  );
  await flushSaga();

  store.dispatch(authSagaActions.logout());
  await flushSaga();

  expect(store.getState().auth.token).toBeNull();
  expect(store.getState().auth.user).toBeNull();
  expect(Keychain.resetGenericPassword).toHaveBeenCalled();
  expect(storage.getString(StorageKeys.USER)).toBeUndefined();
});

test('restoreSession signs in from stored tokens and clears when none', async () => {
  jest
    .mocked(Keychain.getGenericPassword)
    .mockResolvedValue(fixtureStoredTokens);
  store.dispatch(authSagaActions.restoreSession());
  await flushSaga();
  expect(store.getState().auth.token).toBe('access-token');
  expect(store.getState().auth.restoring).toBe(false);

  jest.mocked(Keychain.getGenericPassword).mockResolvedValue(false);
  store.dispatch(authSagaActions.restoreSession());
  await flushSaga();
  expect(store.getState().auth.token).toBeNull();
});
