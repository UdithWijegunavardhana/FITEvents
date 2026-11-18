import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { CATEGORY_LABELS, DETAIL_LABELS, capacityText } from '@/constants';
import { radius, spacing, typography, useColors } from '@/theme';
import type { FitEvent } from '@/types/event';
import { formatLongDate, formatTimeRange } from '@/utils/formatDate';

type EventDetailScreenProps = {
  event: FitEvent;
};

export function EventDetailScreen({ event }: EventDetailScreenProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  // Label + value pairs, rendered as rows below.
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
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + spacing.lg,
      }}
    >
      <Image
        source={{ uri: event.imageUrl }}
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
            <View key={item.label} style={styles.detailRow}>
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

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {DETAIL_LABELS.about}
        </Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {event.description}
        </Text>

        {/* Not wired up yet: bookmarks arrive in S3, registration in S4. */}
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
    flexDirection: 'row', // label on the left, value on the right
    gap: spacing.md,
  },
  detailLabel: {
    ...typography.label,
    width: 88, // fixed column so all values line up
  },
  detailValue: {
    ...typography.body,
    flex: 1, // take the remaining width and wrap inside it
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
    flex: 1, // both buttons share the row equally
  },
});
