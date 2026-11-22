import type { SignInResponse } from '@/features/auth/api/auth.api.types';

export const fixtureSignInResponse: SignInResponse = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@x.dummyjson.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'https://dummyjson.com/icon/emilys/128',
};

export const fixtureStoredTokens = {
  username: 'tokens',
  password: JSON.stringify({
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  }),
  service: 'fitevents.auth.tokens',
  storage: 'keychain' as const,
};
