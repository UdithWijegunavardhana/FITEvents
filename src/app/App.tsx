import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EventCard } from '@/components/EventCard';
import { sampleEvents } from '@/data/sampleEvents';
import { getColors, spacing } from '@/theme';

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
        <EventCard event={sampleEvents[0]} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
});
