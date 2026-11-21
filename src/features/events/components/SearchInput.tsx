import { FILTER_LABELS } from '@/features/events/constants';
import {
  minTouchTarget,
  radius,
  spacing,
  typography,
  useColors,
} from '@/theme';
import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import { StyleSheet, TextInput, View } from 'react-native';

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function SearchInput({
  value,
  onChangeText,
}: Readonly<SearchInputProps>) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Ionicons
        name="search"
        size={18}
        color={colors.textSecondary}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <TextInput
        testID="search-input"
        accessibilityLabel={FILTER_LABELS.searchAccessibility}
        placeholder={FILTER_LABELS.searchPlaceholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        returnKeyType="search"
        style={[styles.input, { color: colors.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: minTouchTarget,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  input: {
    ...typography.body,
    flex: 1,
  },
});
