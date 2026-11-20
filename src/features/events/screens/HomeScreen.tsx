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

export function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  const colors = useColors();
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [query, setQuery] = useState('');

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

      <FlatList
        testID="event-list"
        data={visibleEvents}
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
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
});
