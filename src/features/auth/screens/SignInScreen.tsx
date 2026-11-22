import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/contexts/AuthContext';
import { SIGN_IN_STRINGS } from '@/features/auth/constants';
import type { SignInFormValues } from '@/features/auth/types';
import { passwordRules, usernameRules } from '@/features/auth/validation';
import { spacing, typography, useColors } from '@/theme';

const DEFAULT_VALUES: SignInFormValues = { username: '', password: '' };

export function SignInScreen() {
  const colors = useColors();
  const { login, loading, error } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({ defaultValues: DEFAULT_VALUES });

  const onSubmit = ({ username, password }: SignInFormValues) => {
    login(username.trim(), password);
  };

  return (
    <SafeAreaView
      testID="sign-in-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: colors.text }]}
          >
            {SIGN_IN_STRINGS.title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {SIGN_IN_STRINGS.subtitle}
          </Text>
          <View style={styles.form}>
            <Controller
              control={control}
              name="username"
              rules={usernameRules}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  testID="sign-in-username"
                  label={SIGN_IN_STRINGS.username}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  disabled={loading}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              rules={passwordRules}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  testID="sign-in-password"
                  label={SIGN_IN_STRINGS.password}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secure
                  returnKeyType="go"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  disabled={loading}
                />
              )}
            />
            {error ? (
              <Text
                testID="sign-in-error"
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
                style={[styles.error, { color: colors.error }]}
              >
                {error}
              </Text>
            ) : null}
            <Button
              testID="sign-in-submit"
              label={
                loading ? SIGN_IN_STRINGS.submitting : SIGN_IN_STRINGS.submit
              }
              disabled={loading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  error: {
    ...typography.caption,
  },
});
