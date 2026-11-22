import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { authSagaActions } from '@/features/auth/saga/authSagaActions';
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthRestoring,
  selectAuthToken,
  selectAuthUser,
} from '@/features/auth/redux/authSelectors';
import type { AuthUser } from '@/features/auth/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  restoring: boolean;
  error: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  restoreSession: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAuthToken);
  const user = useAppSelector(selectAuthUser);
  const loading = useAppSelector(selectAuthLoading);
  const restoring = useAppSelector(selectAuthRestoring);
  const error = useAppSelector(selectAuthError);

  const login = useCallback(
    (username: string, password: string) => {
      dispatch(authSagaActions.login({ username, password }));
    },
    [dispatch],
  );
  const logout = useCallback(() => {
    dispatch(authSagaActions.logout());
  }, [dispatch]);
  const restoreSession = useCallback(() => {
    dispatch(authSagaActions.restoreSession());
  }, [dispatch]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: token !== null,
      loading,
      restoring,
      error,
      login,
      logout,
      restoreSession,
    }),
    [token, user, loading, restoring, error, login, logout, restoreSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
