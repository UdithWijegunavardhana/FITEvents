import type { SagaIterator } from 'redux-saga';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { selectBookmarks } from '@/features/bookmarks/redux/bookmarksSelectors';
import {
  setBookmarks,
  toggleBookmark,
} from '@/features/bookmarks/redux/bookmarksSlice';
import { bookmarksSagaActions } from '@/features/bookmarks/saga/bookmarksSagaActions';
import {
  loadBookmarks,
  saveBookmarks,
} from '@/features/bookmarks/utils/bookmarksStorage';
import type { FitEvent } from '@/features/events/types';

function* restoreBookmarksSaga(): SagaIterator {
  try {
    const items: FitEvent[] = yield call(loadBookmarks);
    yield put(setBookmarks(items));
  } catch {
    yield put(setBookmarks([]));
  }
}

function* toggleBookmarkSaga(
  action: ReturnType<typeof bookmarksSagaActions.toggle>,
): SagaIterator {
  yield put(toggleBookmark(action.payload));
  try {
    const items: FitEvent[] = yield select(selectBookmarks);
    yield call(saveBookmarks, items);
  } catch {
    return;
  }
}

export function* bookmarksSaga(): SagaIterator {
  yield takeLatest(bookmarksSagaActions.restore.type, restoreBookmarksSaga);
  yield takeEvery(bookmarksSagaActions.toggle.type, toggleBookmarkSaga);
}
