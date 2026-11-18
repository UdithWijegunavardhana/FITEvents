import { ScrollView, StyleSheet } from 'react-native';
import { FilterChip } from '@/features/events/components/FilterChip';
import {
  CATEGORY_FILTERS,
  CATEGORY_LABELS,
  FILTER_LABELS,
} from '@/features/events/constants';
import type { EventCategory } from '@/features/events/types';
import { spacing } from '@/theme';

type CategoryFilterProps = {
  // null means "All".
  selected: EventCategory | null;
  onSelect: (category: EventCategory | null) => void;
};

// Controlled component: the parent owns the selected category and passes
// it down; this component only reports taps through onSelect.
export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <FilterChip
        testID="filter-all"
        label={FILTER_LABELS.all}
        selected={selected === null}
        onPress={() => onSelect(null)}
      />
      {CATEGORY_FILTERS.map(category => (
        <FilterChip
          key={category}
          testID={`filter-${category}`}
          label={CATEGORY_LABELS[category]}
          selected={selected === category}
          onPress={() => onSelect(category)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    // Touches outside a parent's bounds are ignored, so leave room for
    // the chips' hitSlop inside the row.
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
});
