import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { CategoryFilter } from '@/features/events/components/CategoryFilter';
import { EventCard } from '@/features/events/components/EventCard';
import { SearchInput } from '@/features/events/components/SearchInput';
import { EVENTS_EMPTY, EVENTS_NO_MATCH } from '@/features/events/constants';
import { mockEvents } from '@/features/events/mockEvents';
import type { EventCategory } from '@/features/events/types';
import { filterEvents } from '@/features/events/utils/filterEvents';
import type { HomeStackScreenProps } from '@/navigation/types';
import { spacing, useColors } from '@/theme';

// `navigation` comes from the stack navigator; its type knows every screen
// in HomeStackParamList and the params each one needs.
export function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  const colors = useColors();
  // Local UI state: only this screen cares about it, so no Redux needed.
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [query, setQuery] = useState('');

  // Derived data: recomputed only when the inputs change, not on every
  // render. Never store the filtered list in state; it would go stale.
  const visibleEvents = useMemo(
    () => filterEvents(mockEvents, category, query),
    [category, query],
  );

  const isFiltering = category !== null || query.trim() !== '';
  const emptyText = isFiltering ? EVENTS_NO_MATCH : EVENTS_EMPTY;

  return (
    <View
      testID="home-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.filters}>
        <SearchInput value={query} onChangeText={setQuery} />
        <CategoryFilter selected={category} onSelect={setCategory} />
      </View>

      {/* FlatList only renders the rows near the screen, unlike
          ScrollView + map, which renders every event up front. */}
      <FlatList
        testID="event-list"
        data={visibleEvents}
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
            title={emptyText.title}
            message={emptyText.message}
          />
        }
        // Tapping a card while the keyboard is open should open the card,
        // not just close the keyboard.
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filters: {
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  listContent: {
    flexGrow: 1, // lets the empty state fill the screen and centre itself
    padding: spacing.lg,
    gap: spacing.lg, // space between cards, no margins needed
  },
});
