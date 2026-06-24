import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import AuthShell from "@/components/layout/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const ForgotPassword: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err: any) {
      toast.error(err?.message || "Could not send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={sent ? "Email sent" : "Forgot password?"}
      subtitle={
        sent
          ? "Check your inbox for a reset link."
          : "Enter your email and we'll send a reset link."
      }
      footer={
        <Link to="/sign-in" className="text-[#1A1A6B] font-semibold hover:underline" data-testid="link-back-signin">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-6 flex items-start gap-4" data-testid="forgot-sent">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shrink-0">
            <MailCheck className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm text-zinc-700 leading-relaxed">
            If <span className="font-semibold">{email}</span> exists in our system, a password reset link has been sent.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5" data-testid="forgot-form">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="forgot-email-input"
              placeholder="you@zensar.com"
              className="h-11 rounded-xl"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            data-testid="forgot-submit-btn"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110 transition-all shadow-lg shadow-[#FF6B5B]/20 font-semibold"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
