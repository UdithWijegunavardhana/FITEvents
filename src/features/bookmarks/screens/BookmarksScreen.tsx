import { StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { useColors } from '@/theme';
import { BOOKMARKS_EMPTY } from '@/features/bookmarks/constants';

export function BookmarksScreen() {
  const colors = useColors();

  return (
    <View
      testID="bookmarks-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <EmptyState
        title={BOOKMARKS_EMPTY.title}
        message={BOOKMARKS_EMPTY.message}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
