import {
  Ionicons,
  type IoniconsIconName,
} from '@react-native-vector-icons/ionicons/static';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BookmarksScreen } from '@/features/bookmarks/screens/BookmarksScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { TAB_LABELS } from '@/navigation/constants';
import { HomeStack } from '@/navigation/HomeStack';
import type { RootTabParamList } from '@/navigation/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

type TabIconProps = { focused: boolean; color: string; size: number };

// Builds a tab icon: filled when the tab is active, outline otherwise.
// Created once here, outside the component, so React doesn't see a new
// component type on every render.
function tabIcon(active: IoniconsIconName, inactive: IoniconsIconName) {
  return ({ focused, color, size }: TabIconProps) => (
    <Ionicons name={focused ? active : inactive} color={color} size={size} />
  );
}

const homeIcon = tabIcon('home', 'home-outline');
const bookmarksIcon = tabIcon('bookmark', 'bookmark-outline');
const profileIcon = tabIcon('person', 'person-outline');

export function RootTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: TAB_LABELS.home,
          // The stack inside draws its own header.
          headerShown: false,
          tabBarButtonTestID: 'tab-home',
          tabBarIcon: homeIcon,
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          title: TAB_LABELS.bookmarks,
          tabBarButtonTestID: 'tab-bookmarks',
          tabBarIcon: bookmarksIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: TAB_LABELS.profile,
          tabBarButtonTestID: 'tab-profile',
          tabBarIcon: profileIcon,
        }}
      />
    </Tab.Navigator>
  );
}
