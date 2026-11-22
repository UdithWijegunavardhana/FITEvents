import { minTouchTarget, radius, typography, useColors } from '@/theme';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  selected?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  selected = false,
  disabled = false,
  style,
  testID,
}: Readonly<ButtonProps>) {
  const colors = useColors();
  const isPrimary = variant === 'primary';

  const getBackgroundColor = () => {
    if (isPrimary) {
      return colors.accent;
    }
    return selected ? colors.accentSubtle : 'transparent';
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: colors.accent,
          backgroundColor: getBackgroundColor(),
        },
        style,
        (pressed || disabled) && styles.pressed,
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
