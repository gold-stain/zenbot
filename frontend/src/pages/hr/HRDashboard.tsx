import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TicketCheck, Clock, AlertTriangle, CheckCircle2, MessageSquareWarning } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listRegionTickets, listKnowledgeGaps } from "@/services/db";
import { safe } from "@/services/safe";

interface Ticket { id: string; status: string; created_at: string; updated_at: string; }
interface Gap { id: string; question: string; occurrences: number; }

const HRDashboard: React.FC = () => {
  const { regionId, role } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [gaps, setGaps] = useState<Gap[]>([]);

  useEffect(() => {
    (async () => {
      const t = await safe(() => listRegionTickets(role === "admin" ? null : regionId));
      setTickets((t as Ticket[]) || []);
      const g = await safe(() => listKnowledgeGaps());
      setGaps((g as Gap[]) || []);
    })();
  }, [regionId, role]);

  const open = tickets.filter((t) => t.status === "open").length;
  const overdue = tickets.filter((t) => {
    const ageDays = (Date.now() - new Date(t.created_at).getTime()) / 864e5;
    return t.status !== "resolved" && t.status !== "closed" && ageDays > 2;
  }).length;
  const resolved7d = tickets.filter((t) => {
    const ageDays = (Date.now() - new Date(t.updated_at).getTime()) / 864e5;
    return t.status === "resolved" && ageDays < 7;
  }).length;

  const KPIs = [
    { label: "Open tickets", value: String(open), icon: TicketCheck, color: "from-[#FF6B5B] to-[#E11D2C]" },
    { label: "Overdue (SLA)", value: String(overdue), icon: AlertTriangle, color: "from-rose-500 to-red-600" },
    { label: "Avg response", value: "—", icon: Clock, color: "from-[#1A1A6B] to-[#0F0F4A]" },
    { label: "Resolved (7d)", value: String(resolved7d), icon: CheckCircle2, color: "from-emerald-500 to-emerald-700" },
  ];

  return (
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
          {gaps.length === 0 ? (
            <div className="text-sm text-white/50 py-4">No knowledge gaps yet.</div>
          ) : (
            <div className="space-y-3">
              {gaps.slice(0, 5).map((t, i) => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5" data-testid={`hr-topq-${i}`}>
                  <div className="h-7 w-7 rounded-lg bg-[#FF6B5B]/15 text-[#FF6B5B] grid place-items-center text-xs font-bold">{i + 1}</div>
                  <div className="flex-1 text-sm">{t.question}</div>
                  <span className="text-xs text-white/40">{t.occurrences}×</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
          <h3 className="font-display font-bold mb-4">Region scope</h3>
          <div className="text-sm text-white/60 mb-3">{role === "admin" ? "All regions" : "Your region"}</div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="font-display text-2xl font-bold">{role === "admin" ? "Global" : "Region-locked"}</div>
            <div className="text-xs text-white/50 mt-1">+ Global policies</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
