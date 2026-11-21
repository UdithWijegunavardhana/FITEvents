import { Tag } from '@/components/Tag';
import { CATEGORY_LABELS, EVENT_CARD_HINT } from '@/features/events/constants';
import type { FitEvent } from '@/features/events/types';
import { formatShortDate } from '@/features/events/utils/formatDate';
import { radius, spacing, typography, useColors } from '@/theme';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type EventCardProps = {
  event: FitEvent;
  onPress: () => void;
};

export function EventCard({ event, onPress }: Readonly<EventCardProps>) {
  const colors = useColors();
  const date = formatShortDate(event.startsAt);

  return (
    <Pressable
      testID={`event-card-${event.id}`}
      accessibilityRole="button"
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
