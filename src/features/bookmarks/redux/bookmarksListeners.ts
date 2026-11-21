import { toggleBookmark } from '@/features/bookmarks/redux/bookmarksSlice';
import { saveBookmarks } from '@/features/bookmarks/utils/bookmarksStorage';
import { startAppListening } from '@/redux/listenerMiddleware';

export function startBookmarksListeners() {
  return startAppListening({
    actionCreator: toggleBookmark,
    effect: (_action, listenerApi) => {
      saveBookmarks(listenerApi.getState().bookmarks.items);
    },
  });
}
