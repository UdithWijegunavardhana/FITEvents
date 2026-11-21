import type { IoniconsIconName } from '@react-native-vector-icons/ionicons/static';
import { ROUTES } from '@/navigation/routes';
import type { RootTabParamList } from '@/navigation/types';

type TabConfig = {
  title: string;
  testID: string;
  icon: { active: IoniconsIconName; inactive: IoniconsIconName };
};

export const TAB_CONFIG: Record<keyof RootTabParamList, TabConfig> = {
  [ROUTES.HOME_TAB]: {
    title: 'Home',
    testID: 'tab-home',
    icon: { active: 'home', inactive: 'home-outline' },
  },
  [ROUTES.BOOKMARKS]: {
    title: 'Bookmarks',
    testID: 'tab-bookmarks',
    icon: { active: 'bookmark', inactive: 'bookmark-outline' },
  },
  [ROUTES.PROFILE]: {
    title: 'Profile',
    testID: 'tab-profile',
    icon: { active: 'person', inactive: 'person-outline' },
  },
};
