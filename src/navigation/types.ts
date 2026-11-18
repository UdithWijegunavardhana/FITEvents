// Typed navigation: every screen name and the params it expects live here,
// so `navigation.navigate('EventDetail', { eventId })` is checked by TypeScript.
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Screens inside the Home tab's stack.
export type HomeStackParamList = {
  Home: undefined;
  // Pass the id, not the whole event: params should stay small and
  // serialisable, and the screen looks up fresh data itself.
  EventDetail: { eventId: string };
};

// The bottom tabs. HomeTab holds a whole stack, so its params are the
// params of a screen inside that stack.
export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Bookmarks: undefined;
  Profile: undefined;
};

// Props for a screen in the Home stack. CompositeScreenProps also lets it
// navigate to the tabs that contain the stack.
export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    BottomTabScreenProps<RootTabParamList>
  >;

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;
