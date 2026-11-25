import type { LinkingOptions } from '@react-navigation/native';
import { ROUTES } from '@/navigation/routes';
import type { RootTabParamList } from '@/navigation/types';

export const DEEP_LINK_PREFIX = 'fitevents://';

const EVENT_LINK_START = `${DEEP_LINK_PREFIX}event/`;

export function eventDeepLink(eventId: string): string {
  return `${EVENT_LINK_START}${eventId}`;
}
const EVENT_ID_PATTERN = /^[\w-]+$/;

export function toEventLinkPath(url: string): string | null {
  if (!url.startsWith(EVENT_LINK_START)) {
    return null;
  }
  const eventId = url.slice(EVENT_LINK_START.length);
  return EVENT_ID_PATTERN.test(eventId) ? `/event/${eventId}` : null;
}

export const linkingConfig: LinkingOptions<RootTabParamList>['config'] = {
  screens: {
    [ROUTES.HOME_TAB]: {
      initialRouteName: ROUTES.HOME,
      screens: {
        [ROUTES.EVENT_DETAIL]: 'event/:eventId',
      },
    },
  },
};
