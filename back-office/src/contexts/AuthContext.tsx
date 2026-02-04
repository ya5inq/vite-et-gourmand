import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/configs/supabase';

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'visitor' | 'user' | 'employee' | 'admin';
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isReady: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isReady: false,
  isAdmin: false,
  isEmployee: false,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsReady(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role')
      .eq('id', userId)
      .single();

    setProfile(data as Profile | null);
    setIsReady(true);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    navigate('/login');
  };

  const contextValue = useMemo<AuthContextType>(() => ({
    user: session?.user ?? null,
    profile,
    session,
    isReady,
    isAdmin: profile?.role === 'admin',
    isEmployee: profile?.role === 'employee' || profile?.role === 'admin',
    signOut,
  }), [session, profile, isReady]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be within AuthProvider');
  return context;
};
