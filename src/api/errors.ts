import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { API_ERRORS } from '@/api/constants';

export type ApiError = FetchBaseQueryError | SerializedError | undefined;

function getServerMessage(data: unknown): string | undefined {
  if (typeof data === 'object' && data !== null && 'message' in data) {
    return typeof data.message === 'string' ? data.message : undefined;
  }
  return undefined;
}

export function getErrorMessage(error: ApiError): string {
  if (!error) {
    return API_ERRORS.generic;
  }
  if (!('status' in error)) {
    return error.message ?? API_ERRORS.generic;
  }
  if (error.status === 'FETCH_ERROR') {
    return API_ERRORS.network;
  }
  if (error.status === 'TIMEOUT_ERROR') {
    return API_ERRORS.timeout;
  }
  if (typeof error.status === 'number') {
    return error.status >= 500
      ? API_ERRORS.server
      : getServerMessage(error.data) ?? API_ERRORS.generic;
  }
  return API_ERRORS.generic;
}

export function isNotFoundError(error: ApiError): boolean {
  return !!error && 'status' in error && error.status === 404;
}
