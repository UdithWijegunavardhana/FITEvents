module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // `@/x` → `src/x`, so imports don't turn into ../../../ chains.
    // Keep in sync with `paths` in tsconfig.json and `moduleNameMapper` in jest.config.js.
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: { '@': './src' },
      },
    ],
  ],
};
