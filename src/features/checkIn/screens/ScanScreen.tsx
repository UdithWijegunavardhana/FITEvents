import { useIsFocused, useLinkTo } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { RESULTS } from 'react-native-permissions';
import { LoadingScreen } from '@/components/LoadingScreen';
import { PermissionPrompt } from '@/features/checkIn/components/PermissionPrompt';
import {
  CAMERA_PERMISSION_PROMPTS,
  SCAN_LABELS,
} from '@/features/checkIn/constants';
import { useCameraPermission } from '@/features/checkIn/hooks/useCameraPermission';
import { toEventLinkPath } from '@/navigation/linking';
import { radius, spacing, typography, useColors } from '@/theme';

type ReadCodeEvent = { nativeEvent: { codeStringValue: string } };

export function ScanScreen() {
  const colors = useColors();
  const isFocused = useIsFocused();
  const linkTo = useLinkTo();
  const { status, requestPermission, openAppSettings } = useCameraPermission();
  const [scanError, setScanError] = useState<string | null>(null);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    if (isFocused) {
      hasScannedRef.current = false;
      setScanError(null);
    }
  }, [isFocused]);

  const handleReadCode = useCallback(
    (event: ReadCodeEvent) => {
      if (hasScannedRef.current) {
        return;
      }
      const path = toEventLinkPath(event.nativeEvent.codeStringValue);
      if (!path) {
        setScanError(SCAN_LABELS.invalidCode);
        return;
      }
      hasScannedRef.current = true;
      linkTo(path);
    },
    [linkTo],
  );

  if (status === null) {
    return <LoadingScreen label={SCAN_LABELS.checking} testID="scan-loading" />;
  }

  if (status === RESULTS.DENIED) {
    return (
      <PermissionPrompt
        testID="camera-permission-denied"
        title={CAMERA_PERMISSION_PROMPTS.denied.title}
        message={CAMERA_PERMISSION_PROMPTS.denied.message}
        actionLabel={CAMERA_PERMISSION_PROMPTS.denied.action}
        onAction={requestPermission}
      />
    );
  }

  if (status === RESULTS.BLOCKED) {
    return (
      <PermissionPrompt
        testID="camera-permission-blocked"
        title={CAMERA_PERMISSION_PROMPTS.blocked.title}
        message={CAMERA_PERMISSION_PROMPTS.blocked.message}
        actionLabel={CAMERA_PERMISSION_PROMPTS.blocked.action}
        onAction={openAppSettings}
      />
    );
  }

  if (status === RESULTS.UNAVAILABLE) {
    return (
      <PermissionPrompt
        testID="camera-unavailable"
        title={CAMERA_PERMISSION_PROMPTS.unavailable.title}
        message={CAMERA_PERMISSION_PROMPTS.unavailable.message}
      />
    );
  }

  return (
    <View testID="scan-screen" style={styles.container}>
      {isFocused ? (
        <Camera
          testID="scan-camera"
          style={StyleSheet.absoluteFill}
          scanBarcode
          allowedBarcodeTypes={['qr']}
          showFrame
          frameColor={colors.onAccent}
          laserColor={colors.accent}
          onReadCode={handleReadCode}
        />
      ) : null}
      <View
        style={[styles.hintBox, { backgroundColor: colors.surface }]}
        accessibilityLiveRegion="polite"
      >
        <Text
          testID="scan-hint"
          style={[
            styles.hint,
            { color: scanError ? colors.error : colors.text },
          ]}
        >
          {scanError ?? SCAN_LABELS.hint}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  hintBox: {
    borderRadius: radius.md,
    padding: spacing.md,
  },
  hint: {
    ...typography.body,
    textAlign: 'center',
  },
});
