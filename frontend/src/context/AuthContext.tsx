import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase, SITE_URL } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile, Role } from "@/types";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: Role | null;
  regionId: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: {
    email: string;
    password: string;
    fullName: string;
    employeeId: string;
    department: string;
    regionCode: string;
  }) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setProfile(data as Profile);
      } else {
        // Fallback to user_metadata if profile row missing
        const meta = currentUser.user_metadata || {};
        setProfile({
          id: currentUser.id,
          user_id: currentUser.id,
          email: currentUser.email || "",
          full_name: meta.full_name || null,
          employee_id: meta.employee_id || null,
          department: meta.department || null,
          role: (meta.role as Role) || "employee",
          region_id: meta.region_id || null,
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[auth] profile load failed", err);
      const meta = currentUser.user_metadata || {};
      setProfile({
        id: currentUser.id,
        user_id: currentUser.id,
        email: currentUser.email || "",
        full_name: meta.full_name || null,
        employee_id: meta.employee_id || null,
        department: meta.department || null,
        role: (meta.role as Role) || "employee",
        region_id: meta.region_id || null,
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      await loadProfile(data.session?.user ?? null);
      setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        await loadProfile(newSession?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp: AuthContextValue["signUp"] = async ({
    email,
    password,
    fullName,
    employeeId,
    department,
    regionCode,
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${SITE_URL}/verify-email`,
        data: {
          full_name: fullName,
          employee_id: employeeId,
          department,
          region_code: regionCode,
          role: "employee",
        },
      },
    });
    if (error) throw error;
    // If email confirmation is required, session will be null
    return { needsConfirmation: !data.session };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const requestPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const refreshProfile = async () => {
    await loadProfile(user);
  };

  const value: AuthContextValue = {
    session,
    user,
    profile,
    role: profile?.role ?? null,
    regionId: profile?.region_id ?? null,
    loading,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updatePassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
