import React from 'react';
import * as Keychain from 'react-native-keychain';
import {
  check,
  openSettings,
  request,
  RESULTS,
} from 'react-native-permissions';
import ReactTestRenderer from 'react-test-renderer';
import { baseApi } from '@/api/baseApi';
import { App } from '@/app/App';
import { logout } from '@/features/auth/redux/authSlice';
import { toEventLinkPath } from '@/navigation/linking';
import { store } from '@/redux/store';
import { fixtureStoredTokens } from '../__fixtures__/auth';
import { fixtureEvents } from '../__fixtures__/events';

type Renderer = ReactTestRenderer.ReactTestRenderer | undefined;

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

async function renderScanTab() {
  let renderer: Renderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  await flushPromises();
  const [scanTab] = renderer?.root.findAllByProps({ testID: 'tab-scan' }) ?? [];
  await ReactTestRenderer.act(async () => {
    scanTab?.props.onPress();
  });
  await flushPromises();
  return renderer;
}

function countByTestID(renderer: Renderer, testID: string) {
  return renderer?.root.findAllByProps({ testID }).length ?? 0;
}

function pressByTestID(renderer: Renderer, testID: string) {
  const [element] = renderer?.root.findAllByProps({ testID }) ?? [];
  return ReactTestRenderer.act(async () => {
    element?.props.onPress();
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .mocked(Keychain.getGenericPassword)
    .mockResolvedValue(fixtureStoredTokens);
  jest.mocked(check).mockResolvedValue(RESULTS.GRANTED);
  mockEventsApi();
});

afterEach(() => {
  store.dispatch(logout());
  store.dispatch(baseApi.util.resetApiState());
  jest.restoreAllMocks();
});

test('only accepts fitevents://event/<id> links', () => {
  expect(toEventLinkPath('fitevents://event/evt-001')).toBe('/event/evt-001');
  expect(toEventLinkPath('fitevents://event/')).toBeNull();
  expect(toEventLinkPath('fitevents://event/evt-001/extra')).toBeNull();
  expect(toEventLinkPath('https://example.com/event/evt-001')).toBeNull();
  expect(toEventLinkPath('fitevents-qa://event/evt-001')).toBeNull();
});

test('opens Event Detail when a valid event QR code is scanned', async () => {
  const renderer = await renderScanTab();
  const [camera] =
    renderer?.root.findAllByProps({ testID: 'scan-camera' }) ?? [];

  await ReactTestRenderer.act(async () => {
    camera?.props.onReadCode({
      nativeEvent: { codeStringValue: 'fitevents://event/evt-001' },
    });
  });
  await flushPromises();

  expect(countByTestID(renderer, 'event-detail-screen')).toBeGreaterThan(0);

  await ReactTestRenderer.act(async () => renderer?.unmount());
});

test('shows an error for a QR code that is not an event link', async () => {
  const renderer = await renderScanTab();
  const [camera] =
    renderer?.root.findAllByProps({ testID: 'scan-camera' }) ?? [];

  await ReactTestRenderer.act(async () => {
    camera?.props.onReadCode({
      nativeEvent: { codeStringValue: 'https://example.com' },
    });
  });

  const [hint] = renderer?.root.findAllByProps({ testID: 'scan-hint' }) ?? [];
  expect(hint?.props.children).toBe('This QR code is not a FIT Events link');
  expect(countByTestID(renderer, 'event-detail-screen')).toBe(0);

  await ReactTestRenderer.act(async () => renderer?.unmount());
});

test('asks for camera access when it has not been granted yet', async () => {
  jest.mocked(check).mockResolvedValue(RESULTS.DENIED);
  jest.mocked(request).mockResolvedValue(RESULTS.GRANTED);

  const renderer = await renderScanTab();

  expect(countByTestID(renderer, 'camera-permission-denied')).toBeGreaterThan(
    0,
  );

  await pressByTestID(renderer, 'permission-action');
  await flushPromises();

  expect(request).toHaveBeenCalledTimes(1);
  expect(countByTestID(renderer, 'scan-camera')).toBeGreaterThan(0);

  await ReactTestRenderer.act(async () => renderer?.unmount());
});

test('sends the user to Settings when camera access is blocked', async () => {
  jest.mocked(check).mockResolvedValue(RESULTS.DENIED);
  jest.mocked(request).mockResolvedValue(RESULTS.BLOCKED);

  const renderer = await renderScanTab();
  await pressByTestID(renderer, 'permission-action');
  await flushPromises();

  expect(countByTestID(renderer, 'camera-permission-blocked')).toBeGreaterThan(
    0,
  );

  await pressByTestID(renderer, 'permission-action');

  expect(openSettings).toHaveBeenCalledWith('application');

  await ReactTestRenderer.act(async () => renderer?.unmount());
});
