import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventCard } from '@/components/EventCard';
import { HOME_TITLE } from '@/constants';
import { sampleEvents } from '@/data/sampleEvents';
import { spacing, typography, useColors } from '@/theme';

export function HomeScreen() {
  const colors = useColors();
  // Keep content clear of the notch / status bar and the home indicator.
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      testID="home-screen"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + spacing.lg,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
    >
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.text }]}
      >
        {HOME_TITLE}
      </Text>

      {sampleEvents.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg, // space between cards, no margins needed
  },
  title: {
    ...typography.title,
  },
});
