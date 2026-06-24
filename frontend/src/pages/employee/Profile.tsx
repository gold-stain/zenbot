import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, Hash, Building2, Globe2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { profile, signOut, role } = useAuth();
  const navigate = useNavigate();
  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    profile?.email?.slice(0, 2).toUpperCase() ||
    "U";

  return (
    <div data-testid="profile-page">
      <PageHeader eyebrow="Account" title="Profile" subtitle="Your identity inside Zensar AI." />
      <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-8 max-w-3xl">
        <div className="flex items-center gap-5 mb-8">
          <Avatar className="h-16 w-16 ring-2 ring-white/10">
            <AvatarFallback className="bg-gradient-to-br from-[#1A1A6B] to-[#FF6B5B] text-white font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-display text-2xl font-bold">{profile?.full_name || "Unnamed"}</div>
            <div className="text-sm text-white/60">{profile?.email}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-[#FF6B5B]/15 text-[#FF6B5B] border-0 uppercase tracking-wider text-[10px]">{role}</Badge>
              <Badge className="bg-white/5 text-white/70 border border-white/10 text-[10px]">Region-locked</Badge>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field icon={Mail} label="Email" value={profile?.email || "—"} testId="profile-email" />
          <Field icon={Hash} label="Employee ID" value={profile?.employee_id || "—"} testId="profile-empid" />
          <Field icon={Building2} label="Department" value={profile?.department || "—"} testId="profile-dept" />
          <Field icon={Globe2} label="Region" value={profile?.region_id ? "Assigned" : "Not set"} testId="profile-region" />
          <Field icon={ShieldCheck} label="Role" value={role || "—"} testId="profile-role" />
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
          <div className="text-xs text-white/50">
            Region is locked. Contact an Admin to change it.
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
    </div>
  );
};

const Field: React.FC<{ icon: React.ComponentType<{ className?: string }>; label: string; value: string; testId: string }> = ({
  icon: Icon,
  label,
  value,
  testId,
}) => (
  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4" data-testid={testId}>
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40 mb-1.5">
      <Icon className="h-3 w-3" /> {label}
    </div>
    <div className="text-sm font-medium">{value}</div>
  </div>
);

export default Profile;
