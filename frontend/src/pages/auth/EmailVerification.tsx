import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, MailCheck, Loader2 } from "lucide-react";
import AuthShell from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const EmailVerification: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const [status, setStatus] = useState<"pending" | "verified">("pending");

  useEffect(() => {
    // supabase auto-detects session in URL hash; if verified we'll have a session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus("verified");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        setStatus("verified");
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthShell
      title={status === "verified" ? "Email verified" : "Verify your email"}
      subtitle={
        status === "verified"
          ? "Your account is active. Welcome on board."
          : "We're confirming your email. If you opened this link from your inbox, you're seconds away."
      }
    >
      <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-6 flex items-start gap-4" data-testid="verify-card">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shrink-0">
          {status === "verified" ? (
            <CheckCircle2 className="h-5 w-5 text-white" />
          ) : (
            <MailCheck className="h-5 w-5 text-white" />
          )}
        </div>
        <p className="text-sm text-zinc-700 leading-relaxed">
          {status === "verified"
            ? "Your email is verified and your account is ready."
            : "Click the verification link in your inbox. This page will update automatically."}
        </p>
      </div>

      {status === "verified" ? (
        <Link to="/app/dashboard">
          <Button
            className="w-full h-11 mt-6 rounded-xl bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110 transition-all shadow-lg shadow-[#FF6B5B]/20 font-semibold"
            data-testid="verify-go-app"
          >
            Open dashboard
          </Button>
        </Link>
      ) : (
        <div className="flex items-center gap-2 mt-6 text-zinc-500 text-sm" data-testid="verify-waiting">
          <Loader2 className="h-4 w-4 animate-spin" /> Waiting for verification…
        </div>
      )}

      <div className="mt-8 text-sm text-zinc-500">
        <Link to="/sign-in" className="text-[#1A1A6B] font-semibold hover:underline" data-testid="link-back-signin">
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  );
};

export default EmailVerification;
