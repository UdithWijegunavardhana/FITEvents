import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getNavigationTheme } from '@/navigation/navigationTheme';
import { RootTabs } from '@/navigation/RootTabs';
import { useColors } from '@/theme';

export function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = useColors();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* NavigationContainer holds the navigation state for the whole app. */}
      <NavigationContainer theme={getNavigationTheme(colors, isDarkMode)}>
        <RootTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
