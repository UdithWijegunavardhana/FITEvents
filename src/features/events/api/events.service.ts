// Redux-Saga demo (s3-saga-demo): a hand-written request function.
// The RTK Query version is `eventsApi.getEvents` + `baseApi` (fetchBaseQuery),
// which already gives JSON parsing, a timeout, typed errors and a cache.
// Here every one of those is our job, and we only did the minimum: no timeout,
// no retry, no caching, no de-duplication of identical requests.
import { API_BASE_URL } from '@/api/config';
import { API_ERRORS } from '@/api/constants';
import type { FitEvent } from '@/features/events/types';

const SERVER_ERROR_STATUS = 500;

export const eventsService = {
  getAll: async (): Promise<FitEvent[]> => {
    let response: Response;
    try {
      response = await fetch(
        `${API_BASE_URL}/events?_sort=startsAt&_order=asc`,
      );
    } catch {
      throw new Error(API_ERRORS.network);
    }
    if (!response.ok) {
      throw new Error(
        response.status >= SERVER_ERROR_STATUS
          ? API_ERRORS.server
          : API_ERRORS.generic,
      );
    }
    return (await response.json()) as FitEvent[];
  },
};
