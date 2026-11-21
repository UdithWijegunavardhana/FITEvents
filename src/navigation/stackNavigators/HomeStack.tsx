import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EVENT_DETAIL_TITLE, HOME_TITLE } from '@/features/events/constants';
import { EventDetailScreen } from '@/features/events/screens/EventDetailScreen';
import { HomeScreen } from '@/features/events/screens/HomeScreen';
import { ROUTES } from '@/navigation/routes';
import type { HomeStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.HOME}
      screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}
    >
      <Stack.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{ title: HOME_TITLE }}
      />
      <Stack.Screen
        name={ROUTES.EVENT_DETAIL}
        component={EventDetailScreen}
        getId={({ params }) => params.eventId}
        options={{ title: EVENT_DETAIL_TITLE }}
      />
    </Stack.Navigator>
  );
}
