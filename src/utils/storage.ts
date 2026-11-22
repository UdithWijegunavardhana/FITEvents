import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

export const StorageKeys = {
  BOOKMARKS: 'bookmarks',
  USER: 'user',
} as const;
