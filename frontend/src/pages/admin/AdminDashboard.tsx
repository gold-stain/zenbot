import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Activity, FileText, Users, TrendingUp, ArrowUpRight } from "lucide-react";

const KPIs = [
  { l: "Queries today", v: "2,418", up: "+12.4%", icon: Activity, color: "from-[#FF6B5B] to-[#E11D2C]" },
  { l: "Active users", v: "1,063", up: "+3.1%", icon: Users, color: "from-[#1A1A6B] to-[#0F0F4A]" },
  { l: "Policies live", v: "147", up: "+4", icon: FileText, color: "from-[#0F0F4A] to-[#E11D2C]" },
  { l: "Satisfaction", v: "94%", up: "+1.2%", icon: TrendingUp, color: "from-emerald-500 to-emerald-700" },
];

const AdminDashboard: React.FC = () => (
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
        <h3 className="font-display font-bold mb-4">Active users per region</h3>
        <div className="space-y-3">
          {[
            ["India", 482, 100],
            ["USA", 214, 44],
            ["UK", 168, 35],
            ["South Africa", 92, 19],
            ["Ireland", 47, 10],
          ].map(([name, count, pct]) => (
            <div key={name as string} className="flex items-center gap-3">
              <span className="w-32 text-sm">{name}</span>
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-white/50 w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
        <h3 className="font-display font-bold mb-4">Unanswered rate</h3>
        <div className="font-display text-5xl font-extrabold text-gradient-coral mb-2">6.1%</div>
        <div className="text-xs text-white/50">Down from 8.3% last week</div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
