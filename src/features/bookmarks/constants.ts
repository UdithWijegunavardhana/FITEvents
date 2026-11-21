export const BOOKMARKS_EMPTY = {
  title: 'No bookmarks yet',
  message:
    'Tap the bookmark on an event to save it here. Saved events work offline.',
};

export const BOOKMARK_LABELS = {
  add: (title: string) => `Bookmark ${title}`,
  remove: (title: string) => `Remove bookmark for ${title}`,
};
