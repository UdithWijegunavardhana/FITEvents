import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggleRow } from '@/features/profile/components/ThemeToggleRow';
import { UserCard } from '@/features/profile/components/UserCard';
import { PROFILE_LABELS } from '@/features/profile/constants';
import { spacing, useColors } from '@/theme';

export function ProfileScreen() {
  const colors = useColors();
  const { user, logout } = useAuth();

  return (
    <View
      testID="profile-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {user ? <UserCard user={user} /> : null}
      <ThemeToggleRow />
      <Button
        testID="sign-out"
        label={PROFILE_LABELS.signOut}
        variant="secondary"
        onPress={logout}
        style={styles.signOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  signOut: {
    marginHorizontal: spacing.lg,
  },
});
