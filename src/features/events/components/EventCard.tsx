import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Tag } from '@/components/Tag';
import { CATEGORY_LABELS } from '@/features/events/constants';
import { radius, spacing, typography, useColors } from '@/theme';
import type { FitEvent } from '@/features/events/types';
import { formatShortDate } from '@/features/events/utils/formatDate';

type EventCardProps = {
  event: FitEvent;
  onPress: () => void;
};

export function EventCard({ event, onPress }: EventCardProps) {
  const colors = useColors();

  return (
    <Pressable
      testID={`event-card-${event.id}`}
      accessibilityRole="button"
      accessibilityLabel={event.title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
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
    </Pressable>
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
  pressed: {
    opacity: 0.7,
  },
});
