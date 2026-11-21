import { StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { PROFILE_LABELS } from '@/features/profile/constants';
import { radius, spacing, typography } from '@/theme';

export function ThemeToggleRow() {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>
        {PROFILE_LABELS.darkMode}
      </Text>
      <Switch
        testID="theme-toggle"
        accessibilityLabel={PROFILE_LABELS.darkMode}
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: colors.border, true: colors.accent }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    ...typography.body,
  },
});
