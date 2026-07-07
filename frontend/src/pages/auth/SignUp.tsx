import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, MailCheck, MapPin } from "lucide-react";
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
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "ZA", name: "South Africa" },
  { code: "AT", name: "Austria" },
  { code: "SG", name: "Singapore" },
  { code: "CA", name: "Canada" },
  { code: "IE", name: "Ireland" },
  { code: "GLOBAL", name: "Global" },
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

function detectRegionCode() {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (timeZone.includes("Kolkata") || timeZone.includes("Calcutta")) return "IN";
    if (timeZone.includes("London")) return "UK";
    if (timeZone.includes("Johannesburg")) return "ZA";
    if (timeZone.includes("Vienna")) return "AT";
    if (timeZone.includes("Singapore")) return "SG";
    if (timeZone.includes("Toronto") || timeZone.includes("Vancouver")) return "CA";
    if (timeZone.includes("Dublin")) return "IE";
    if (
      timeZone.includes("New_York") ||
      timeZone.includes("Los_Angeles") ||
      timeZone.includes("Chicago")
    ) {
      return "US";
    }
    return "GLOBAL";
  } catch {
    return "GLOBAL";
  }
}

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

  useEffect(() => {
    setRegionCode(detectRegionCode());
  }, []);

  const detectedRegion = REGIONS.find((region) => region.code === regionCode);

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
            <div
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 flex items-center justify-between text-sm"
              data-testid="signup-region-locked"
            >
              <span className="flex items-center gap-2 text-zinc-800">
                <MapPin className="h-4 w-4 text-[#FF6B5B]" />
                {detectedRegion ? `${detectedRegion.code} - ${detectedRegion.name}` : "Detecting region"}
              </span>
              <Lock className="h-4 w-4 text-zinc-400" />
            </div>
            <p className="text-[11px] text-zinc-500">
              Auto-detected for policy routing. Admins manage region changes.
            </p>
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
