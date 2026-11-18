module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // These packages ship untranspiled ES modules, so Babel must process them.
  // Extends the preset's default pattern (react-native, @react-native/*).
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@react-native-vector-icons)/)',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
