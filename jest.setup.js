jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('react-native-nitro-modules', () => ({
  NitroModules: { createHybridObject: jest.fn() },
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

jest.mock('react-native-config', () => ({
  __esModule: true,
  default: {
    API_BASE_URL: 'http://localhost:3001',
    AUTH_BASE_URL: 'https://dummyjson.com',
    DEEP_LINK_SCHEME: 'fitevents',
  },
}));

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);

jest.mock('react-native-camera-kit', () => ({
  Camera: 'Camera',
}));

jest.mock('react-native-notify-kit', () =>
  require('react-native-notify-kit/jest-mock'),
);
