import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { minTouchTarget, radius, typography, useColors } from '@/theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  // primary = filled accent, secondary = accent outline
  variant?: 'primary' | 'secondary';
  // Lets the parent control layout (e.g. flex: 1 in a row).
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  style,
  testID,
}: ButtonProps) {
  const colors = useColors();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: colors.accent,
          backgroundColor: isPrimary ? colors.accent : 'transparent',
        },
        style,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: isPrimary ? colors.onAccent : colors.accent },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
  },
  text: {
    ...typography.button,
  },
  pressed: {
    opacity: 0.7,
  },
});
