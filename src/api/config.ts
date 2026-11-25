import Config from 'react-native-config';

function readEnv(name: 'API_BASE_URL' | 'AUTH_BASE_URL'): string {
  const value = Config[name];
  if (!value) {
    throw new Error(`${name} is missing. Check the .env file for this build.`);
  }
  return value;
}

export const API_BASE_URL = readEnv('API_BASE_URL');

export const AUTH_BASE_URL = readEnv('AUTH_BASE_URL');

export const API_TIMEOUT_MS = 10000;
