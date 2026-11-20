import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EVENT_DETAIL_TITLE, HOME_TITLE } from '@/features/events/constants';
import { EventDetailScreen } from '@/features/events/screens/EventDetailScreen';
import { HomeScreen } from '@/features/events/screens/HomeScreen';
import type { HomeStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: HOME_TITLE }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: EVENT_DETAIL_TITLE }}
      />
    </Stack.Navigator>
  );
}
