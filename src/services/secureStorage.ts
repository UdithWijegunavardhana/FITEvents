import * as Keychain from 'react-native-keychain';

const TOKENS_SERVICE = 'fitevents.auth.tokens';
const TOKENS_USERNAME = 'tokens';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

function isAuthTokens(value: unknown): value is AuthTokens {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.accessToken === 'string' &&
    typeof candidate.refreshToken === 'string'
  );
}

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await Keychain.setGenericPassword(TOKENS_USERNAME, JSON.stringify(tokens), {
    service: TOKENS_SERVICE,
  });
}

export async function loadTokens(): Promise<AuthTokens | undefined> {
  const credentials = await Keychain.getGenericPassword({
    service: TOKENS_SERVICE,
  });
  if (!credentials) {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(credentials.password);
    return isAuthTokens(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export async function clearTokens(): Promise<void> {
  await Keychain.resetGenericPassword({ service: TOKENS_SERVICE });
}
