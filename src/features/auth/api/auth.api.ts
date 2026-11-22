import { baseApi } from '@/api/baseApi';
import { AUTH_BASE_URL } from '@/api/config';
import type {
  SignInRequest,
  SignInResponse,
} from '@/features/auth/api/auth.api.types';
import type { AuthSession } from '@/features/auth/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<AuthSession, SignInRequest>({
      query: body => ({
        url: `${AUTH_BASE_URL}/auth/login`,
        method: 'POST',
        body,
      }),
      transformResponse: ({
        accessToken,
        refreshToken,
        ...user
      }: SignInResponse): AuthSession => ({ accessToken, refreshToken, user }),
    }),
  }),
});
