import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { BottomTabNavigator } from '@/navigation/BottomTabNavigator';
import { getNavigationTheme } from '@/navigation/navigationTheme';
import { AuthStack } from '@/navigation/stackNavigators/AuthStack';

export function AppNavigator() {
  const { colors, isDark } = useTheme();
  const { isAuthenticated, restoring, restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {restoring ? (
        <LoadingScreen />
      ) : (
        <NavigationContainer theme={getNavigationTheme(colors, isDark)}>
          {isAuthenticated ? <BottomTabNavigator /> : <AuthStack />}
        </NavigationContainer>
      )}
    </>
  );
}
