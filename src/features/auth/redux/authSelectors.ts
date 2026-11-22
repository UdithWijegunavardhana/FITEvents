import type { RootState } from '@/redux/store';

export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthRestoring = (state: RootState) => state.auth.restoring;
export const selectAuthError = (state: RootState) => state.auth.error;
