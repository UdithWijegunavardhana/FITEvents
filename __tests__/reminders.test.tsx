import React from 'react';
import { Linking } from 'react-native';
import * as Keychain from 'react-native-keychain';
import notifee, {
  AuthorizationStatus,
  EventType,
  type Event,
} from 'react-native-notify-kit';
import ReactTestRenderer from 'react-test-renderer';
import { baseApi } from '@/api/baseApi';
import { App } from '@/app/App';
import { logout } from '@/features/auth/redux/authSlice';
import {
  setBookmarks,
  toggleBookmark,
} from '@/features/bookmarks/redux/bookmarksSlice';
import type { FitEvent } from '@/features/events/types';
import { store } from '@/redux/store';
import { fixtureStoredTokens } from '../__fixtures__/auth';
import { fixtureEvents } from '../__fixtures__/events';

type Renderer = ReactTestRenderer.ReactTestRenderer | undefined;

const MINUTE_MS = 60 * 1000;

function eventStartingIn(minutes: number): FitEvent {
  return {
    ...fixtureEvents[0],
    startsAt: new Date(Date.now() + minutes * MINUTE_MS).toISOString(),
    endsAt: new Date(Date.now() + (minutes + 60) * MINUTE_MS).toISOString(),
  };
}

function mockEventApi(event: FitEvent) {
  return jest.spyOn(globalThis, 'fetch').mockImplementation(input => {
    const url = input instanceof Request ? input.url : String(input);
    const body = url.includes(`/events/${event.id}`) ? event : [event];
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

async function renderApp(initialUrl?: string) {
  if (initialUrl) {
    jest.mocked(Linking.getInitialURL).mockResolvedValueOnce(initialUrl);
  }
  let renderer: Renderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  await flushPromises();
  return renderer;
}

async function renderBookmarkedEventDetail(event: FitEvent) {
  mockEventApi(event);
  store.dispatch(setBookmarks([event]));
  return renderApp(`fitevents://event/${event.id}`);
}

function findByTestID(renderer: Renderer, testID: string) {
  return renderer?.root.findAllByProps({ testID })[0];
}

async function pressReminderButton(renderer: Renderer) {
  await ReactTestRenderer.act(async () => {
    findByTestID(renderer, 'reminder-button')?.props.onPress();
  });
  await flushPromises();
}

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .mocked(Keychain.getGenericPassword)
    .mockResolvedValue(fixtureStoredTokens);
  jest.mocked(notifee.getTriggerNotificationIds).mockResolvedValue([]);
  jest.mocked(notifee.getInitialNotification).mockResolvedValue(null);
});

afterEach(() => {
  store.dispatch(logout());
  store.dispatch(setBookmarks([]));
  store.dispatch(baseApi.util.resetApiState());
  jest.restoreAllMocks();
});

test('schedules a reminder 30 minutes before a bookmarked event', async () => {
  const event = eventStartingIn(120);
  const renderer = await renderBookmarkedEventDetail(event);

  await pressReminderButton(renderer);

  expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
    expect.objectContaining({
      id: `event-reminder-${event.id}`,
      data: { url: `fitevents://event/${event.id}` },
    }),
    expect.objectContaining({
      timestamp: Date.parse(event.startsAt) - 30 * MINUTE_MS,
    }),
  );
  expect(findByTestID(renderer, 'reminder-button')?.props.label).toBe(
    'Cancel reminder',
  );

  await ReactTestRenderer.act(async () => renderer?.unmount());
});

test('schedules a demo reminder 10 seconds from now in dev builds', async () => {
  const event = eventStartingIn(120);
  const renderer = await renderBookmarkedEventDetail(event);
  const pressedAt = Date.now();

  await ReactTestRenderer.act(async () => {
    findByTestID(renderer, 'reminder-demo-button')?.props.onPress();
  });
  await flushPromises();

  const trigger = jest.mocked(notifee.createTriggerNotification).mock
    .lastCall?.[1] as { timestamp: number } | undefined;
  expect(trigger?.timestamp).toBeGreaterThanOrEqual(pressedAt + 10 * 1000);
  expect(trigger?.timestamp).toBeLessThan(pressedAt + 15 * 1000);
  expect(findByTestID(renderer, 'reminder-demo-button')).toBeUndefined();

  await ReactTestRenderer.act(async () => renderer?.unmount());
});

test('does not schedule a reminder for an event starting within 30 minutes', async () => {
  const renderer = await renderBookmarkedEventDetail(eventStartingIn(10));

  await pressReminderButton(renderer);

  expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
  expect(findByTestID(renderer, 'reminder-message')?.props.children).toBe(
    'This event starts in less than 30 minutes.',
  );

  await ReactTestRenderer.act(async () => renderer?.unmount());
});

test('explains when notifications are turned off', async () => {
  jest.mocked(notifee.requestPermission).mockResolvedValueOnce({
    authorizationStatus: AuthorizationStatus.DENIED,
  } as Awaited<ReturnType<typeof notifee.requestPermission>>);
  const renderer = await renderBookmarkedEventDetail(eventStartingIn(120));

  await pressReminderButton(renderer);

  expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
  expect(findByTestID(renderer, 'reminder-message')?.props.children).toBe(
    'Notifications are off for FIT Events. Turn them on in Settings.',
  );

  await ReactTestRenderer.act(async () => renderer?.unmount());
});

test('hides the reminder button for events that are not bookmarked', async () => {
  const event = eventStartingIn(120);
  mockEventApi(event);
  const renderer = await renderApp(`fitevents://event/${event.id}`);

  expect(findByTestID(renderer, 'event-detail-screen')).toBeDefined();
  expect(findByTestID(renderer, 'reminder-button')).toBeUndefined();

  await ReactTestRenderer.act(async () => renderer?.unmount());
});

test('cancels the reminder when the event is unbookmarked', async () => {
  const event = eventStartingIn(120);
  store.dispatch(setBookmarks([event]));

  store.dispatch(toggleBookmark(event));
  await flushPromises();

  expect(notifee.cancelTriggerNotification).toHaveBeenCalledWith(
    `event-reminder-${event.id}`,
  );
});

test('opens Event Detail when the reminder notification is tapped', async () => {
  const event = eventStartingIn(120);
  mockEventApi(event);
  const renderer = await renderApp();
  const handler = jest.mocked(notifee.onForegroundEvent).mock.lastCall?.[0];

  expect(findByTestID(renderer, 'event-detail-screen')).toBeUndefined();

  await ReactTestRenderer.act(async () => {
    await handler?.({
      type: EventType.PRESS,
      detail: {
        notification: { data: { url: `fitevents://event/${event.id}` } },
      },
    } as Event);
  });
  await flushPromises();

  expect(findByTestID(renderer, 'event-detail-screen')).toBeDefined();

  await ReactTestRenderer.act(async () => renderer?.unmount());
});

test('opens Event Detail when the app was started by tapping the reminder', async () => {
  const event = eventStartingIn(120);
  mockEventApi(event);
  jest.mocked(notifee.getInitialNotification).mockResolvedValueOnce({
    notification: { data: { url: `fitevents://event/${event.id}` } },
    pressAction: { id: 'default' },
  });

  const renderer = await renderApp();

  expect(findByTestID(renderer, 'event-detail-screen')).toBeDefined();

  await ReactTestRenderer.act(async () => renderer?.unmount());
});
