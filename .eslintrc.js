module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      // Jest setup runs inside Jest, where `jest` is a global.
      files: ['jest.setup.js'],
      env: { jest: true },
    },
  ],
};
