import type { LinkingOptions } from '@react-navigation/native';
import { useEffect, useMemo, useRef } from 'react';
import { Linking } from 'react-native';
import { DEEP_LINK_PREFIX, linkingConfig } from '@/navigation/linking';
import type { RootTabParamList } from '@/navigation/types';

type UrlListener = (url: string) => void;

export function useDeepLinking(
  isAuthenticated: boolean,
): LinkingOptions<RootTabParamList> {
  const isAuthenticatedRef = useRef(isAuthenticated);
  const pendingUrlRef = useRef<string | null>(null);
  const listenerRef = useRef<UrlListener | null>(null);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
    const pendingUrl = pendingUrlRef.current;
    if (isAuthenticated && pendingUrl && listenerRef.current) {
      pendingUrlRef.current = null;
      listenerRef.current(pendingUrl);
    }
  }, [isAuthenticated]);

  return useMemo(
    () => ({
      prefixes: [DEEP_LINK_PREFIX],
      config: linkingConfig,
      async getInitialURL() {
        const url = await Linking.getInitialURL();
        if (isAuthenticatedRef.current) {
          return url;
        }
        pendingUrlRef.current = url ?? null;
        return null;
      },
      subscribe(listener: UrlListener) {
        listenerRef.current = listener;
        const subscription = Linking.addEventListener('url', ({ url }) => {
          if (isAuthenticatedRef.current) {
            listener(url);
          } else {
            pendingUrlRef.current = url ?? null;
          }
        });
        return () => {
          listenerRef.current = null;
          subscription.remove();
        };
      },
    }),
    [],
  );
}
