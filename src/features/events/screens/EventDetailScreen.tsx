import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Tag } from '@/components/Tag';
import { useGetEventByIdQuery } from '@/features/events/api/events.api';
import {
  CATEGORY_LABELS,
  DETAIL_LABELS,
  EVENT_NOT_FOUND,
  capacityText,
} from '@/features/events/constants';
import {
  formatLongDate,
  formatTimeRange,
} from '@/features/events/utils/formatDate';
import type { ROUTES } from '@/navigation/routes';
import type { HomeStackScreenProps } from '@/navigation/types';
import { radius, spacing, typography, useColors } from '@/theme';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export function EventDetailScreen({
  route,
}: Readonly<HomeStackScreenProps<typeof ROUTES.EVENT_DETAIL>>) {
  const colors = useColors();
  const { data: event } = useGetEventByIdQuery(route.params.eventId);

  if (!event) {
    return (
      <EmptyState
        testID="event-not-found"
        title={EVENT_NOT_FOUND.title}
        message={EVENT_NOT_FOUND.message}
      />
    );
  }

  const details = [
    {
      label: DETAIL_LABELS.when,
      value: `${formatLongDate(event.startsAt)}\n${formatTimeRange(
        event.startsAt,
        event.endsAt,
      )}`,
    },
    { label: DETAIL_LABELS.where, value: event.venue },
    { label: DETAIL_LABELS.organizer, value: event.organizer },
    {
      label: DETAIL_LABELS.capacity,
      value: capacityText(event.registeredCount, event.capacity),
    },
  ];

  return (
    <ScrollView
      testID="event-detail-screen"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
    >
      <Image
        source={{ uri: event.imageUrl }}
        accessibilityIgnoresInvertColors
        style={[styles.image, { backgroundColor: colors.border }]}
      />

      <View style={styles.content}>
        <Tag label={CATEGORY_LABELS[event.category]} />

        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.text }]}
        >
          {event.title}
        </Text>

        <View
          style={[
            styles.detailsCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {details.map(item => (
            <View key={item.label} accessible style={styles.detailRow}>
              <Text
                style={[styles.detailLabel, { color: colors.textSecondary }]}
              >
                {item.label}
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <Text
          accessibilityRole="header"
          style={[styles.sectionTitle, { color: colors.text }]}
        >
          {DETAIL_LABELS.about}
        </Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {event.description}
        </Text>

        <View style={styles.actions}>
          <Button
            testID="bookmark-button"
            label={DETAIL_LABELS.bookmark}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            testID="register-button"
            label={DETAIL_LABELS.register}
            style={styles.actionButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
  },
  detailsCard: {
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  detailRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  detailLabel: {
    ...typography.label,
    width: 88,
  },
  detailValue: {
    ...typography.body,
    flex: 1,
  },
  sectionTitle: {
    ...typography.heading,
    marginTop: spacing.sm,
  },
  description: {
    ...typography.body,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
