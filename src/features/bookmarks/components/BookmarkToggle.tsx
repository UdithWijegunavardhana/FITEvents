import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BOOKMARK_LABELS } from '@/features/bookmarks/constants';
import { selectIsBookmarked } from '@/features/bookmarks/redux/bookmarksSelectors';
import { toggleBookmark } from '@/features/bookmarks/redux/bookmarksSlice';
import type { FitEvent } from '@/features/events/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { minTouchTarget, radius, useColors } from '@/theme';

type BookmarkToggleProps = {
  event: FitEvent;
  style?: StyleProp<ViewStyle>;
};

export function BookmarkToggle({
  event,
  style,
}: Readonly<BookmarkToggleProps>) {
  const colors = useColors();
  const dispatch = useAppDispatch();
  const isBookmarked = useAppSelector(state =>
    selectIsBookmarked(state, event.id),
  );

  return (
    <Pressable
      testID={`bookmark-toggle-${event.id}`}
      accessibilityRole="button"
      accessibilityLabel={
        isBookmarked
          ? BOOKMARK_LABELS.remove(event.title)
          : BOOKMARK_LABELS.add(event.title)
      }
      accessibilityState={{ selected: isBookmarked }}
      onPress={() => dispatch(toggleBookmark(event))}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
        size={22}
        color={isBookmarked ? colors.accent : colors.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.7,
  },
});
