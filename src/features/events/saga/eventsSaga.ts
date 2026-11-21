// Redux-Saga demo (s3-saga-demo).
// - `takeLatest` listens for the trigger action. If a new trigger arrives while
//   a saga is still running, the old saga is cancelled (the HTTP request itself
//   is not aborted, only our code after it).
// - `call` yields a description of the function call instead of running it, so
//   a test can step through the generator without any network.
// - `put` dispatches an action.
// RTK Query gives caching, de-duplicated requests and refetching without
// this code. Sagas earn their keep in multi-step flows such as retry with
// backoff, racing a request against a timeout, or debouncing a search box.
import { call, put, takeLatest } from 'redux-saga/effects';
import { API_ERRORS } from '@/api/constants';
import { eventsService } from '@/features/events/api/events.service';
import {
  getEventsFailure,
  getEventsRequest,
  getEventsSuccess,
} from '@/features/events/redux/eventsSlice';
import { eventsSagaActions } from '@/features/events/saga/eventsSagaActions';
import type { FitEvent } from '@/features/events/types';

function* fetchEventsSaga() {
  try {
    yield put(getEventsRequest());
    const events: FitEvent[] = yield call(eventsService.getAll);
    yield put(getEventsSuccess(events));
  } catch (error) {
    yield put(
      getEventsFailure(
        error instanceof Error ? error.message : API_ERRORS.generic,
      ),
    );
  }
}

export function* eventsSaga() {
  yield takeLatest(eventsSagaActions.fetchEvents.type, fetchEventsSaga);
}
