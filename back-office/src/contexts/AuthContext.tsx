import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProtectedUserGetMe200 } from '@vite-et-gourmand/sdk';
import { PublicApi, ProtectedApi, getAccessToken, setAccessToken } from '@/configs/api';

export type AuthUser = ProtectedUserGetMe200;

/**
 * Backwards-compatible profile shape so existing components that read
 * snake_case fields (DashboardLayout) keep working without changes.
 */
type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: AuthUser['role'];
};

type AuthContextType = {
  user: AuthUser | null;
  profile: Profile | null;
  isReady: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isReady: false,
  isAdmin: false,
  isEmployee: false,
  login: async () => {},
  signOut: async () => {},
});

const toProfile = (user: AuthUser): Profile => ({
  id: user.id,
  first_name: user.firstName ?? null,
  last_name: user.lastName ?? null,
  role: user.role,
});

const isStaffRole = (role: AuthUser['role']): boolean =>
  role === 'EMPLOYEE' || role === 'ADMIN';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  // Boot: try to recover a session. If a (possibly expired) access token is
  // persisted, calling getMe will transparently trigger a refresh (old token in
  // body + httpOnly cookie) via the axios 401 interceptor. With no stored token
  // there is no session to recover.
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (!getAccessToken()) {
        if (!cancelled) setIsReady(true);
        return;
      }

      try {
        const { data } = await ProtectedApi.protectedUserGetMe();
        if (!cancelled) {
          if (isStaffRole(data.role)) {
            setUser(data);
          } else {
            setUser(null);
            setAccessToken(null);
          }
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setAccessToken(null);
        }
      }

      if (!cancelled) setIsReady(true);
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const { data: loginData } = await PublicApi.publicAuthLogin({ email, password });
    setAccessToken(loginData.accessToken);

    const { data: me } = await ProtectedApi.protectedUserGetMe();
    if (!isStaffRole(me.role)) {
      // Not a staff member: drop the session and refuse access.
      setAccessToken(null);
      await PublicApi.publicAuthLogout().catch(() => undefined);
      throw new Error('Accès refusé. Vous devez être employé ou administrateur.');
    }

    setUser(me);
  };

  const signOut = async (): Promise<void> => {
    try {
      await PublicApi.publicAuthLogout();
    } catch {
      // Ignore logout errors; we clear local state regardless.
    }
    setAccessToken(null);
    setUser(null);
    navigate('/login');
  };

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      profile: user ? toProfile(user) : null,
      isReady,
      isAdmin: user?.role === 'ADMIN',
      isEmployee: user ? isStaffRole(user.role) : false,
      login,
      signOut,
    }),
    // login/signOut are stable closures over setters; intentionally omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isReady],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be within AuthProvider');
  return context;
};
