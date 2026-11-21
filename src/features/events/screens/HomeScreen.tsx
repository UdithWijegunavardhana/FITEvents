import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CategoryFilter } from '@/features/events/components/CategoryFilter';
import {
  selectEvents,
  selectEventsError,
  selectEventsLoading,
} from '@/features/events/redux/eventsSelectors';
import { eventsSagaActions } from '@/features/events/saga/eventsSagaActions';
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
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { spacing, useColors } from '@/theme';

export function HomeScreen({
  navigation,
}: Readonly<HomeStackScreenProps<typeof ROUTES.HOME>>) {
  const colors = useColors();
  // Saga version. The RTK Query version of these lines was:
  //   const { data, isLoading, isFetching, isError, error, refetch } =
  //     useGetEventsQuery();
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const loading = useAppSelector(selectEventsLoading);
  const error = useAppSelector(selectEventsError);

  const fetchEvents = useCallback(() => {
    dispatch(eventsSagaActions.fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const [category, setCategory] = useState<EventCategory | null>(null);
  const [query, setQuery] = useState('');

  const visibleEvents = useMemo(
    () => filterEvents(events, category, query),
    [events, category, query],
  );

  const hasEvents = events.length > 0;
  const isLoading = loading && !hasEvents;
  const isRefreshing = loading && hasEvents;
  const isFiltering = category !== null || query.trim() !== '';
  const emptyText = isFiltering ? EVENTS_NO_MATCH : EVENTS_EMPTY;

  if (isLoading) {
    return (
      <LoadingScreen label={EVENTS_LOADING_LABEL} testID="events-loading" />
    );
  }

  if (error !== null && !hasEvents) {
    return (
      <ErrorState testID="events-error" message={error} onRetry={fetchEvents} />
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
        onRefresh={fetchEvents}
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
