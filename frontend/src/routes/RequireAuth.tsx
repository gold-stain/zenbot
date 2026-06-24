import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const RequireAuth: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[#050514] text-white"
        data-testid="auth-loading"
      >
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#FF6B5B] typing-dot" />
          <span
            className="h-2 w-2 rounded-full bg-[#FF6B5B] typing-dot"
            style={{ animationDelay: "0.2s" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-[#FF6B5B] typing-dot"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  return <Outlet />;
};
