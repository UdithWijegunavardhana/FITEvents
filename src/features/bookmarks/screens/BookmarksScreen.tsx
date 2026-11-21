import { FlatList, StyleSheet } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { BOOKMARKS_EMPTY } from '@/features/bookmarks/constants';
import { selectBookmarks } from '@/features/bookmarks/redux/bookmarksSelectors';
import { EventCard } from '@/features/events/components/EventCard';
import { ROUTES } from '@/navigation/routes';
import type { RootTabScreenProps } from '@/navigation/types';
import { useAppSelector } from '@/redux/hooks';
import { spacing, useColors } from '@/theme';

export function BookmarksScreen({
  navigation,
}: Readonly<RootTabScreenProps<typeof ROUTES.BOOKMARKS>>) {
  const colors = useColors();
  const bookmarks = useAppSelector(selectBookmarks);

  return (
    <FlatList
      testID="bookmarks-screen"
      data={bookmarks}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <EventCard
          event={item}
          onPress={() =>
            navigation.navigate(ROUTES.HOME_TAB, {
              screen: ROUTES.EVENT_DETAIL,
              params: { eventId: item.id },
            })
          }
        />
      )}
      ListEmptyComponent={
        <EmptyState
          testID="bookmarks-empty"
          title={BOOKMARKS_EMPTY.title}
          message={BOOKMARKS_EMPTY.message}
        />
      }
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
});
