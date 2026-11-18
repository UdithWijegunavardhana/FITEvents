import { Image, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_LABELS } from '@/constants';
import { radius, spacing, typography, useColors } from '@/theme';
import type { FitEvent } from '@/types/event';
import { formatShortDate } from '@/utils/formatDate';

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
        <View style={[styles.tag, { backgroundColor: colors.accentSubtle }]}>
          <Text style={[styles.tagText, { color: colors.accent }]}>
            {CATEGORY_LABELS[event.category]}
          </Text>
        </View>

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
  tag: {
    alignSelf: 'flex-start', // shrink to fit the text instead of stretching
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  tagText: {
    ...typography.label,
  },
  title: {
    ...typography.heading,
  },
  meta: {
    ...typography.caption,
  },
});
