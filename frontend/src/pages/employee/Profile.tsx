import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Camera,
  Edit3,
  Globe2,
  Hash,
  HeartHandshake,
  Languages,
  LifeBuoy,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import type { Profile as ProfileType } from "@/types";

type DraftProfile = {
  full_name: string;
  preferred_name: string;
  pronouns: string;
  employee_id: string;
  department: string;
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
  skills: string;
  working_hours: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  bio: string;
};

const blankDraft: DraftProfile = {
  full_name: "",
  preferred_name: "",
  pronouns: "",
  employee_id: "",
  department: "",
  job_title: "",
  manager_name: "",
  manager_email: "",
  phone: "",
  work_location: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
  language: "English",
  start_date: "",
  employment_type: "",
  cost_center: "",
  skills: "",
  working_hours: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  bio: "",
};

function profileToDraft(profile: ProfileType | null): DraftProfile {
  return {
    ...blankDraft,
    full_name: profile?.full_name || "",
    preferred_name: profile?.preferred_name || "",
    pronouns: profile?.pronouns || "",
    employee_id: profile?.employee_id || "",
    department: profile?.department || "",
    job_title: profile?.job_title || "",
    manager_name: profile?.manager_name || "",
    manager_email: profile?.manager_email || "",
    phone: profile?.phone || "",
    work_location: profile?.work_location || "",
    timezone: profile?.timezone || blankDraft.timezone,
    language: profile?.language || "English",
    start_date: profile?.start_date || "",
    employment_type: profile?.employment_type || "",
    cost_center: profile?.cost_center || "",
    skills: (profile?.skills || []).join(", "),
    working_hours: profile?.working_hours || "",
    emergency_contact_name: profile?.emergency_contact_name || "",
    emergency_contact_phone: profile?.emergency_contact_phone || "",
    bio: profile?.bio || "",
  };
}

const Profile: React.FC = () => {
  const { user, profile, signOut, role, refreshProfile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [regionName, setRegionName] = useState("Not set");
  const [metrics, setMetrics] = useState({
    tickets: 0,
    unread: 0,
    chats: 0,
  });
  const [draft, setDraft] = useState<DraftProfile>(() => profileToDraft(profile));

  useEffect(() => {
    if (!editing) setDraft(profileToDraft(profile));
  }, [editing, profile]);

  useEffect(() => {
    let active = true;

    async function loadContext() {
      if (!user) return;
      try {
        const [ticketRes, notificationRes, chatRes, regionRes] = await Promise.all([
          supabase
            .from("tickets")
            .select("*", { count: "exact", head: true })
            .eq("created_by", user.id),
          supabase
            .from("notifications")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("is_read", false),
          supabase
            .from("chat_threads")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("archived", false),
          profile?.region_id
            ? supabase
                .from("regions")
                .select("name, code")
                .eq("id", profile.region_id)
                .maybeSingle()
            : Promise.resolve({ data: null, error: null }),
        ]);

        if (!active) return;
        setMetrics({
          tickets: ticketRes.count || 0,
          unread: notificationRes.count || 0,
          chats: chatRes.count || 0,
        });
        if (regionRes.data) {
          setRegionName(`${regionRes.data.name} (${regionRes.data.code})`);
        } else if (profile?.region_id) {
          setRegionName(profile.region_id);
        } else {
          setRegionName("Not set");
        }
      } catch (err) {
        if (!active) return;
        if (profile?.region_id) setRegionName("Assigned");
      }
    }

    loadContext();
    return () => {
      active = false;
    };
  }, [profile?.region_id, user]);

  const initials = useMemo(() => {
    const source =
      profile?.preferred_name ||
      profile?.full_name ||
      profile?.email ||
      "User";
    return source
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [profile]);

  const completion = useMemo(() => {
    const fields = [
      profile?.full_name,
      profile?.employee_id,
      profile?.department,
      profile?.job_title,
      profile?.manager_name,
      profile?.phone,
      profile?.work_location,
      profile?.timezone,
      profile?.language,
      profile?.working_hours,
      profile?.bio,
      profile?.skills?.length ? profile.skills.join(",") : "",
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [profile]);

  const displayName =
    profile?.preferred_name ||
    profile?.full_name ||
    profile?.email ||
    "Employee";

  const updateDraft = (key: keyof DraftProfile, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const onCancel = () => {
    setDraft(profileToDraft(profile));
    setEditing(false);
  };

  const onSave = async () => {
    if (!user) {
      toast.error("You need to be signed in to update your profile");
      return;
    }
    if (!draft.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }

    setSaving(true);
    try {
      const result = await updateProfile({
        full_name: draft.full_name.trim(),
        preferred_name: draft.preferred_name.trim(),
        pronouns: draft.pronouns.trim(),
        employee_id: draft.employee_id.trim(),
        department: draft.department.trim(),
        job_title: draft.job_title.trim(),
        manager_name: draft.manager_name.trim(),
        manager_email: draft.manager_email.trim(),
        phone: draft.phone.trim(),
        work_location: draft.work_location.trim(),
        timezone: draft.timezone.trim(),
        language: draft.language.trim(),
        start_date: draft.start_date || "",
        employment_type: draft.employment_type.trim(),
        cost_center: draft.cost_center.trim(),
        skills: draft.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        working_hours: draft.working_hours.trim(),
        emergency_contact_name: draft.emergency_contact_name.trim(),
        emergency_contact_phone: draft.emergency_contact_phone.trim(),
        bio: draft.bio.trim(),
      });
      await refreshProfile();
      setEditing(false);
      if (result.storage === "metadata_fallback") {
        toast.success("Profile updated. Extra details are stored in Supabase Auth metadata until the profile migration is applied.");
      } else {
        toast.success("Profile updated");
      }
    } catch (err: any) {
      toast.error(err?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const onAvatarSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file for your profile picture");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile picture must be under 2 MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${user.id}/avatar.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("profile_avatars")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      let avatarUrl = "";
      let usedFallback = false;

      if (uploadError) {
        usedFallback = true;
        avatarUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
      } else {
        const { data } = supabase.storage
          .from("profile_avatars")
          .getPublicUrl(path);
        avatarUrl = `${data.publicUrl}?v=${Date.now()}`;
      }

      await updateProfile({ avatar_url: avatarUrl });
      await refreshProfile();
      toast.success(
        usedFallback
          ? "Profile picture saved. Apply the avatar bucket migration for Supabase Storage uploads."
          : "Profile picture updated"
      );
    } catch (err: any) {
      toast.error(err?.message || "Profile picture update failed");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="profile-page">
      <PageHeader
        eyebrow="Employee profile"
        title="Profile"
        subtitle="Keep your HR identity, support routing, and service context ready."
        actions={
          editing ? (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={onCancel}
                className="text-white/60 hover:bg-white/5"
                data-testid="profile-cancel-btn"
              >
                <X className="h-4 w-4 mr-1.5" /> Cancel
              </Button>
              <Button
                onClick={onSave}
                disabled={saving}
                className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] rounded-xl"
                data-testid="profile-save-btn"
              >
                <Save className="h-4 w-4 mr-1.5" /> {saving ? "Saving" : "Save"}
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setEditing(true)}
              className="text-white/80 hover:bg-white/5"
              data-testid="profile-edit-btn"
            >
              <Edit3 className="h-4 w-4 mr-1.5" /> Edit profile
            </Button>
          )
        }
      />

      <section className="grid xl:grid-cols-[1.05fr_0.95fr] gap-5">
        <div className="rounded-[2rem] border border-white/[0.07] bg-[#07140F]/90 p-7 relative overflow-hidden">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#FF6B5B]/20 blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="relative w-fit">
              <Avatar className="h-24 w-24 ring-2 ring-[#FF6B5B]/40 shadow-[0_0_40px_rgba(255,107,91,0.2)]">
                {profile?.avatar_url && (
                  <AvatarImage
                    src={profile.avatar_url}
                    alt={`${displayName} profile`}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-gradient-to-br from-[#12372A] via-[#1A1A6B] to-[#FF6B5B] text-white font-bold text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarSelected}
                data-testid="profile-avatar-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-[#FF6B5B] text-white grid place-items-center shadow-lg shadow-[#FF6B5B]/30 hover:brightness-110 disabled:opacity-60"
                title="Change profile picture"
                data-testid="profile-avatar-edit"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-[#D7FF7A]/15 text-[#D7FF7A] border border-[#D7FF7A]/20 uppercase tracking-[0.18em] text-[10px]">
                  {role || "employee"}
                </Badge>
                <Badge className="bg-white/[0.06] text-white/70 border border-white/10 text-[10px]">
                  <Lock className="mr-1 h-3 w-3" /> {regionName}
                </Badge>
              </div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight">
                {displayName}
              </h2>
              <p className="text-white/60 mt-1">
                {profile?.job_title || "Employee"} · {profile?.department || "Department pending"}
              </p>
              <p className="text-sm text-white/45 mt-3 max-w-2xl">
                {profile?.bio ||
                  "Add a short bio so HR and support teams understand your work context before they respond."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <MetricCard icon={CheckCircle2} label="Profile readiness" value={`${completion}%`} tone="green" />
          <MetricCard icon={LifeBuoy} label="Open tickets" value={String(metrics.tickets)} tone="coral" />
          <MetricCard icon={Sparkles} label="Active chats" value={String(metrics.chats)} tone="blue" />
          <MetricCard icon={Mail} label="Unread notices" value={String(metrics.unread)} tone="neutral" />
        </div>
      </section>

      {editing ? (
        <EditProfileForm draft={draft} updateDraft={updateDraft} />
      ) : (
        <ProfileDetails
          profile={profile}
          regionName={regionName}
          email={profile?.email || user?.email || ""}
        />
      )}

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">Account security</div>
          <div className="text-xs text-white/45">
            Role and region changes are controlled by HR/Admin to keep routing and RLS clean. Rich profile details save to Supabase profile columns when the expanded migration is applied, with Auth metadata fallback before then.
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={async () => {
            await signOut();
            navigate("/sign-in");
          }}
          data-testid="profile-signout-btn"
          className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </div>
    </div>
  );
};

const ProfileDetails: React.FC<{
  profile: ProfileType | null;
  regionName: string;
  email: string;
}> = ({ profile, regionName, email }) => (
  <div className="grid xl:grid-cols-3 gap-5">
    <InfoPanel title="Identity" subtitle="How ZenBot and HR recognize you.">
      <Field icon={UserRound} label="Full name" value={profile?.full_name} testId="profile-name" />
      <Field icon={Mail} label="Email" value={email} testId="profile-email" />
      <Field icon={Hash} label="Employee ID" value={profile?.employee_id} testId="profile-empid" />
      <Field icon={Languages} label="Language" value={profile?.language} testId="profile-language" />
    </InfoPanel>

    <InfoPanel title="Work Context" subtitle="Used for routing, answers, and escalation.">
      <Field icon={BriefcaseBusiness} label="Job title" value={profile?.job_title} testId="profile-job-title" />
      <Field icon={Building2} label="Department" value={profile?.department} testId="profile-dept" />
      <Field icon={Globe2} label="Region (admin managed)" value={regionName} testId="profile-region" />
      <Field icon={MapPin} label="Work location" value={profile?.work_location} testId="profile-location" />
      <Field icon={CalendarDays} label="Start date" value={profile?.start_date} testId="profile-start-date" />
      <Field icon={ShieldCheck} label="Employment type" value={profile?.employment_type} testId="profile-employment" />
    </InfoPanel>

    <InfoPanel title="Support Routing" subtitle="The details HR needs when a case escalates.">
      <Field icon={Users} label="Manager" value={profile?.manager_name} testId="profile-manager" />
      <Field icon={Mail} label="Manager email" value={profile?.manager_email} testId="profile-manager-email" />
      <Field icon={Phone} label="Phone" value={profile?.phone} testId="profile-phone" />
      <Field icon={Clock3} label="Working hours" value={profile?.working_hours} testId="profile-hours" />
      <Field icon={HeartHandshake} label="Emergency contact" value={profile?.emergency_contact_name} testId="profile-emergency" />
      <Field icon={Phone} label="Emergency phone" value={profile?.emergency_contact_phone} testId="profile-emergency-phone" />
    </InfoPanel>

    <div className="xl:col-span-3 rounded-2xl border border-white/[0.06] bg-[#0B0B20]/80 p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-display text-lg font-bold">Skills and knowledge areas</h3>
          <p className="text-sm text-white/45">Helps HR personalize guidance and route specialist requests.</p>
        </div>
        <Badge className="bg-[#FF6B5B]/15 text-[#FF6B5B] border-0">
          {(profile?.skills || []).length || 0} skills
        </Badge>
      </div>
      {(profile?.skills || []).length ? (
        <div className="flex flex-wrap gap-2">
          {(profile?.skills || []).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white/75"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-white/45">
          No skills added yet.
        </div>
      )}
    </div>
  </div>
);

const EditProfileForm: React.FC<{
  draft: DraftProfile;
  updateDraft: (key: keyof DraftProfile, value: string) => void;
}> = ({ draft, updateDraft }) => (
  <div className="grid xl:grid-cols-3 gap-5">
    <EditPanel title="Identity">
      <EditField label="Full name" value={draft.full_name} onChange={(value) => updateDraft("full_name", value)} testId="profile-name-input" />
      <EditField label="Preferred name" value={draft.preferred_name} onChange={(value) => updateDraft("preferred_name", value)} />
      <EditField label="Pronouns" value={draft.pronouns} onChange={(value) => updateDraft("pronouns", value)} />
      <EditField label="Language" value={draft.language} onChange={(value) => updateDraft("language", value)} />
    </EditPanel>

    <EditPanel title="Work Context">
      <EditField label="Employee ID" value={draft.employee_id} onChange={(value) => updateDraft("employee_id", value)} testId="profile-empid-input" />
      <EditField label="Job title" value={draft.job_title} onChange={(value) => updateDraft("job_title", value)} />
      <EditField label="Department" value={draft.department} onChange={(value) => updateDraft("department", value)} testId="profile-dept-input" />
      <EditField label="Employment type" value={draft.employment_type} onChange={(value) => updateDraft("employment_type", value)} />
      <EditField label="Cost center" value={draft.cost_center} onChange={(value) => updateDraft("cost_center", value)} />
      <EditField label="Start date" type="date" value={draft.start_date} onChange={(value) => updateDraft("start_date", value)} />
      <div className="rounded-xl border border-[#D7FF7A]/20 bg-[#D7FF7A]/10 p-3 text-xs text-[#D7FF7A]">
        <div className="flex items-center gap-2 font-semibold">
          <Lock className="h-3.5 w-3.5" /> Region is locked
        </div>
        <p className="mt-1 text-[#D7FF7A]/75">
          ZenBot auto-detects region during signup. Only admins can change it.
        </p>
      </div>
    </EditPanel>

    <EditPanel title="Routing">
      <EditField label="Manager name" value={draft.manager_name} onChange={(value) => updateDraft("manager_name", value)} />
      <EditField label="Manager email" type="email" value={draft.manager_email} onChange={(value) => updateDraft("manager_email", value)} />
      <EditField label="Phone" value={draft.phone} onChange={(value) => updateDraft("phone", value)} />
      <EditField label="Work location" value={draft.work_location} onChange={(value) => updateDraft("work_location", value)} />
      <EditField label="Timezone" value={draft.timezone} onChange={(value) => updateDraft("timezone", value)} />
      <EditField label="Working hours" value={draft.working_hours} onChange={(value) => updateDraft("working_hours", value)} />
    </EditPanel>

    <div className="xl:col-span-2">
      <EditPanel title="About and Skills">
        <div>
          <Label>Bio</Label>
          <Textarea
            value={draft.bio}
            onChange={(event) => updateDraft("bio", event.target.value)}
            className="bg-white/5 border-white/10 mt-1.5 min-h-28"
            placeholder="A short summary of your role, team, and support context."
          />
        </div>
        <EditField
          label="Skills"
          value={draft.skills}
          onChange={(value) => updateDraft("skills", value)}
          placeholder="Separate skills with commas"
        />
      </EditPanel>
    </div>

    <EditPanel title="Emergency Contact">
      <EditField label="Contact name" value={draft.emergency_contact_name} onChange={(value) => updateDraft("emergency_contact_name", value)} />
      <EditField label="Contact phone" value={draft.emergency_contact_phone} onChange={(value) => updateDraft("emergency_contact_phone", value)} />
    </EditPanel>
  </div>
);

const MetricCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "green" | "coral" | "blue" | "neutral";
}> = ({ icon: Icon, label, value, tone }) => {
  const tones = {
    green: "text-[#D7FF7A] bg-[#D7FF7A]/10 border-[#D7FF7A]/20",
    coral: "text-[#FF6B5B] bg-[#FF6B5B]/10 border-[#FF6B5B]/20",
    blue: "text-[#8EA7FF] bg-[#6366F1]/10 border-[#6366F1]/20",
    neutral: "text-white bg-white/[0.05] border-white/10",
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0B0B20]/80 p-5">
      <div className={`h-10 w-10 rounded-xl grid place-items-center border ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-2xl font-display font-extrabold">{value}</div>
      <div className="text-sm text-white/45">{label}</div>
    </div>
  );
};

const InfoPanel: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <section className="rounded-2xl border border-white/[0.06] bg-[#0B0B20]/80 p-6">
    <h3 className="font-display text-lg font-bold">{title}</h3>
    <p className="text-sm text-white/45 mb-5">{subtitle}</p>
    <div className="space-y-3">{children}</div>
  </section>
);

const EditPanel: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section className="rounded-2xl border border-white/[0.06] bg-[#0B0B20]/80 p-6 space-y-4">
    <h3 className="font-display text-lg font-bold">{title}</h3>
    {children}
  </section>
);

const Field: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
  testId: string;
}> = ({ icon: Icon, label, value, testId }) => (
  <div className="rounded-xl border border-white/5 bg-white/[0.025] p-4" data-testid={testId}>
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40 mb-1.5">
      <Icon className="h-3 w-3" /> {label}
    </div>
    <div className="text-sm font-medium text-white/85 break-words">{value || "Not set"}</div>
  </div>
);

const EditField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  testId?: string;
}> = ({ label, value, onChange, type = "text", placeholder, testId }) => (
  <div>
    <Label>{label}</Label>
    <Input
      value={value}
      type={type}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="bg-white/5 border-white/10 mt-1.5"
      data-testid={testId}
    />
  </div>
);

export default Profile;
