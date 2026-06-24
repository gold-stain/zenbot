import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { TicketCheck, Clock, AlertTriangle, CheckCircle2, MessageSquareWarning, Globe2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listRegionTickets, listKnowledgeGaps } from "@/services/db";
import { safe } from "@/services/safe";
import { InteractiveCard } from "@/components/common/InteractiveCard";
import { AnimatedCounter, Sparkline } from "@/components/common/AnimatedCounter";

interface Ticket { id: string; status: string; created_at: string; updated_at: string; }
interface Gap { id: string; question: string; occurrences: number; }

const SPARK = [
  [2, 4, 3, 6, 5, 8, 7, 10, 9, 12],
  [0, 1, 0, 2, 1, 3, 2, 1, 0, 1],
  [3, 4, 4, 5, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 5, 4, 6, 7, 9, 12, 14],
];

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
    { label: "Open tickets", value: open, icon: TicketCheck, color: "#FF6B5B", spark: SPARK[0] },
    { label: "Overdue", value: overdue, icon: AlertTriangle, color: "#E11D2C", spark: SPARK[1] },
    { label: "Avg response", value: 0, icon: Clock, color: "#6366F1", spark: SPARK[2], suffix: "h" },
    { label: "Resolved (7d)", value: resolved7d, icon: CheckCircle2, color: "#10B981", spark: SPARK[3] },
  ];

  return (
    <div data-testid="hr-dashboard" className="space-y-8">
      <PageHeader eyebrow="HR · region-scoped" title="HR Dashboard" subtitle="A pulse on your region's HR conversations." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {KPIs.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }}>
            <InteractiveCard className="p-5 card-tilt" testId={`hr-kpi-${k.label}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl grid place-items-center"
                     style={{ background: `linear-gradient(135deg, ${k.color}33, ${k.color}11)`, border: `1px solid ${k.color}33` }}>
                  <k.icon className="h-4 w-4" style={{ color: k.color }} />
                </div>
              </div>
              <div className="font-display text-3xl 3xl:text-4xl font-extrabold leading-none">
                <AnimatedCounter value={k.value} suffix={k.suffix || ""} />
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-2">{k.label}</div>
              <div className="mt-3 h-8 -mx-1">
                <Sparkline points={k.spark} color={k.color} height={32} />
              </div>
            </InteractiveCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-5">
        <InteractiveCard className="lg:col-span-2 p-6">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <MessageSquareWarning className="h-4 w-4 text-[#FF6B5B]" /> Top unanswered questions
          </h3>
          {gaps.length === 0 ? (
            <div className="text-sm text-white/50 py-10 text-center border-2 border-dashed border-white/5 rounded-xl">No knowledge gaps yet.</div>
          ) : (
            <div className="space-y-2">
              {gaps.slice(0, 5).map((t, i) => (
                <div key={t.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]" data-testid={`hr-topq-${i}`}>
                  <div className="h-7 w-7 rounded-lg bg-[#FF6B5B]/15 text-[#FF6B5B] grid place-items-center text-xs font-bold">{i + 1}</div>
                  <div className="flex-1 text-sm">{t.question}</div>
                  <span className="text-xs text-white/40 font-mono">{t.occurrences}×</span>
                </div>
              ))}
            </div>
          )}
        </InteractiveCard>
        <InteractiveCard className="p-6">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-[#FF6B5B]" /> Region scope
          </h3>
          <div className="text-sm text-white/60 mb-3">{role === "admin" ? "All regions" : "Your region"}</div>
          <div className="rounded-xl bg-gradient-to-br from-[#FF6B5B]/15 via-[#6366F1]/10 to-transparent border border-white/10 p-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#FF6B5B]/20 blur-2xl" />
            <div className="relative z-10">
              <div className="font-display text-3xl font-extrabold">{role === "admin" ? "Global" : "Region-locked"}</div>
              <div className="text-xs text-white/50 mt-1">+ Global policies always available</div>
            </div>
          </div>
        </InteractiveCard>
      </div>
    </div>
  );
};

export default HRDashboard;
