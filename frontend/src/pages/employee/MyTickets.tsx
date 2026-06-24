import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock } from "lucide-react";

const MOCK = [
  { code: "TKT-2A4B91C2", subject: "Relocation reimbursement — Pune to Bengaluru", status: "open" as const, prio: "high" as const, age: "1h" },
  { code: "TKT-9F03D11A", subject: "Clarify parental leave eligibility", status: "in_progress" as const, prio: "medium" as const, age: "2d" },
  { code: "TKT-71B40C99", subject: "Q4 payslip missing one line item", status: "resolved" as const, prio: "low" as const, age: "1w" },
];

const STATUS: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-[#FF6B5B]/15 text-[#FF6B5B]" },
  in_progress: { label: "In progress", color: "bg-amber-500/15 text-amber-400" },
  awaiting_employee: { label: "Awaiting you", color: "bg-purple-500/15 text-purple-300" },
  resolved: { label: "Resolved", color: "bg-emerald-500/15 text-emerald-400" },
  closed: { label: "Closed", color: "bg-white/10 text-white/50" },
};

const MyTickets: React.FC = () => (
  <div data-testid="my-tickets-page">
    <PageHeader
      eyebrow="Support"
      title="My tickets"
      subtitle="Track every HR escalation you've raised."
    />
    <div className="space-y-3">
      {MOCK.map((t) => (
        <div
          key={t.code}
          data-testid={`ticket-card-${t.code}`}
          className="group rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-5 hover:border-white/15 transition-all flex items-center gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="font-mono text-[11px] text-white/40">{t.code}</span>
              <Badge className={`${STATUS[t.status].color} border-0 text-[10px] uppercase tracking-wider`}>
                {STATUS[t.status].label}
              </Badge>
              {t.prio === "high" && (
                <Badge className="bg-rose-500/15 text-rose-400 border-0 text-[10px] uppercase tracking-wider">
                  High priority
                </Badge>
              )}
            </div>
            <div className="font-medium text-base truncate">{t.subject}</div>
            <div className="text-[11px] text-white/40 flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" /> Opened {t.age} ago
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-[#FF6B5B] group-hover:translate-x-1 transition-all" />
        </div>
      ))}
    </div>
  </div>
);

export default MyTickets;
