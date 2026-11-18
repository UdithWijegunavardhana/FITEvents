import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { App } from '@/app/App';

test('renders the Home tab first', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });

  expect(
    renderer?.root.findAllByProps({ testID: 'home-screen' }).length,
  ).toBeGreaterThan(0);

  // Unmount inside act so navigation's pending updates finish before Jest
  // tears the environment down.
  await ReactTestRenderer.act(async () => {
    renderer?.unmount();
  });
});
