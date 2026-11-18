import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from '@/features/events/screens/HomeScreen';

export function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* No navigation until S2. To see the detail screen, temporarily render
          <EventDetailScreen event={mockEvents[0]} /> here instead. */}
      <HomeScreen />
    </SafeAreaProvider>
  );
}
