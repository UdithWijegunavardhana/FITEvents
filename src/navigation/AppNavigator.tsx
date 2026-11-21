import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { BottomTabNavigator } from '@/navigation/BottomTabNavigator';
import { getNavigationTheme } from '@/navigation/navigationTheme';
import { useColors } from '@/theme';

export function AppNavigator() {
  const colors = useColors();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer theme={getNavigationTheme(colors, isDarkMode)}>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
