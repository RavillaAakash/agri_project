import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/services/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Language } from '@/types/agricultural';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  preferredLanguage: Language;
  state: string;
  district: string;
  role: 'farmer' | 'expert' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    profileData: {
      fullName: string;
      phoneNumber: string;
      state: string;
      district: string;
      preferredLanguage: Language;
    }
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  loginAsDemo: (role: 'farmer' | 'expert') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_FARMER_PROFILE: UserProfile = {
  id: 'demo-farmer-01',
  email: 'farmer@telangana-rythu.org',
  fullName: 'Aakash Ravilla (రైతు)',
  phoneNumber: '+91 98490 12345',
  preferredLanguage: 'te',
  state: 'Telangana',
  district: 'Warangal',
  role: 'farmer',
};

const DEMO_EXPERT_PROFILE: UserProfile = {
  id: 'demo-expert-01',
  email: 'scientist@pjtsau.edu.in',
  fullName: 'Dr. K. Srinivas Rao (Agronomist)',
  phoneNumber: '+91 94400 54321',
  preferredLanguage: 'en',
  state: 'Telangana',
  district: 'Hyderabad / Rajendranagar',
  role: 'expert',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('agri_cached_profile');
    return saved ? JSON.parse(saved) : DEMO_FARMER_PROFILE; // Default demo farmer
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Live Supabase Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email ?? '');
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email ?? '');
      } else {
        setProfile(null);
        localStorage.removeItem('agri_cached_profile');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        const loadedProfile: UserProfile = {
          id: data.id,
          email,
          fullName: data.full_name,
          phoneNumber: data.phone_number,
          preferredLanguage: data.preferred_language || 'en',
          state: data.state || 'Telangana',
          district: data.district || '',
          role: data.role || 'farmer',
        };
        setProfile(loadedProfile);
        localStorage.setItem('agri_cached_profile', JSON.stringify(loadedProfile));
      }
    } catch {
      // Fallback
    }
  };

  const signIn = async (email: string, password?: string) => {
    if (!isSupabaseConfigured()) {
      // Local fallback
      setProfile(DEMO_FARMER_PROFILE);
      localStorage.setItem('agri_cached_profile', JSON.stringify(DEMO_FARMER_PROFILE));
      return {};
    }

    if (!password) {
      return { error: 'Password required' };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message };
  };

  const signUp = async (
    email: string,
    password: string,
    profileData: {
      fullName: string;
      phoneNumber: string;
      state: string;
      district: string;
      preferredLanguage: Language;
    }
  ) => {
    if (!isSupabaseConfigured()) {
      const newProf: UserProfile = {
        id: `farmer-${Date.now()}`,
        email,
        fullName: profileData.fullName,
        phoneNumber: profileData.phoneNumber,
        preferredLanguage: profileData.preferredLanguage,
        state: profileData.state,
        district: profileData.district,
        role: 'farmer',
      };
      setProfile(newProf);
      localStorage.setItem('agri_cached_profile', JSON.stringify(newProf));
      return {};
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { error: error.message };

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: profileData.fullName,
        phone_number: profileData.phoneNumber,
        state: profileData.state,
        district: profileData.district,
        preferred_language: profileData.preferredLanguage,
        role: 'farmer',
      });
    }

    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    localStorage.removeItem('agri_cached_profile');
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured()) {
      return {};
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error?.message };
  };

  const loginAsDemo = (role: 'farmer' | 'expert') => {
    const prof = role === 'farmer' ? DEMO_FARMER_PROFILE : DEMO_EXPERT_PROFILE;
    setProfile(prof);
    localStorage.setItem('agri_cached_profile', JSON.stringify(prof));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
