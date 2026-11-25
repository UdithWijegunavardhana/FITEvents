import type { LinkingOptions } from '@react-navigation/native';
import { ROUTES } from '@/navigation/routes';
import type { RootTabParamList } from '@/navigation/types';

export const DEEP_LINK_PREFIX = 'fitevents://';

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
