import { Image, StyleSheet, Text, View } from 'react-native';
import { Tag } from '@/components/Tag';
import { CATEGORY_LABELS } from '@/features/events/constants';
import { radius, spacing, typography, useColors } from '@/theme';
import type { FitEvent } from '@/features/events/types';
import { formatShortDate } from '@/features/events/utils/formatDate';

type EventCardProps = {
  event: FitEvent;
};

export function EventCard({ event }: EventCardProps) {
  const colors = useColors();

  return (
    <View
      testID={`event-card-${event.id}`}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Image
        source={{ uri: event.imageUrl }}
        style={[styles.image, { backgroundColor: colors.border }]}
      />

      <View style={styles.body}>
        <Tag label={CATEGORY_LABELS[event.category]} />

        <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
          {event.title}
        </Text>

        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {formatShortDate(event.startsAt)} · {event.venue}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden', // clips the image to the rounded corners
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
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
});
