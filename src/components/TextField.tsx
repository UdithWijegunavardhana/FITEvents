import { TEXT_FIELD_LABELS } from '@/components/constants';
import {
  minTouchTarget,
  radius,
  spacing,
  typography,
  useColors,
} from '@/theme';
import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
  type StyleProp,
  type TextInputContentSizeChangeEvent,
  type TextInputInstance,
  type ViewStyle,
} from 'react-native';

export type TextFieldHandle = {
  focus: () => void;
  blur: () => void;
};

type TextFieldAction = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
};

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  ref?: Ref<TextFieldHandle>;
  helperText?: string;
  error?: string;
  secure?: boolean;
  disabled?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  onBlur?: () => void;
  multiline?: boolean;
  maxLines?: number;
  rightAction?: TextFieldAction;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const NO_SUGGESTIONS_KEYBOARDS = new Set<KeyboardTypeOptions>([
  'numeric',
  'number-pad',
  'decimal-pad',
  'phone-pad',
  'email-address',
  'url',
]);

const FIELD_HEIGHT = 56;
const LINE_HEIGHT = typography.body.lineHeight;
const LABEL_FLOAT_Y = -12;
const LABEL_FLOAT_SCALE = 0.8;
const ANIMATION_MS = 150;

export function TextField({
  label,
  value,
  onChangeText,
  ref,
  helperText = '',
  error = '',
  secure = false,
  disabled = false,
  keyboardType = 'default',
  autoCapitalize,
  autoCorrect,
  returnKeyType,
  onSubmitEditing,
  onBlur,
  multiline = false,
  maxLines = 4,
  rightAction,
  style,
  testID,
}: Readonly<TextFieldProps>) {
  const colors = useColors();
  const inputRef = useRef<TextInputInstance>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isHidden, setIsHidden] = useState(secure);
  const [height, setHeight] = useState(FIELD_HEIGHT);
  const reduceMotion = useReduceMotion();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
  }));

  const quietKeyboard = NO_SUGGESTIONS_KEYBOARDS.has(keyboardType);
  const resolvedAutoCapitalize =
    autoCapitalize ?? (quietKeyboard || secure ? 'none' : 'sentences');
  const resolvedAutoCorrect = autoCorrect ?? !(quietKeyboard || secure);

  const isFloated = isFocused || value !== '';
  const labelProgress = useRef(new Animated.Value(isFloated ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelProgress, {
      toValue: isFloated ? 1 : 0,
      duration: reduceMotion ? 0 : ANIMATION_MS,
      useNativeDriver: true,
    }).start();
  }, [isFloated, reduceMotion, labelProgress]);

  const labelTransform = {
    transform: [
      {
        translateY: labelProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, LABEL_FLOAT_Y],
        }),
      },
      {
        scale: labelProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, LABEL_FLOAT_SCALE],
        }),
      },
    ],
  };

  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!error) {
      return;
    }
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(error);
    }
    if (reduceMotion) {
      return;
    }
    shake.setValue(0);
    Animated.timing(shake, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [error, reduceMotion, shake]);

  const shakeTransform = {
    transform: [
      {
        translateX: shake.interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [0, -8, 8, -8, 0],
        }),
      },
    ],
  };

  const handleContentSizeChange = (event: TextInputContentSizeChangeEvent) => {
    if (!multiline) {
      return;
    }
    const maxHeight = maxLines * LINE_HEIGHT + spacing.xl;
    const contentHeight = event.nativeEvent.contentSize.height + spacing.xl;
    setHeight(Math.min(Math.max(FIELD_HEIGHT, contentHeight), maxHeight));
  };

  let borderColor = colors.border;
  let labelColor = colors.textSecondary;
  if (error) {
    borderColor = colors.error;
    labelColor = colors.error;
  } else if (isFocused) {
    borderColor = colors.accent;
    labelColor = colors.accent;
  }

  const message = error || helperText;

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.field,
          {
            height: multiline ? height : FIELD_HEIGHT,
            borderColor,
            backgroundColor: colors.surface,
          },
          disabled && styles.disabled,
          shakeTransform,
        ]}
      >
        <Animated.Text
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          numberOfLines={1}
          style={[styles.label, { color: labelColor }, labelTransform]}
        >
          {label}
        </Animated.Text>
        <TextInput
          ref={inputRef}
          testID={testID}
          accessibilityLabel={label}
          accessibilityHint={helperText || undefined}
          accessibilityState={{ disabled }}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          secureTextEntry={isHidden}
          keyboardType={keyboardType}
          autoCapitalize={resolvedAutoCapitalize}
          autoCorrect={resolvedAutoCorrect}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          submitBehavior={onSubmitEditing ? 'submit' : undefined}
          multiline={multiline}
          onContentSizeChange={handleContentSizeChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          placeholder=""
          selectionColor={colors.accent}
          style={[styles.input, { color: colors.text }]}
        />

        {secure && (
          <Pressable
            testID={testID ? `${testID}-toggle` : undefined}
            accessibilityRole="button"
            accessibilityLabel={
              isHidden
                ? TEXT_FIELD_LABELS.showPassword
                : TEXT_FIELD_LABELS.hidePassword
            }
            hitSlop={spacing.sm}
            onPress={() => setIsHidden(hidden => !hidden)}
            style={styles.iconButton}
          >
            <Ionicons
              name={isHidden ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        )}

        {rightAction && (
          <Pressable
            testID={rightAction.testID}
            accessibilityRole="button"
            accessibilityLabel={rightAction.label}
            accessibilityState={{
              disabled: rightAction.disabled || rightAction.loading,
              busy: rightAction.loading,
            }}
            disabled={rightAction.disabled || rightAction.loading}
            hitSlop={spacing.sm}
            onPress={rightAction.onPress}
            style={styles.action}
          >
            <Text
              style={[
                styles.actionText,
                { color: colors.accent },
                rightAction.disabled && styles.disabled,
                rightAction.loading && styles.invisible,
              ]}
            >
              {rightAction.label}
            </Text>
            {rightAction.loading && (
              <ActivityIndicator
                color={colors.accent}
                style={StyleSheet.absoluteFill}
              />
            )}
          </Pressable>
        )}
      </Animated.View>

      {!!message && (
        <Text
          accessibilityLiveRegion={error ? 'polite' : 'none'}
          style={[
            styles.message,
            { color: error ? colors.error : colors.textSecondary },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(enabled => {
        if (active) {
          setReduceMotion(enabled);
        }
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  label: {
    ...typography.body,
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    top: (FIELD_HEIGHT - LINE_HEIGHT) / 2 - 1,
    transformOrigin: 'left center',
  },
  input: {
    ...typography.body,
    flex: 1,
    alignSelf: 'stretch',
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    paddingHorizontal: 0,
    textAlignVertical: 'top',
  },
  iconButton: {
    height: FIELD_HEIGHT - 2,
    minWidth: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    height: FIELD_HEIGHT - 2,
    justifyContent: 'center',
    paddingLeft: spacing.sm,
  },
  actionText: {
    ...typography.label,
  },
  message: {
    ...typography.caption,
    paddingHorizontal: spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  invisible: {
    opacity: 0,
  },
});
