import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home, MessageSquare, History, BookOpen, TicketCheck, Bell,
  Settings as SettingsIcon, HelpCircle, User as UserIcon,
  Shield, ShieldCheck, Users as UsersIcon, BarChart3, ListChecks, Upload,
  Activity, Globe2, KeyRound, Cog, LogOut, Menu, Search, X, ChevronsLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MeshBackground } from "@/components/common/MeshBackground";

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
  { to: "/app/hr/gaps", label: "Knowledge Gaps", icon: Activity, testId: "nav-hr-gaps" },
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    return () => { document.documentElement.classList.remove("dark"); };
  }, [theme]);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initials =
    profile?.full_name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ||
    profile?.email?.slice(0, 2).toUpperCase() || "ZA";

  const handleSignOut = async () => { await signOut(); navigate("/sign-in"); };

  const NavSection = ({ title, items }: { title?: string; items: Item[] }) => (
    <div className="space-y-0.5">
      {title && (
        <div className="px-4 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
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
            `group relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-gradient-to-r from-[#FF6B5B]/20 to-[#FF6B5B]/5 text-white shadow-lg shadow-[#FF6B5B]/10"
                : "text-white/60 hover:text-white hover:bg-white/[0.05]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-gradient-to-b from-[#FF6B5B] to-[#E11D2C]" />
              )}
              <it.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-[#FF6B5B]" : "text-white/50 group-hover:text-white"}`} />
              <span className="truncate flex-1">{it.label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B5B]" />}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen text-white relative flex">
      <MeshBackground variant="dashboard" />

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar - ANIMATES WIDTH ON DESKTOP */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? (sidebarOpen ? 288 : 0) : (sidebarOpen ? 288 : 0),
          x: isMobile ? (sidebarOpen ? 0 : -288) : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`${
          isMobile ? "fixed top-0 left-0 z-40 h-screen" : "relative min-h-screen"
        } border-r border-white/[0.08] glass-dark flex flex-col overflow-hidden shrink-0`}
        data-testid="sidebar"
      >
        {/* Header with Logo AND Toggle Button */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-white/[0.08] shrink-0 w-72">
          <div className="flex items-center gap-3 flex-1">
            <img
              src="/zenbot.png"
              alt="ZenBot Logo"
              className="h-10 w-10 rounded-xl object-cover"
            />
            <div className="leading-tight min-w-0">
              <div className="font-display font-bold text-base tracking-tight">ZenBot</div>
              <div className="text-[8px] text-white/40 uppercase tracking-[0.22em]">Assistant</div>
            </div>
          </div>

          {/* Toggle Button - INSIDE SIDEBAR HEADER */}
          {!isMobile && (
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition text-white/60 hover:text-[#FF6B5B] ml-2 shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              data-testid="sidebar-toggle"
              title="Collapse Sidebar"
            >
              <ChevronsLeft className="h-5 w-5" />
            </motion.button>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
            <motion.button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition text-white/60 hover:text-white ml-2 shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-3 space-y-1 overflow-hidden w-72">
          <NavSection items={employeeNav} />
          {(role === "hr" || role === "admin") && <NavSection title="HR" items={hrNav} />}
          {role === "admin" && <NavSection title="Admin" items={adminNav} />}
          <NavSection title="Account" items={accountNav} />
        </div>

        {/* User Profile - Sticky at Bottom */}
        <div className="border-t border-white/[0.08] p-4 shrink-0 w-72">
          <NavLink
            to="/app/profile"
            data-testid="sidebar-profile-link"
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/[0.05] transition-colors group"
          >
            <Avatar className="h-10 w-10 ring-1 ring-white/10">
              <AvatarFallback className="bg-gradient-to-br from-[#1A1A6B] to-[#FF6B5B] text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate">
                {profile?.full_name || profile?.email || "User"}
              </div>
              <Badge className="h-5 mt-1 px-2 text-[8px] uppercase tracking-wider bg-white/[0.08] text-white/70 border-0 w-fit">
                {role}
              </Badge>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => { e.preventDefault(); handleSignOut(); }}
              data-testid="sidebar-signout-btn"
              className="h-9 w-9 text-white/50 hover:text-[#FF6B5B] hover:bg-white/10 transition shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </NavLink>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-20 h-20 flex items-center justify-between px-6 lg:px-10 border-b border-white/[0.08] glass-dark">
          {/* Left Side - Sidebar Open Button (shows when sidebar is collapsed) */}
          <div className="flex items-center gap-4">
            {!isMobile && !sidebarOpen && (
              <motion.button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition text-white/60 hover:text-[#FF6B5B]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                data-testid="sidebar-open-button"
                title="Open Sidebar"
              >
                <Menu className="h-5 w-5" />
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.button
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 hover:bg-white/10 rounded-lg transition text-white/60 hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="mobile-menu-toggle"
              >
                <Menu className="h-5 w-5" />
              </motion.button>
            )}

            {/* Search Bar */}
            <div className="flex items-center gap-3 flex-1 ml-4">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white/50 cursor-pointer hover:text-white/80 transition flex-1">
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search anything</span>
                <kbd className="text-[9px] font-mono ml-auto px-2 py-1 rounded bg-white/5 text-white/40 hidden lg:inline">⌘K</kbd>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Badges & Notifications */}
          <div className="flex items-center gap-3 ml-auto">
            <Badge className="bg-white/[0.05] text-white/70 border border-white/[0.08] hidden sm:inline-flex text-xs px-3 py-1.5 font-medium" data-testid="topbar-region-badge">
              <Globe2 className="h-3.5 w-3.5 mr-2" />
              {profile?.region_id ? "Region set" : "No region"}
            </Badge>
            <motion.button
              onClick={() => navigate("/app/notifications")}
              className="relative p-2.5 hover:bg-white/10 rounded-lg transition text-white/60 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="topbar-notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FF6B5B] animate-pulse" />
            </motion.button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 sm:px-8 lg:px-10 py-8 relative z-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;