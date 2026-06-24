import React, { useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  MessageSquare,
  History,
  BookOpen,
  TicketCheck,
  Bell,
  Settings as SettingsIcon,
  HelpCircle,
  User as UserIcon,
  Sparkles,
  Shield,
  ShieldCheck,
  Users as UsersIcon,
  BarChart3,
  ListChecks,
  Upload,
  Activity,
  Globe2,
  KeyRound,
  Cog,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    profile?.email?.slice(0, 2).toUpperCase() ||
    "ZA";

  const handleSignOut = async () => {
    await signOut();
    navigate("/sign-in");
  };

  const NavSection = ({ title, items }: { title?: string; items: Item[] }) => (
    <div className="space-y-1">
      {title && (
        <div className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
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
            `group flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
              isActive
                ? "bg-gradient-to-r from-[#FF6B5B]/15 to-transparent border border-[#FF6B5B]/30 text-white shadow-[inset_0_0_24px_rgba(255,107,91,0.08)]"
                : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
            }`
          }
        >
          <it.icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{it.label}</span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050514] text-white grain relative overflow-hidden">
      {/* ambient blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#1A1A6B]/30 blur-3xl animate-blob-drift" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-[#FF6B5B]/10 blur-3xl animate-blob-drift" />

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 shrink-0 border-r border-white/5 bg-[#0B0B20]/80 backdrop-blur-xl transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        data-testid="sidebar"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 px-5 h-16 border-b border-white/5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-extrabold tracking-tight">Zensar AI</div>
              <div className="text-[10px] text-white/50 uppercase tracking-[0.2em]">Assistant</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
            <NavSection items={employeeNav} />
            {(role === "hr" || role === "admin") && (
              <NavSection title="HR" items={hrNav} />
            )}
            {role === "admin" && <NavSection title="Admin" items={adminNav} />}
            <NavSection title="Account" items={accountNav} />
          </div>

          <div className="border-t border-white/5 p-3">
            <NavLink
              to="/app/profile"
              data-testid="sidebar-profile-link"
              className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <Avatar className="h-9 w-9 ring-1 ring-white/10">
                <AvatarFallback className="bg-gradient-to-br from-[#1A1A6B] to-[#FF6B5B] text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">
                  {profile?.full_name || profile?.email || "User"}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge className="h-4 px-1.5 text-[9px] uppercase tracking-wider bg-white/10 text-white/80 border-0">
                    {role}
                  </Badge>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  handleSignOut();
                }}
                data-testid="sidebar-signout-btn"
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </NavLink>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Main */}
      <div className="lg:pl-0 flex-1 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 lg:px-8 border-b border-white/5 bg-[#050514]/70 backdrop-blur-xl">
          <button
            data-testid="sidebar-toggle"
            className="lg:hidden p-2 rounded-lg hover:bg-white/5"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block text-sm text-white/50">
            <span className="text-white/30">Workspace</span>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-white/80">{location.pathname.split("/").pop() || "dashboard"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className="bg-white/5 text-white/80 border border-white/10 hidden sm:inline-flex"
              data-testid="topbar-region-badge"
            >
              <Globe2 className="h-3 w-3 mr-1.5" />
              {profile?.region_id ? "Region set" : "No region"}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5"
              onClick={() => navigate("/app/notifications")}
              data-testid="topbar-notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-10 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
