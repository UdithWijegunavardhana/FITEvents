import { bookmarksSagaActions } from '@/features/bookmarks/saga/bookmarksSagaActions';
import { loadBookmarks } from '@/features/bookmarks/utils/bookmarksStorage';
import { store } from '@/redux/store';
import { fixtureEvents } from '../__fixtures__/events';

const [first, second] = fixtureEvents;

function flushSaga() {
  return new Promise<void>(resolve => setTimeout(resolve, 0));
}

test('toggle adds a bookmark and persists it to MMKV', async () => {
  store.dispatch(bookmarksSagaActions.toggle(first));
  store.dispatch(bookmarksSagaActions.toggle(second));
  await flushSaga();

  expect(store.getState().bookmarks.items.map(item => item.id)).toEqual([
    second.id,
    first.id,
  ]);
  expect(loadBookmarks().map(item => item.id)).toEqual([second.id, first.id]);
});

test('toggle again removes the bookmark and updates storage', async () => {
  store.dispatch(bookmarksSagaActions.toggle(first));
  await flushSaga();

  expect(store.getState().bookmarks.items.map(item => item.id)).toEqual([
    second.id,
  ]);
  expect(loadBookmarks().map(item => item.id)).toEqual([second.id]);
});

test('restore loads bookmarks saved in MMKV', async () => {
  store.dispatch(bookmarksSagaActions.toggle(second));
  await flushSaga();
  expect(store.getState().bookmarks.items).toHaveLength(0);

  store.dispatch(bookmarksSagaActions.toggle(first));
  await flushSaga();
  store.dispatch(bookmarksSagaActions.restore());
  await flushSaga();

  expect(store.getState().bookmarks.items.map(item => item.id)).toEqual([
    first.id,
  ]);
});
