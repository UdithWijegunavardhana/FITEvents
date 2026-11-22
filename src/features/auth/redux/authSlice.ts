import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '@/features/auth/types';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  restoring: boolean;
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  restoring: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{ token: string; user: AuthUser | null }>,
    ) {
      state.loading = false;
      state.restoring = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout() {
      return { ...initialState, restoring: false };
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
