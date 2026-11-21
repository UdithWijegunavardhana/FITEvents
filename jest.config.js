module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@react-native-vector-icons|@reduxjs/toolkit|immer|react-redux|redux|redux-thunk|reselect)/)',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
