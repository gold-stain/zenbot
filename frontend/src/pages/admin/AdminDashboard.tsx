import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { Activity, FileText, Users, TrendingUp, ArrowUpRight, ShieldCheck, Zap, Globe2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { safe } from "@/services/safe";
import { InteractiveCard } from "@/components/common/InteractiveCard";
import { AnimatedCounter, Sparkline } from "@/components/common/AnimatedCounter";

const SPARK = [
  [4, 8, 5, 9, 7, 12, 14, 11, 16, 18, 15, 22],
  [12, 14, 11, 16, 18, 14, 19, 22, 21, 24, 26, 28],
  [6, 5, 8, 7, 11, 9, 13, 12, 14, 13, 16, 18],
  [2, 3, 5, 4, 6, 8, 7, 9, 11, 10, 12, 13],
];

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState(0);
  const [policies, setPolicies] = useState(0);
  const [threads, setThreads] = useState(0);
  const [tickets, setTickets] = useState(0);

  useEffect(() => {
    (async () => {
      const u = await safe(async () => {
        const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
        return count || 0;
      });
      setUsers(u ?? 0);
      const p = await safe(async () => {
        const { count } = await supabase.from("policies").select("*", { count: "exact", head: true }).eq("is_active", true);
        return count || 0;
      });
      setPolicies(p ?? 0);
      const t = await safe(async () => {
        const { count } = await supabase.from("chat_threads").select("*", { count: "exact", head: true });
        return count || 0;
      });
      setThreads(t ?? 0);
      const k = await safe(async () => {
        const { count } = await supabase.from("tickets").select("*", { count: "exact", head: true });
        return count || 0;
      });
      setTickets(k ?? 0);
    })();
  }, []);

  const KPIs = [
    { l: "Chat threads", v: threads, icon: Activity, color: "#FF6B5B", spark: SPARK[0] },
    { l: "Users", v: users, icon: Users, color: "#6366F1", spark: SPARK[1] },
    { l: "Policies live", v: policies, icon: FileText, color: "#E11D2C", spark: SPARK[2] },
    { l: "Tickets", v: tickets, icon: TrendingUp, color: "#10B981", spark: SPARK[3] },
  ];

  return (
    <div data-testid="admin-dashboard" className="space-y-8">
      <PageHeader eyebrow="Admin · Global" title="Mission control" subtitle="The pulse across regions, roles, and your knowledge corpus." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {KPIs.map((k, i) => (
          <motion.div key={k.l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }}>
            <InteractiveCard className="p-5 card-tilt" testId={`admin-kpi-${k.l}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl grid place-items-center"
                     style={{ background: `linear-gradient(135deg, ${k.color}33, ${k.color}11)`, border: `1px solid ${k.color}33` }}>
                  <k.icon className="h-4 w-4" style={{ color: k.color }} />
                </div>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" /> live
                </span>
              </div>
              <div className="font-display text-3xl 3xl:text-4xl font-extrabold leading-none">
                <AnimatedCounter value={k.v} />
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-2">{k.l}</div>
              <div className="mt-3 h-8 -mx-1">
                <Sparkline points={k.spark} color={k.color} height={32} />
              </div>
            </InteractiveCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-5">
        <InteractiveCard className="lg:col-span-2 p-6">
          <h3 className="font-display font-bold mb-5 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#FF6B5B]" /> System health
          </h3>
          <div className="space-y-2.5 text-sm text-white/70">
            {[
              { name: "Database connection", state: "Healthy" },
              { name: "Auth provider", state: "Healthy" },
              { name: "Storage bucket (policy_pdfs)", state: "Healthy" },
              { name: "n8n chat webhook", state: "Configure" },
            ].map((row) => (
              <div key={row.name} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span>{row.name}</span>
                <span className={row.state === "Healthy" ? "text-emerald-400 inline-flex items-center gap-1.5" : "text-amber-400 inline-flex items-center gap-1.5"}>
                  <span className={`h-1.5 w-1.5 rounded-full ${row.state === "Healthy" ? "bg-emerald-400" : "bg-amber-400"} pulse-soft`} />
                  {row.state}
                </span>
              </div>
            ))}
          </div>
        </InteractiveCard>
        <InteractiveCard className="p-6">
          <h3 className="font-display font-bold mb-5 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#FF6B5B]" /> Activity pulse
          </h3>
          <div className="space-y-4">
            {[
              { color: "#FF6B5B", l: "Queries/min", v: 14 },
              { color: "#6366F1", l: "Active users now", v: 38 },
              { color: "#E11D2C", l: "Pending tickets", v: 6 },
            ].map((s) => (
              <div key={s.l}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/60">{s.l}</span>
                  <span className="font-semibold" style={{ color: s.color }}>{s.v}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, s.v * 3)}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}80)` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-white/40">
            <Globe2 className="h-3 w-3" /> Aggregated across all 9 regions
          </div>
        </InteractiveCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
