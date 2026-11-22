import { Image, StyleSheet, Text, View } from 'react-native';
import { PROFILE_LABELS } from '@/features/profile/constants';
import type { AuthUser } from '@/features/auth/types';
import { radius, spacing, typography, useColors } from '@/theme';

type UserCardProps = {
  user: AuthUser;
};

const AVATAR_SIZE = 64;

export function UserCard({ user }: Readonly<UserCardProps>) {
  const colors = useColors();
  const name = `${user.firstName} ${user.lastName}`.trim();

  return (
    <View
      testID="user-card"
      accessible
      accessibilityLabel={`${name}, ${user.email}`}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Image
        source={{ uri: user.image }}
        accessibilityLabel={PROFILE_LABELS.avatar(name)}
        style={[styles.avatar, { backgroundColor: colors.border }]}
      />
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>
          {user.email}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  details: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.heading,
  },
  email: {
    ...typography.caption,
  },
});
