// Redux-Saga demo (s3-saga-demo): the same "load events" flow as
// `useGetEventsQuery()` in the RTK Query version of this app.
// A saga starts from a plain trigger action. Nothing happens until a screen
// dispatches it, and the saga then dispatches every state change itself.
// With RTK Query the generated hook does both: it fetches on mount and
// exposes the loading and error state.
import { createAction } from '@reduxjs/toolkit';

export const eventsSagaActions = {
  fetchEvents: createAction('Events/FetchEvents'),
};
