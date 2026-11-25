import { useCallback, useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';

const CAMERA_PERMISSION =
  Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

async function safely(
  read: () => Promise<PermissionStatus>,
): Promise<PermissionStatus> {
  try {
    return await read();
  } catch {
    return RESULTS.UNAVAILABLE;
  }
}

export function useCameraPermission() {
  const [status, setStatus] = useState<PermissionStatus | null>(null);

  const refresh = useCallback(async () => {
    setStatus(await safely(() => check(CAMERA_PERMISSION)));
  }, []);

  const requestPermission = useCallback(async () => {
    setStatus(await safely(() => request(CAMERA_PERMISSION)));
  }, []);

  const openAppSettings = useCallback(async () => {
    try {
      await openSettings('application');
    } catch {
      setStatus(RESULTS.UNAVAILABLE);
    }
  }, []);

  useEffect(() => {
    refresh();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh();
      }
    });
    return () => subscription.remove();
  }, [refresh]);

  return { status, requestPermission, openAppSettings };
}
