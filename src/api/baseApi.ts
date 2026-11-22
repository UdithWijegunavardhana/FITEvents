import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, API_TIMEOUT_MS } from '@/api/config';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    timeout: API_TIMEOUT_MS,
    prepareHeaders: (headers, { getState }) => {
      const { auth } = getState() as { auth: { token: string | null } };
      if (auth.token) {
        headers.set('Authorization', `Bearer ${auth.token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
