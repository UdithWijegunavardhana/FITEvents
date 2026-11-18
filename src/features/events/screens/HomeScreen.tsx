import { FlatList, StyleSheet } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { EventCard } from '@/features/events/components/EventCard';
import { EVENTS_EMPTY } from '@/features/events/constants';
import { mockEvents } from '@/features/events/mockEvents';
import type { HomeStackScreenProps } from '@/navigation/types';
import { spacing, useColors } from '@/theme';

// `navigation` comes from the stack navigator; its type knows every screen
// in HomeStackParamList and the params each one needs.
export function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  const colors = useColors();

  // FlatList only renders the rows near the screen, unlike ScrollView +
  // map, which renders every event up front.
  return (
    <FlatList
      testID="home-screen"
      data={mockEvents}
      // A stable, unique key per row lets React reuse rows correctly.
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <EventCard
          event={item}
          onPress={() =>
            navigation.navigate('EventDetail', { eventId: item.id })
          }
        />
      )}
      ListEmptyComponent={
        <EmptyState
          testID="events-empty"
          title={EVENTS_EMPTY.title}
          message={EVENTS_EMPTY.message}
        />
      }
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1, // lets the empty state fill the screen and centre itself
    padding: spacing.lg,
    gap: spacing.lg, // space between cards, no margins needed
  },
});
