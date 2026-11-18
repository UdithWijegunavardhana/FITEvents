import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { sampleEvents } from '@/data/sampleEvents';
import { EventDetailScreen } from '@/screens/EventDetailScreen';

export function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* Temporary: there is no navigation until S2, so switch screens here.
          <HomeScreen /> */}
      <EventDetailScreen event={sampleEvents[0]} />
    </SafeAreaProvider>
  );
}
