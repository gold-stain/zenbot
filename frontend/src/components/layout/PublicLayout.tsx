import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicLayoutProps {
  children: React.ReactNode;
  showAuthButtons?: boolean;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  showAuthButtons = true,
}) => {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2"
            data-testid="public-logo"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#1A1A6B] via-[#E11D2C] to-[#FF6B5B] grid place-items-center shadow-lg shadow-[#FF6B5B]/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-extrabold tracking-tight">
                Zensar AI
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Employee Assistant
              </div>
            </div>
          </Link>
          {showAuthButtons && (
            <div className="flex items-center gap-2">
              <Link to="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="header-signin-btn"
                  className="text-zinc-700 hover:text-[#1A1A6B] hover:bg-zinc-50"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button
                  size="sm"
                  data-testid="header-signup-btn"
                  className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110 transition-all shadow-md shadow-[#FF6B5B]/30 rounded-full px-5"
                >
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-zinc-100 bg-zinc-50/50 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-500">
          <div>© {new Date().getFullYear()} Zensar AI Employee Assistant</div>
          <div className="flex items-center gap-5">
            <Link to="/help" className="hover:text-[#1A1A6B]">Help</Link>
            <span className="opacity-30">·</span>
            <span>Region-aware · Voice-enabled · Built for HR</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
