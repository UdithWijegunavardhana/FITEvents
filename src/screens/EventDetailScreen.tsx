import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORY_LABELS, DETAIL_LABELS, capacityText } from '@/constants';
import {
  minTouchTarget,
  radius,
  spacing,
  typography,
  useColors,
} from '@/theme';
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
        <View style={[styles.tag, { backgroundColor: colors.accentSubtle }]}>
          <Text style={[styles.tagText, { color: colors.accent }]}>
            {CATEGORY_LABELS[event.category]}
          </Text>
        </View>

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
          <Pressable
            testID="bookmark-button"
            accessibilityRole="button"
            accessibilityLabel={DETAIL_LABELS.bookmark}
            style={({ pressed }) => [
              styles.button,
              { borderColor: colors.accent },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.buttonText, { color: colors.accent }]}>
              {DETAIL_LABELS.bookmark}
            </Text>
          </Pressable>

          <Pressable
            testID="register-button"
            accessibilityRole="button"
            accessibilityLabel={DETAIL_LABELS.register}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.accent, borderColor: colors.accent },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.buttonText, { color: colors.onAccent }]}>
              {DETAIL_LABELS.register}
            </Text>
          </Pressable>
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
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  tagText: {
    ...typography.label,
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
  button: {
    flex: 1, // both buttons share the row equally
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
  },
  buttonText: {
    ...typography.button,
  },
  pressed: {
    opacity: 0.7,
  },
});
