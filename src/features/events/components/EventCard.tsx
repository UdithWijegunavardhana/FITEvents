import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Tag } from '@/components/Tag';
import { CATEGORY_LABELS, EVENT_CARD_HINT } from '@/features/events/constants';
import { radius, spacing, typography, useColors } from '@/theme';
import type { FitEvent } from '@/features/events/types';
import { formatShortDate } from '@/features/events/utils/formatDate';

type EventCardProps = {
  event: FitEvent;
  onPress: () => void;
};

export function EventCard({ event, onPress }: EventCardProps) {
  const colors = useColors();
  const date = formatShortDate(event.startsAt);

  return (
    <Pressable
      testID={`event-card-${event.id}`}
      accessibilityRole="button"
      // One spoken sentence for the whole card; screen readers would
      // otherwise read the tag, title and meta line as separate stops.
      accessibilityLabel={`${event.title}. ${
        CATEGORY_LABELS[event.category]
      }, ${date}, ${event.venue}`}
      accessibilityHint={EVENT_CARD_HINT}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={{ uri: event.imageUrl }}
        // Photos keep their real colours when iOS Smart Invert is on.
        accessibilityIgnoresInvertColors
        style={[styles.image, { backgroundColor: colors.border }]}
      />

      <View style={styles.body}>
        <Tag label={CATEGORY_LABELS[event.category]} />

        <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
          {event.title}
        </Text>

        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {date} · {event.venue}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    // Shadows are different APIs per platform: iOS draws a layer shadow
    // from four props, Android uses a single Material `elevation`.
    ...Platform.select({
      ios: {
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    // Round only the image's top corners. (overflow: 'hidden' on the card
    // would also clip the iOS shadow.)
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
  },
  meta: {
    ...typography.caption,
  },
  pressed: {
    opacity: 0.7,
  },
});
