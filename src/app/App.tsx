import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getColors, spacing, typography } from '@/theme';

export function App() {
  const scheme = useColorScheme();
  const colors = getColors(scheme);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
        testID="app-root"
      >
        <Text style={[styles.title, { color: colors.accent }]}>FIT Events</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Faculty of IT · University of Moratuwa
        </Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
  },
});
