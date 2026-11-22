import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppNavigator } from '@/navigation/AppNavigator';
import { store } from '@/redux/store';

export function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
