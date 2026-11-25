import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ROUTES } from '@/navigation/routes';

export type AuthStackParamList = {
  [ROUTES.SIGN_IN]: undefined;
};

export type HomeStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.EVENT_DETAIL]: { eventId: string };
};

export type RootTabParamList = {
  [ROUTES.HOME_TAB]: NavigatorScreenParams<HomeStackParamList>;
  [ROUTES.BOOKMARKS]: undefined;
  [ROUTES.SCAN]: undefined;
  [ROUTES.PROFILE]: undefined;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    BottomTabScreenProps<RootTabParamList>
  >;

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;
