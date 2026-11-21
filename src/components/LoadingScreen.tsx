import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LOADING_LABEL } from '@/components/constants';
import { useColors } from '@/theme';

type LoadingScreenProps = {
  label?: string;
  testID?: string;
};

export function LoadingScreen({
  label = LOADING_LABEL,
  testID = 'loading-screen',
}: Readonly<LoadingScreenProps>) {
  const colors = useColors();

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
