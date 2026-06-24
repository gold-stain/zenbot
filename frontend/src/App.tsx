import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "@/pages/public/LandingPage";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import EmailVerification from "@/pages/auth/EmailVerification";

import AppShell from "@/components/layout/AppShell";
import Dashboard from "@/pages/employee/Dashboard";
import Chat from "@/pages/employee/Chat";
import ChatHistory from "@/pages/employee/ChatHistory";
import PolicyLibrary from "@/pages/employee/PolicyLibrary";
import MyTickets from "@/pages/employee/MyTickets";
import Notifications from "@/pages/employee/Notifications";
import Profile from "@/pages/employee/Profile";
import Settings from "@/pages/employee/Settings";
import Help from "@/pages/employee/Help";

import HRDashboard from "@/pages/hr/HRDashboard";
import TicketQueue from "@/pages/hr/TicketQueue";
import TicketDetail from "@/pages/hr/TicketDetail";
import KnowledgeGaps from "@/pages/hr/KnowledgeGaps";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import PolicyManager from "@/pages/admin/PolicyManager";
import PolicyUploadWizard from "@/pages/admin/PolicyUploadWizard";
import RegionPortalManager from "@/pages/admin/RegionPortalManager";
import UserManagement from "@/pages/admin/UserManagement";
import RolePermissions from "@/pages/admin/RolePermissions";
import Analytics from "@/pages/admin/Analytics";
import AuditLogs from "@/pages/admin/AuditLogs";
import N8nStatus from "@/pages/admin/N8nStatus";
import SystemSettings from "@/pages/admin/SystemSettings";

import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";

import { RequireAuth } from "@/routes/RequireAuth";
import { RequireRole } from "@/routes/RequireRole";

const App: React.FC = () => {
  // Default to dark theme on app shell; public/auth pages override per-page
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Authenticated (any role) */}
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/chat" element={<Chat />} />
          <Route path="/app/chat/:threadId" element={<Chat />} />
          <Route path="/app/history" element={<ChatHistory />} />
          <Route path="/app/policies" element={<PolicyLibrary />} />
          <Route path="/app/tickets" element={<MyTickets />} />
          <Route path="/app/notifications" element={<Notifications />} />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="/app/settings" element={<Settings />} />
          <Route path="/app/help" element={<Help />} />

          {/* HR */}
          <Route element={<RequireRole allowedRoles={["hr", "admin"]} />}>
            <Route path="/app/hr" element={<HRDashboard />} />
            <Route path="/app/hr/queue" element={<TicketQueue />} />
            <Route path="/app/hr/tickets/:id" element={<TicketDetail />} />
            <Route path="/app/hr/gaps" element={<KnowledgeGaps />} />
          </Route>

          {/* Admin */}
          <Route element={<RequireRole allowedRoles={["admin"]} />}>
            <Route path="/app/admin" element={<AdminDashboard />} />
            <Route path="/app/admin/policies" element={<PolicyManager />} />
            <Route path="/app/admin/policies/upload" element={<PolicyUploadWizard />} />
            <Route path="/app/admin/regions" element={<RegionPortalManager />} />
            <Route path="/app/admin/users" element={<UserManagement />} />
            <Route path="/app/admin/roles" element={<RolePermissions />} />
            <Route path="/app/admin/analytics" element={<Analytics />} />
            <Route path="/app/admin/audit" element={<AuditLogs />} />
            <Route path="/app/admin/n8n" element={<N8nStatus />} />
            <Route path="/app/admin/system" element={<SystemSettings />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
