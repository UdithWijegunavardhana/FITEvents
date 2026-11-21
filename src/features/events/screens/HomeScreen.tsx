import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { getErrorMessage } from '@/api/errors';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CategoryFilter } from '@/features/events/components/CategoryFilter';
import { useGetEventsQuery } from '@/features/events/api/events.api';
import { EventCard } from '@/features/events/components/EventCard';
import { SearchInput } from '@/features/events/components/SearchInput';
import {
  EVENTS_EMPTY,
  EVENTS_LOADING_LABEL,
  EVENTS_NO_MATCH,
} from '@/features/events/constants';
import type { EventCategory } from '@/features/events/types';
import { filterEvents } from '@/features/events/utils/filterEvents';
import { ROUTES } from '@/navigation/routes';
import type { HomeStackScreenProps } from '@/navigation/types';
import { spacing, useColors } from '@/theme';

export function HomeScreen({
  navigation,
}: Readonly<HomeStackScreenProps<typeof ROUTES.HOME>>) {
  const colors = useColors();
  const {
    data: events,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetEventsQuery();
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [query, setQuery] = useState('');

  const visibleEvents = useMemo(
    () => filterEvents(events ?? [], category, query),
    [events, category, query],
  );

  const isRefreshing = isFetching && !isLoading;
  const isFiltering = category !== null || query.trim() !== '';
  const emptyText = isFiltering ? EVENTS_NO_MATCH : EVENTS_EMPTY;

  if (isLoading) {
    return (
      <LoadingScreen label={EVENTS_LOADING_LABEL} testID="events-loading" />
    );
  }

  if (isError && !events) {
    return (
      <ErrorState
        testID="events-error"
        message={getErrorMessage(error)}
        onRetry={refetch}
      />
    );
  }

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
              navigation.navigate(ROUTES.EVENT_DETAIL, { eventId: item.id })
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
        refreshing={isRefreshing}
        onRefresh={refetch}
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
