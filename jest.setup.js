// Native modules don't exist in Jest's Node environment; use the mocks the
// libraries provide.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
