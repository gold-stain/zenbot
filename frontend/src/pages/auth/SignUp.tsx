import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import AuthShell from "@/components/layout/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

const REGIONS = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "GLOBAL", name: "Global", flag: "🌐" },
];

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Data & AI",
  "People & Culture (HR)",
  "Finance",
  "Sales",
  "Marketing",
  "IT Operations",
  "Customer Success",
  "Legal & Compliance",
  "Other",
];

const SignUp: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [regionCode, setRegionCode] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Try to auto-detect region from browser
  useEffect(() => {
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (locale.includes("Kolkata") || locale.includes("Calcutta")) setRegionCode("IN");
      else if (locale.includes("London")) setRegionCode("UK");
      else if (locale.includes("Johannesburg")) setRegionCode("ZA");
      else if (locale.includes("Vienna")) setRegionCode("AT");
      else if (locale.includes("Singapore")) setRegionCode("SG");
      else if (locale.includes("Toronto") || locale.includes("Vancouver")) setRegionCode("CA");
      else if (locale.includes("Dublin")) setRegionCode("IE");
      else if (locale.includes("New_York") || locale.includes("Los_Angeles") || locale.includes("Chicago")) setRegionCode("US");
      else setRegionCode("GLOBAL");
    } catch {
      setRegionCode("GLOBAL");
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regionCode || !department) {
      toast.error("Please choose region and department");
      return;
    }
    setLoading(true);
    try {
      const { needsConfirmation } = await signUp({
        email,
        password,
        fullName,
        employeeId,
        department,
        regionCode,
      });
      if (needsConfirmation) {
        setSent(true);
      } else {
        toast.success("Account created");
        navigate("/app/dashboard", { replace: true });
      }
    } catch (err: any) {
      toast.error(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthShell title="Check your inbox" subtitle="One last step to activate your assistant.">
        <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-6 flex items-start gap-4" data-testid="signup-confirmation">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shrink-0">
            <MailCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold mb-1">Verification email sent</div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              We've sent a confirmation link to <span className="font-medium text-zinc-900">{email}</span>.
              Click it to activate your account and finish signing in.
            </p>
          </div>
        </div>
        <Link to="/sign-in">
          <Button
            className="w-full h-11 mt-6 rounded-xl bg-[#1A1A6B] text-white hover:bg-[#0F0F4A]"
            data-testid="signup-back-to-signin"
          >
            Back to sign in
          </Button>
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes 60 seconds. Your region is auto-detected."
      footer={
        <span>
          Already have an account?{" "}
          <Link to="/sign-in" className="text-[#1A1A6B] font-semibold hover:underline" data-testid="link-signin">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" data-testid="signup-form">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Priya Sharma" data-testid="signup-fullname" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="empId">Employee ID</Label>
            <Input id="empId" required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="ZEN-104382" data-testid="signup-empid" className="h-11 rounded-xl" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@zensar.com" data-testid="signup-email" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={show ? "text" : "password"} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" data-testid="signup-password" className="h-11 rounded-xl pr-10" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700" data-testid="signup-toggle-password">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Region</Label>
            <Select value={regionCode} onValueChange={setRegionCode}>
              <SelectTrigger className="h-11 rounded-xl" data-testid="signup-region-trigger">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.code} value={r.code} data-testid={`signup-region-${r.code}`}>
                    <span className="mr-2">{r.flag}</span>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="h-11 rounded-xl" data-testid="signup-dept-trigger">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          By creating an account, you agree to be region-scoped per Zensar's data policy.
        </p>

        <Button
          type="submit"
          disabled={loading}
          data-testid="signup-submit-btn"
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110 transition-all shadow-lg shadow-[#FF6B5B]/20 font-semibold"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default SignUp;
