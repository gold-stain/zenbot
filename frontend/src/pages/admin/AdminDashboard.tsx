import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Activity, FileText, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { safe } from "@/services/safe";

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
    { l: "Chat threads", v: String(threads), up: "live", icon: Activity, color: "from-[#FF6B5B] to-[#E11D2C]" },
    { l: "Users", v: String(users), up: "live", icon: Users, color: "from-[#1A1A6B] to-[#0F0F4A]" },
    { l: "Policies live", v: String(policies), up: "live", icon: FileText, color: "from-[#0F0F4A] to-[#E11D2C]" },
    { l: "Tickets", v: String(tickets), up: "live", icon: TrendingUp, color: "from-emerald-500 to-emerald-700" },
  ];

  return (
    <div data-testid="admin-dashboard">
      <PageHeader eyebrow="Admin · Global" title="Mission control" subtitle="The pulse across regions, roles, and your knowledge corpus." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {KPIs.map((k) => (
          <div key={k.l} className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-5" data-testid={`admin-kpi-${k.l}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${k.color} grid place-items-center`}>
                <k.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" /> {k.up}
              </span>
            </div>
            <div className="text-3xl font-display font-extrabold">{k.v}</div>
            <div className="text-xs text-white/50 uppercase tracking-wider mt-1">{k.l}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
          <h3 className="font-display font-bold mb-4">Status</h3>
          <div className="space-y-3 text-sm text-white/70">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span>Database connection</span>
              <span className="text-emerald-400">● Healthy</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span>Auth provider</span>
              <span className="text-emerald-400">● Healthy</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span>Storage bucket (policy_pdfs)</span>
              <span className="text-emerald-400">● Healthy</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span>n8n chat webhook</span>
              <span className="text-amber-400">● Configure</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
          <h3 className="font-display font-bold mb-4">Quick links</h3>
          <div className="text-sm text-white/60 space-y-2">
            <div>Policies → Upload Wizard</div>
            <div>Users → Roles</div>
            <div>System → n8n webhook</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
