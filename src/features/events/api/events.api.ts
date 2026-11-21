import { baseApi } from '@/api/baseApi';
import type { FitEvent } from '@/features/events/types';

export const eventsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getEvents: build.query<FitEvent[], void>({
      query: () => ({
        url: '/events',
        params: { _sort: 'startsAt', _order: 'asc' },
      }),
    }),
    getEventById: build.query<FitEvent, string>({
      query: eventId => `/events/${eventId}`,
    }),
  }),
});

export const { useGetEventsQuery, useGetEventByIdQuery } = eventsApi;
