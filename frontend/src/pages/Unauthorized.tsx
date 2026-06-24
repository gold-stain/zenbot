import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const Unauthorized: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  return (
    <div className="min-h-screen bg-white grid place-items-center p-6" data-testid="unauthorized-page">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center mb-6 shadow-lg shadow-[#FF6B5B]/30">
          <ShieldAlert className="h-7 w-7 text-white" />
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight mb-2">Access restricted</h1>
        <p className="text-zinc-600 mb-6">
          Your role doesn't grant access to this area. If you think this is a mistake, contact an Admin.
        </p>
        <Link to="/app/dashboard">
          <Button className="rounded-full px-6 bg-[#1A1A6B] hover:bg-[#0F0F4A] text-white" data-testid="unauthorized-back">
            Back to dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
