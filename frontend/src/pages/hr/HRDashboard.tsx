import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TicketCheck, Clock, AlertTriangle, CheckCircle2, MessageSquareWarning } from "lucide-react";

const KPIs = [
  { label: "Open tickets", value: "12", icon: TicketCheck, color: "from-[#FF6B5B] to-[#E11D2C]" },
  { label: "Overdue (SLA)", value: "3", icon: AlertTriangle, color: "from-rose-500 to-red-600" },
  { label: "Avg response", value: "2.4h", icon: Clock, color: "from-[#1A1A6B] to-[#0F0F4A]" },
  { label: "Resolved (7d)", value: "47", icon: CheckCircle2, color: "from-emerald-500 to-emerald-700" },
];

const TOP_Q = [
  { q: "How to apply for parental leave?", count: 18 },
  { q: "Q1 payroll calendar dates", count: 14 },
  { q: "WFH policy 2026 changes", count: 11 },
  { q: "Insurance claim for dependents", count: 9 },
];

const HRDashboard: React.FC = () => (
  <div data-testid="hr-dashboard">
    <PageHeader eyebrow="HR · region-scoped" title="HR Dashboard" subtitle="A pulse on your region's HR conversations." />
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {KPIs.map((k) => (
        <div key={k.label} className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-5" data-testid={`hr-kpi-${k.label}`}>
          <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${k.color} grid place-items-center mb-4`}>
            <k.icon className="h-4 w-4 text-white" />
          </div>
          <div className="text-3xl font-display font-extrabold">{k.value}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider mt-1">{k.label}</div>
        </div>
      ))}
    </div>

    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">
          <MessageSquareWarning className="h-4 w-4 text-[#FF6B5B]" /> Top unanswered questions
        </h3>
        <div className="space-y-3">
          {TOP_Q.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5" data-testid={`hr-topq-${i}`}>
              <div className="h-7 w-7 rounded-lg bg-[#FF6B5B]/15 text-[#FF6B5B] grid place-items-center text-xs font-bold">{i + 1}</div>
              <div className="flex-1 text-sm">{t.q}</div>
              <span className="text-xs text-white/40">{t.count}x</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
        <h3 className="font-display font-bold mb-4">Region filter</h3>
        <div className="text-sm text-white/60 mb-3">Your region (region-scoped)</div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="font-display text-2xl font-bold">India</div>
          <div className="text-xs text-white/50 mt-1">+ Global policies</div>
        </div>
      </div>
    </div>
  </div>
);

export default HRDashboard;
