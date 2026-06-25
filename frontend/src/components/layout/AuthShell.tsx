import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

const AuthShell: React.FC<AuthShellProps> = ({
  children,
  title,
  subtitle,
  footer,
}) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-[#050514] text-white grain">
        <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-[#1A1A6B]/40 blur-3xl animate-blob-drift" />
        <div className="absolute -bottom-32 -right-32 h-[24rem] w-[24rem] rounded-full bg-[#FF6B5B]/20 blur-3xl animate-blob-drift" />

        <Link
          to="/"
          className="relative z-10 flex items-center gap-2"
          data-testid="auth-logo"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shadow-lg shadow-[#FF6B5B]/40">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-display text-lg font-extrabold tracking-tight">
              ZenBot
            </div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/50">
              Employee Assistant
            </div>
          </div>
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="font-display text-4xl xl:text-5xl font-extrabold leading-[1.05] tracking-tight">
            Every policy.
            <br />
            <span className="text-gradient-coral">Every region.</span>
            <br />
            One assistant.
          </h2>
          <p className="text-white/60 max-w-md text-base leading-relaxed">
            Region-aware answers, sourced from your own HR corpus. Talk to it.
            Type to it. Escalate when you need a human.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <div>
              <div className="text-2xl font-display font-bold text-white">9</div>
              <div className="uppercase tracking-wider">Regions</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-2xl font-display font-bold text-white">3</div>
              <div className="uppercase tracking-wider">Roles</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-2xl font-display font-bold text-white">∞</div>
              <div className="uppercase tracking-wider">Conversations</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/30">
          Secured by Supabase · RLS · Region-scoped data
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-col px-6 sm:px-12 py-10">
        <div className="lg:hidden mb-8">
          <Link to="/" className="flex items-center gap-2" data-testid="auth-logo-mobile">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="font-display font-extrabold">ZenBot</div>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-zinc-500 text-base mb-8">{subtitle}</p>
            )}
            {children}
          </div>
        </div>

        {footer && (
          <div className="max-w-md w-full mx-auto mt-8 text-sm text-zinc-500">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthShell;
