import { ScrollView, StyleSheet } from 'react-native';
import { EventCard } from '@/features/events/components/EventCard';
import { mockEvents } from '@/features/events/mockEvents';
import type { HomeStackScreenProps } from '@/navigation/types';
import { spacing, useColors } from '@/theme';

// `navigation` comes from the stack navigator; its type knows every screen
// in HomeStackParamList and the params each one needs.
export function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  const colors = useColors();

  return (
    <ScrollView
      testID="home-screen"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      {mockEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
          onPress={() =>
            navigation.navigate('EventDetail', { eventId: event.id })
          }
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg, // space between cards, no margins needed
  },
});
