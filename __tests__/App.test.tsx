import React from 'react';
import * as Keychain from 'react-native-keychain';
import ReactTestRenderer from 'react-test-renderer';
import { baseApi } from '@/api/baseApi';
import { App } from '@/app/App';
import { store } from '@/redux/store';
import { fixtureStoredTokens } from '../__fixtures__/auth';
import { fixtureEvents } from '../__fixtures__/events';

function mockEventsResponse() {
  return jest.spyOn(globalThis, 'fetch').mockImplementation(() =>
    Promise.resolve(
      new Response(JSON.stringify(fixtureEvents), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

async function flushPromises() {
  await ReactTestRenderer.act(async () => {
    await new Promise<void>(resolve => setTimeout(resolve, 0));
  });
}

beforeEach(() => {
  jest.mocked(Keychain.getGenericPassword).mockResolvedValue(false);
});

afterEach(() => {
  store.dispatch(baseApi.util.resetApiState());
  jest.restoreAllMocks();
});

async function renderApp() {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  await flushPromises();
  return renderer;
}

async function unmount(
  renderer: ReactTestRenderer.ReactTestRenderer | undefined,
) {
  await ReactTestRenderer.act(async () => {
    renderer?.unmount();
  });
}

test('shows the sign-in screen when there is no saved session', async () => {
  mockEventsResponse();

  const renderer = await renderApp();

  expect(
    renderer?.root.findAllByProps({ testID: 'sign-in-screen' }).length,
  ).toBeGreaterThan(0);
  expect(renderer?.root.findAllByProps({ testID: 'home-screen' })).toHaveLength(
    0,
  );

  await unmount(renderer);
});

test('restores a saved session and shows the Home tab with events', async () => {
  jest
    .mocked(Keychain.getGenericPassword)
    .mockResolvedValue(fixtureStoredTokens);
  mockEventsResponse();

  const renderer = await renderApp();

  expect(
    renderer?.root.findAllByProps({ testID: 'home-screen' }).length,
  ).toBeGreaterThan(0);
  expect(
    renderer?.root.findAllByProps({ testID: 'event-card-evt-001' }).length,
  ).toBeGreaterThan(0);

  await unmount(renderer);
});
