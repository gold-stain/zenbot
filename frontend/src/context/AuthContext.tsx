import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { isSupabaseConfigured, supabase, SITE_URL } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile, Role } from "@/types";

type EditableProfile = Partial<{
  full_name: string;
  department: string;
  employee_id: string;
  avatar_url: string;
  preferred_name: string;
  pronouns: string;
  job_title: string;
  manager_name: string;
  manager_email: string;
  phone: string;
  work_location: string;
  timezone: string;
  language: string;
  start_date: string;
  employment_type: string;
  cost_center: string;
  skills: string[];
  working_hours: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  bio: string;
}>;

type ProfileSaveResult = {
  storage: "profile_columns" | "metadata_fallback" | "preview";
};

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
  updateProfile: (patch: EditableProfile) => Promise<ProfileSaveResult>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const PREVIEW_PROFILE_KEY = "zenbot.preview.profile";
const expandedProfileKeys = [
  "preferred_name",
  "pronouns",
  "job_title",
  "manager_name",
  "manager_email",
  "phone",
  "work_location",
  "timezone",
  "language",
  "start_date",
  "employment_type",
  "cost_center",
  "skills",
  "working_hours",
  "emergency_contact_name",
  "emergency_contact_phone",
  "bio",
] as const;

const previewUser = {
  id: "preview-user",
  email: "preview.employee@zensar.com",
  user_metadata: {
    full_name: "Preview Employee",
    employee_id: "ZEN-PREVIEW",
    department: "People Experience",
    role: "employee",
  },
} as unknown as User;

function readPreviewProfile(): Profile {
  const fallback: Profile = {
    id: "preview-profile",
    user_id: previewUser.id,
    email: previewUser.email || "preview.employee@zensar.com",
    full_name: "Preview Employee",
    employee_id: "ZEN-PREVIEW",
    department: "People Experience",
    role: "employee",
    region_id: "ZA",
    preferred_name: "Preview",
    pronouns: "They/them",
    job_title: "Employee Experience Analyst",
    manager_name: "Aisha Naidoo",
    manager_email: "aisha.naidoo@zensar.com",
    phone: "+27 67 119 7287",
    work_location: "Johannesburg Hybrid Hub",
    timezone: "Africa/Johannesburg",
    language: "English",
    start_date: "2024-02-12",
    employment_type: "Full-time",
    cost_center: "PEX-ZA-042",
    skills: ["HR operations", "Employee support", "Knowledge base"],
    working_hours: "Mon-Fri, 08:30-17:00 SAST",
    emergency_contact_name: "Sam Preview",
    emergency_contact_phone: "+27 64 802 3069",
    bio: "Focused on making employee support fast, clear, and human.",
  };

  try {
    const stored = window.localStorage.getItem(PREVIEW_PROFILE_KEY);
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
  } catch {
    return fallback;
  }
}

function writePreviewProfile(profile: Profile) {
  try {
    window.localStorage.setItem(PREVIEW_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage errors; preview edits still work for this session.
  }
}

function metadataProfile(currentUser: User): Profile {
  const meta = currentUser.user_metadata || {};
  return {
    id: currentUser.id,
    user_id: currentUser.id,
    email: currentUser.email || "",
    full_name: meta.full_name || null,
    employee_id: meta.employee_id || null,
    department: meta.department || null,
    role: (meta.role as Role) || "employee",
    region_id: meta.region_id || meta.region_code || null,
    preferred_name: meta.preferred_name || null,
    pronouns: meta.pronouns || null,
    job_title: meta.job_title || null,
    manager_name: meta.manager_name || null,
    manager_email: meta.manager_email || null,
    phone: meta.phone || null,
    work_location: meta.work_location || null,
    timezone: meta.timezone || null,
    language: meta.language || null,
    start_date: meta.start_date || null,
    employment_type: meta.employment_type || null,
    cost_center: meta.cost_center || null,
    skills: Array.isArray(meta.skills) ? meta.skills : [],
    working_hours: meta.working_hours || null,
    emergency_contact_name: meta.emergency_contact_name || null,
    emergency_contact_phone: meta.emergency_contact_phone || null,
    bio: meta.bio || null,
  };
}

function mergeProfileWithMetadata(dbProfile: Profile, currentUser: User): Profile {
  const metaProfile = metadataProfile(currentUser);
  const merged = { ...metaProfile, ...dbProfile };
  expandedProfileKeys.forEach((key) => {
    const dbValue = dbProfile[key];
    const metaValue = metaProfile[key];
    const hasDbValue = Array.isArray(dbValue)
      ? dbValue.length > 0
      : Boolean(dbValue);
    if (!hasDbValue && metaValue) {
      (merged as any)[key] = metaValue;
    }
  });
  return merged;
}

function metadataPatch(patch: EditableProfile) {
  return expandedProfileKeys.reduce<Record<string, unknown>>((acc, key) => {
    if (patch[key] !== undefined) acc[key] = patch[key];
    return acc;
  }, {});
}

function coreProfilePatch(patch: EditableProfile) {
  return {
    full_name: patch.full_name,
    department: patch.department,
    employee_id: patch.employee_id,
    avatar_url: patch.avatar_url,
    updated_at: new Date().toISOString(),
  };
}

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
        setProfile(mergeProfileWithMetadata(data as Profile, currentUser));
      } else {
        setProfile(metadataProfile(currentUser));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[auth] profile load failed", err);
      setProfile(metadataProfile(currentUser));
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!isSupabaseConfigured) {
        if (!mounted) return;
        setSession(null);
        setUser(previewUser);
        setProfile(readPreviewProfile());
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);
        await loadProfile(data.session?.user ?? null);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[auth] session initialization failed", err);
        if (!mounted) return;
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
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
    if (!isSupabaseConfigured) {
      const nextUser = {
        ...previewUser,
        email: email || previewUser.email,
      } as unknown as User;
      const nextProfile = {
        ...readPreviewProfile(),
        user_id: nextUser.id,
        email: nextUser.email || "preview.employee@zensar.com",
      };
      writePreviewProfile(nextProfile);
      setUser(nextUser);
      setProfile(nextProfile);
      return;
    }

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
    if (!isSupabaseConfigured) {
      const nextUser = {
        ...previewUser,
        email,
        user_metadata: {
          full_name: fullName,
          employee_id: employeeId,
          department,
          region_code: regionCode,
          role: "employee",
        },
      } as unknown as User;
      const nextProfile: Profile = {
        id: "preview-profile",
        user_id: nextUser.id,
        email,
        full_name: fullName,
        employee_id: employeeId,
        department,
        role: "employee",
        region_id: regionCode,
      };
      writePreviewProfile(nextProfile);
      setUser(nextUser);
      setProfile(nextProfile);
      return { needsConfirmation: false };
    }

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
          region_id: regionCode,
          role: "employee",
        },
      },
    });
    if (error) throw error;
    // If email confirmation is required, session will be null
    return { needsConfirmation: !data.session };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setSession(null);
      setUser(null);
      setProfile(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const requestPasswordReset = async (email: string) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        `Password reset is unavailable in local preview for ${email}. Configure Supabase to use auth email flows.`
      );
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        "Password changes are unavailable in local preview. Configure Supabase to use account security."
      );
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const updateProfile: AuthContextValue["updateProfile"] = async (patch) => {
    if (!user) throw new Error("You must be signed in to update your profile.");

    if (!isSupabaseConfigured) {
      const nextProfile = {
        ...readPreviewProfile(),
        ...profile,
        ...patch,
        user_id: user.id,
        email: user.email || profile?.email || "preview.employee@zensar.com",
      };
      writePreviewProfile(nextProfile);
      setProfile(nextProfile);
      return { storage: "preview" };
    }

    const { error } = await supabase
      .from("profiles")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    if (!error) {
      const meta = metadataPatch(patch);
      if (Object.keys(meta).length) {
        const { error: metaError } = await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            ...meta,
            full_name: patch.full_name ?? user.user_metadata?.full_name,
            employee_id: patch.employee_id ?? user.user_metadata?.employee_id,
            department: patch.department ?? user.user_metadata?.department,
          },
        });
        if (metaError) throw metaError;
      }
      return { storage: "profile_columns" };
    }

    const isMissingExpandedColumn =
      error.message?.includes("column") || error.code === "PGRST204";
    if (!isMissingExpandedColumn) throw error;

    const { error: retryError } = await supabase
      .from("profiles")
      .update(coreProfilePatch(patch))
      .eq("user_id", user.id);
    if (retryError) throw retryError;

    const { data, error: metaError } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        ...metadataPatch(patch),
        full_name: patch.full_name ?? user.user_metadata?.full_name,
        employee_id: patch.employee_id ?? user.user_metadata?.employee_id,
        department: patch.department ?? user.user_metadata?.department,
      },
    });
    if (metaError) throw metaError;
    if (data.user) setUser(data.user);
    return { storage: "metadata_fallback" };
  };

  const refreshProfile = async () => {
    if (!isSupabaseConfigured) {
      setProfile(readPreviewProfile());
      return;
    }

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
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
