import notifee, {
  AlarmType,
  AuthorizationStatus,
  EventType,
  TriggerType,
  type Event,
  type Notification,
} from 'react-native-notify-kit';

type UrlListener = (url: string) => void;

type ScheduledNotification = {
  id: string;
  title: string;
  body: string;
  url: string;
  timestamp: number;
  channel: { id: string; name: string };
};

let pressListener: UrlListener | null = null;
let pendingPressUrl: string | null = null;

function getNotificationUrl(notification?: Notification): string | null {
  const url = notification?.data?.url;
  return typeof url === 'string' ? url : null;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
}

export async function scheduleNotification({
  id,
  title,
  body,
  url,
  timestamp,
  channel,
}: ScheduledNotification): Promise<void> {
  const channelId = await notifee.createChannel(channel);
  await notifee.createTriggerNotification(
    { id, title, body, data: { url }, android: { channelId } },
    {
      type: TriggerType.TIMESTAMP,
      timestamp,
      alarmManager: { type: AlarmType.SET_AND_ALLOW_WHILE_IDLE },
    },
  );
}

export function cancelScheduledNotification(id: string): Promise<void> {
  return notifee.cancelTriggerNotification(id);
}

export async function isNotificationScheduled(id: string): Promise<boolean> {
  const ids = await notifee.getTriggerNotificationIds();
  return ids.includes(id);
}

export async function getInitialNotificationUrl(): Promise<string | null> {
  const initial = await notifee.getInitialNotification();
  return getNotificationUrl(initial?.notification);
}

export async function handleNotificationEvent({
  type,
  detail,
}: Event): Promise<void> {
  if (type !== EventType.PRESS) {
    return;
  }
  const url = getNotificationUrl(detail.notification);
  if (!url) {
    return;
  }
  if (pressListener) {
    pressListener(url);
  } else {
    pendingPressUrl = url;
  }
}

export function subscribeToNotificationPresses(
  listener: UrlListener,
): () => void {
  pressListener = listener;
  if (pendingPressUrl) {
    listener(pendingPressUrl);
    pendingPressUrl = null;
  }
  const unsubscribeForeground = notifee.onForegroundEvent(
    handleNotificationEvent,
  );
  return () => {
    pressListener = null;
    unsubscribeForeground();
  };
}

export function registerBackgroundNotificationHandler(): void {
  notifee.onBackgroundEvent(handleNotificationEvent);
}
