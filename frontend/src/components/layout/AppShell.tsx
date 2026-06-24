import React, { useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home, MessageSquare, History, BookOpen, TicketCheck, Bell,
  Settings as SettingsIcon, HelpCircle, User as UserIcon, Sparkles,
  Shield, ShieldCheck, Users as UsersIcon, BarChart3, ListChecks, Upload,
  Activity, Globe2, KeyRound, Cog, LogOut, Menu, Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ambient } from "@/components/common/Ambient";

type Item = { to: string; label: string; icon: React.ComponentType<{ className?: string }>; testId: string };

const employeeNav: Item[] = [
  { to: "/app/dashboard", label: "Dashboard", icon: Home, testId: "nav-dashboard" },
  { to: "/app/chat", label: "Assistant", icon: MessageSquare, testId: "nav-chat" },
  { to: "/app/history", label: "Chat History", icon: History, testId: "nav-history" },
  { to: "/app/policies", label: "Policy Library", icon: BookOpen, testId: "nav-policies" },
  { to: "/app/tickets", label: "My Tickets", icon: TicketCheck, testId: "nav-tickets" },
  { to: "/app/notifications", label: "Notifications", icon: Bell, testId: "nav-notifications" },
];
const hrNav: Item[] = [
  { to: "/app/hr", label: "HR Dashboard", icon: ShieldCheck, testId: "nav-hr-dashboard" },
  { to: "/app/hr/queue", label: "Ticket Queue", icon: ListChecks, testId: "nav-hr-queue" },
  { to: "/app/hr/gaps", label: "Knowledge Gaps", icon: Sparkles, testId: "nav-hr-gaps" },
];
const adminNav: Item[] = [
  { to: "/app/admin", label: "Admin", icon: Shield, testId: "nav-admin" },
  { to: "/app/admin/policies", label: "Policies", icon: BookOpen, testId: "nav-admin-policies" },
  { to: "/app/admin/policies/upload", label: "Upload Wizard", icon: Upload, testId: "nav-admin-upload" },
  { to: "/app/admin/regions", label: "Regions & Portals", icon: Globe2, testId: "nav-admin-regions" },
  { to: "/app/admin/users", label: "Users", icon: UsersIcon, testId: "nav-admin-users" },
  { to: "/app/admin/roles", label: "Roles", icon: KeyRound, testId: "nav-admin-roles" },
  { to: "/app/admin/analytics", label: "Analytics", icon: BarChart3, testId: "nav-admin-analytics" },
  { to: "/app/admin/audit", label: "Audit Logs", icon: Activity, testId: "nav-admin-audit" },
  { to: "/app/admin/n8n", label: "n8n Workflows", icon: Activity, testId: "nav-admin-n8n" },
  { to: "/app/admin/system", label: "System", icon: Cog, testId: "nav-admin-system" },
];
const accountNav: Item[] = [
  { to: "/app/profile", label: "Profile", icon: UserIcon, testId: "nav-profile" },
  { to: "/app/settings", label: "Settings", icon: SettingsIcon, testId: "nav-settings" },
  { to: "/app/help", label: "Help", icon: HelpCircle, testId: "nav-help" },
];

const AppShell: React.FC = () => {
  const { profile, role, signOut } = useAuth();
  const { theme } = useAppTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    return () => { document.documentElement.classList.remove("dark"); };
  }, [theme]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const initials =
    profile?.full_name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ||
    profile?.email?.slice(0, 2).toUpperCase() || "ZA";

  const handleSignOut = async () => { await signOut(); navigate("/sign-in"); };

  const NavSection = ({ title, items }: { title?: string; items: Item[] }) => (
    <div className="space-y-0.5">
      {title && (
        <div className="px-3 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
          {title}
        </div>
      )}
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.to === "/app/dashboard"}
          data-testid={it.testId}
          className={({ isActive }) =>
            `group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
              isActive
                ? "bg-gradient-to-r from-[#FF6B5B]/[0.12] to-transparent text-white"
                : "text-white/65 hover:text-white hover:bg-white/[0.04]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-gradient-to-b from-[#FF6B5B] to-[#E11D2C]" />
              )}
              <it.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#FF6B5B]" : ""}`} />
              <span className="truncate">{it.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );

  const crumb = location.pathname.split("/").filter(Boolean).slice(-1)[0] || "dashboard";

  return (
    <div className="min-h-screen text-white relative">
      <Ambient />

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 shrink-0 border-r border-white/[0.06] glass-dark transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        data-testid="sidebar"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/[0.06]">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shadow-[0_0_24px_rgba(255,107,91,0.45)]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-extrabold tracking-tight">Zensar AI</div>
              <div className="text-[9px] text-white/45 uppercase tracking-[0.24em]">Assistant · v1</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3">
            <NavSection items={employeeNav} />
            {(role === "hr" || role === "admin") && <NavSection title="HR" items={hrNav} />}
            {role === "admin" && <NavSection title="Admin" items={adminNav} />}
            <NavSection title="Account" items={accountNav} />
          </div>

          <div className="border-t border-white/[0.06] p-3">
            <NavLink to="/app/profile" data-testid="sidebar-profile-link"
              className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors">
              <Avatar className="h-9 w-9 ring-1 ring-white/10">
                <AvatarFallback className="bg-gradient-to-br from-[#1A1A6B] to-[#FF6B5B] text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">
                  {profile?.full_name || profile?.email || "User"}
                </div>
                <Badge className="h-4 mt-0.5 px-1.5 text-[9px] uppercase tracking-wider bg-white/[0.08] text-white/80 border-0">
                  {role}
                </Badge>
              </div>
              <Button size="icon" variant="ghost"
                onClick={(e) => { e.preventDefault(); handleSignOut(); }}
                data-testid="sidebar-signout-btn"
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10">
                <LogOut className="h-4 w-4" />
              </Button>
            </NavLink>
          </div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/70 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
      )}

      {/* Main */}
      <div className="flex-1 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 lg:px-8 border-b border-white/[0.06] glass-dark">
          <button data-testid="sidebar-toggle" className="lg:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-white/50 cursor-pointer hover:text-white/80 transition" data-testid="topbar-search">
              <Search className="h-3.5 w-3.5" /> Search anything
              <kbd className="text-[10px] font-mono ml-2 px-1.5 py-0.5 rounded bg-white/5">⌘K</kbd>
            </div>
            <span className="text-xs text-white/35">/</span>
            <span className="text-xs text-white/70 capitalize">{crumb}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/[0.05] text-white/80 border border-white/[0.08] hidden sm:inline-flex" data-testid="topbar-region-badge">
              <Globe2 className="h-3 w-3 mr-1.5" />
              {profile?.region_id ? "Region set" : "No region"}
            </Badge>
            <Button size="sm" variant="ghost" className="relative text-white/70 hover:text-white hover:bg-white/5"
              onClick={() => navigate("/app/notifications")} data-testid="topbar-notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#FF6B5B] pulse-soft" />
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10 4xl:px-16 relative z-10">
          <div className="container-fluid">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
