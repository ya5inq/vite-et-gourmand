'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  PublicApi,
  ProtectedApi,
  setAccessToken,
  refreshAccessToken,
} from '@/lib/api/axios';
import type { ProtectedUserGetMe200 } from '@vite-et-gourmand/sdk';

/**
 * Shape kept intentionally close to the previous Supabase-based context so that
 * consumers (Navbar, dashboard pages...) need minimal changes:
 * - `user` exposes `id`, `email`, `role` and the camelCase profile fields.
 * - `profile` mirrors the old `{ first_name, last_name, phone, role }` shape so
 *   Navbar's getInitials/getDisplayName keep working unchanged.
 */

export type AuthUser = ProtectedUserGetMe200;

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toProfile = (u: AuthUser): Profile => ({
  id: u.id,
  first_name: u.firstName ?? null,
  last_name: u.lastName ?? null,
  phone: u.phone ?? null,
  role: u.role,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMe = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const { data } = await ProtectedApi.protectedUserGetMe();
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadMe();
  }, [loadMe]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthUser> => {
      const { data } = await PublicApi.publicAuthLogin({ email, password });
      setAccessToken(data.accessToken);
      const me = await loadMe();
      if (!me) {
        throw new Error('Impossible de recuperer le profil utilisateur');
      }
      return me;
    },
    [loadMe],
  );

  const signOut = useCallback(async () => {
    try {
      await PublicApi.publicAuthLogout();
    } catch {
      // Ignore: clear local state regardless of backend response.
    } finally {
      setAccessToken(null);
      setUser(null);
      // Full reload to clear any in-memory state across the app.
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      // Try to recover a session from the httpOnly refresh cookie.
      const token = await refreshAccessToken();
      if (!isMounted) return;

      if (token) {
        await loadMe();
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [loadMe]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      profile: user ? toProfile(user) : null,
      isLoading,
      isAuthenticated: !!user,
      login,
      signOut,
      refreshProfile,
    }),
    [user, isLoading, login, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
