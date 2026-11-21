import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BookmarksScreen } from '@/features/bookmarks/screens/BookmarksScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { selectBookmarkCount } from '@/features/bookmarks/redux/bookmarksSelectors';
import {
  bookmarksTabLabel,
  MAX_BADGE_COUNT,
  TAB_CONFIG,
} from '@/navigation/constants';
import { ROUTES } from '@/navigation/routes';
import { HomeStack } from '@/navigation/stackNavigators/HomeStack';
import type { RootTabParamList } from '@/navigation/types';
import { useAppSelector } from '@/redux/hooks';
import { useColors } from '@/theme';

const Tab = createBottomTabNavigator<RootTabParamList>();

type TabIconProps = { focused: boolean; color: string; size: number };

const createTabBarIcon = (routeName: keyof RootTabParamList) => {
  const { active, inactive } = TAB_CONFIG[routeName].icon;

  return ({ focused, color, size }: TabIconProps) => (
    <Ionicons name={focused ? active : inactive} color={color} size={size} />
  );
};

const tabBarIcons = {
  [ROUTES.HOME_TAB]: createTabBarIcon(ROUTES.HOME_TAB),
  [ROUTES.BOOKMARKS]: createTabBarIcon(ROUTES.BOOKMARKS),
  [ROUTES.PROFILE]: createTabBarIcon(ROUTES.PROFILE),
};

export function BottomTabNavigator() {
  const colors = useColors();
  const bookmarkCount = useAppSelector(selectBookmarkCount);
  const badgeStyle = {
    backgroundColor: colors.accent,
    color: colors.onAccent,
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        title: TAB_CONFIG[route.name].title,
        tabBarButtonTestID: TAB_CONFIG[route.name].testID,
        tabBarIcon: tabBarIcons[route.name],
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarBadgeStyle: badgeStyle,
        ...(route.name === ROUTES.BOOKMARKS && bookmarkCount > 0
          ? {
              tabBarBadge:
                bookmarkCount > MAX_BADGE_COUNT
                  ? `${MAX_BADGE_COUNT}+`
                  : bookmarkCount,
              tabBarAccessibilityLabel: bookmarksTabLabel(
                TAB_CONFIG[route.name].title,
                bookmarkCount,
              ),
            }
          : {}),
      })}
    >
      <Tab.Screen
        name={ROUTES.HOME_TAB}
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name={ROUTES.BOOKMARKS} component={BookmarksScreen} />
      <Tab.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
}
