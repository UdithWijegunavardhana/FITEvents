import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { baseApi } from '@/api/baseApi';
import { App } from '@/app/App';
import { store } from '@/redux/store';
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

afterEach(() => {
  store.dispatch(baseApi.util.resetApiState());
  jest.restoreAllMocks();
});

test('renders the Home tab with events from the API', async () => {
  mockEventsResponse();

  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  await flushPromises();

  expect(
    renderer?.root.findAllByProps({ testID: 'home-screen' }).length,
  ).toBeGreaterThan(0);
  expect(
    renderer?.root.findAllByProps({ testID: 'event-card-evt-001' }).length,
  ).toBeGreaterThan(0);

  await ReactTestRenderer.act(async () => {
    renderer?.unmount();
  });
});
