import React from 'react';
import { Linking } from 'react-native';
import * as Keychain from 'react-native-keychain';
import ReactTestRenderer from 'react-test-renderer';
import { baseApi } from '@/api/baseApi';
import { App } from '@/app/App';
import { loginSuccess, logout } from '@/features/auth/redux/authSlice';
import { store } from '@/redux/store';
import { fixtureStoredTokens } from '../__fixtures__/auth';
import { fixtureEvents } from '../__fixtures__/events';

const EVENT_LINK = 'fitevents://event/evt-001';

function mockEventsApi() {
  return jest.spyOn(globalThis, 'fetch').mockImplementation(input => {
    const url = input instanceof Request ? input.url : String(input);
    const body = url.includes('/events/evt-001')
      ? fixtureEvents[0]
      : fixtureEvents;
    return Promise.resolve(
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });
}

async function flushPromises() {
  await ReactTestRenderer.act(async () => {
    await new Promise<void>(resolve => setTimeout(resolve, 0));
  });
}

async function renderApp() {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  await flushPromises();
  return renderer;
}

function countByTestID(
  renderer: ReactTestRenderer.ReactTestRenderer | undefined,
  testID: string,
) {
  return renderer?.root.findAllByProps({ testID }).length ?? 0;
}

beforeEach(() => {
  jest.mocked(Keychain.getGenericPassword).mockResolvedValue(false);
  mockEventsApi();
});

afterEach(async () => {
  store.dispatch(logout());
  store.dispatch(baseApi.util.resetApiState());
  jest.restoreAllMocks();
});

test('opens Event Detail from a link on cold start when signed in', async () => {
  jest
    .mocked(Keychain.getGenericPassword)
    .mockResolvedValue(fixtureStoredTokens);
  jest.mocked(Linking.getInitialURL).mockResolvedValueOnce(EVENT_LINK);

  const renderer = await renderApp();

  expect(countByTestID(renderer, 'event-detail-screen')).toBeGreaterThan(0);

  await ReactTestRenderer.act(async () => renderer?.unmount());
});

test('opens Event Detail from a link received while running', async () => {
  jest
    .mocked(Keychain.getGenericPassword)
    .mockResolvedValue(fixtureStoredTokens);
  const renderer = await renderApp();
  const [, handler] = jest.mocked(Linking.addEventListener).mock.lastCall ?? [];

  expect(countByTestID(renderer, 'event-detail-screen')).toBe(0);

  await ReactTestRenderer.act(async () => {
    handler?.({ url: EVENT_LINK });
  });
  await flushPromises();

  expect(countByTestID(renderer, 'event-detail-screen')).toBeGreaterThan(0);

  await ReactTestRenderer.act(async () => renderer?.unmount());
});

test('keeps a link opened while signed out and opens it after login', async () => {
  jest.mocked(Linking.getInitialURL).mockResolvedValueOnce(EVENT_LINK);

  const renderer = await renderApp();

  expect(countByTestID(renderer, 'sign-in-screen')).toBeGreaterThan(0);
  expect(countByTestID(renderer, 'event-detail-screen')).toBe(0);

  await ReactTestRenderer.act(async () => {
    store.dispatch(loginSuccess({ token: 'access-token', user: null }));
  });
  await flushPromises();

  expect(countByTestID(renderer, 'event-detail-screen')).toBeGreaterThan(0);

  await ReactTestRenderer.act(async () => renderer?.unmount());
});
