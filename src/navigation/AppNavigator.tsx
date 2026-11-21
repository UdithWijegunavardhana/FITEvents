import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { BottomTabNavigator } from '@/navigation/BottomTabNavigator';
import { getNavigationTheme } from '@/navigation/navigationTheme';

export function AppNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={getNavigationTheme(colors, isDark)}>
        <BottomTabNavigator />
      </NavigationContainer>
    </>
  );
}
