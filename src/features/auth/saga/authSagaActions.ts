import { createAction } from '@reduxjs/toolkit';
import type { SignInRequest } from '@/features/auth/api/auth.api.types';

export const authSagaActions = {
  login: createAction<SignInRequest>('Auth/Login'),
  logout: createAction('Auth/Logout'),
  restoreSession: createAction('Auth/RestoreSession'),
};
