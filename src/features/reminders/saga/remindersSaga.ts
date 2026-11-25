import type { SagaIterator } from 'redux-saga';
import { call, select, takeEvery } from 'redux-saga/effects';
import { selectIsBookmarked } from '@/features/bookmarks/redux/bookmarksSelectors';
import { toggleBookmark } from '@/features/bookmarks/redux/bookmarksSlice';
import { reminderId } from '@/features/reminders/utils/reminder';
import type { RootState } from '@/redux/store';
import { cancelScheduledNotification } from '@/services/notifications';

function* cancelReminderOnUnbookmarkSaga(
  action: ReturnType<typeof toggleBookmark>,
): SagaIterator {
  const eventId = action.payload.id;
  const isBookmarked: boolean = yield select((state: RootState) =>
    selectIsBookmarked(state, eventId),
  );
  if (isBookmarked) {
    return;
  }
  try {
    yield call(cancelScheduledNotification, reminderId(eventId));
  } catch {
    return;
  }
}

export function* remindersSaga(): SagaIterator {
  yield takeEvery(toggleBookmark.type, cancelReminderOnUnbookmarkSaga);
}
