import { StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { useColors } from '@/theme';
import { PROFILE_SIGNED_OUT } from '@/features/profile/constants';

export function ProfileScreen() {
  const colors = useColors();

  return (
    <View
      testID="profile-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <EmptyState
        title={PROFILE_SIGNED_OUT.title}
        message={PROFILE_SIGNED_OUT.message}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
