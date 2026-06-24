import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Download, TrendingUp, TrendingDown, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Analytics: React.FC = () => (
  <div data-testid="analytics-page">
    <PageHeader
      eyebrow="Insights"
      title="Analytics & reports"
      subtitle="Usage, satisfaction, and content performance."
      actions={
        <Button variant="ghost" className="text-white/80 hover:bg-white/5" data-testid="analytics-export">
          <Download className="h-4 w-4 mr-1.5" /> Export CSV
        </Button>
      }
    />
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {[
        { l: "Queries (30d)", v: "62,138", t: "up" },
        { l: "Avg response", v: "1.6s", t: "down" },
        { l: "👍 / 👎 ratio", v: "94 / 6", t: "up" },
        { l: "Downloads", v: "8,041", t: "up" },
      ].map((k) => (
        <div key={k.l} className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-5" data-testid={`analytics-kpi-${k.l}`}>
          <div className="text-3xl font-display font-extrabold">{k.v}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider mt-1 flex items-center gap-1.5">
            {k.t === "up" ? <TrendingUp className="h-3 w-3 text-emerald-400" /> : <TrendingDown className="h-3 w-3 text-emerald-400" />}
            {k.l}
          </div>
        </div>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-5">
      <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
        <h3 className="font-display font-bold mb-4">Top 10 questions</h3>
        <div className="space-y-2">
          {[
            "How to apply for leave?",
            "WFH eligibility 2026",
            "Q1 payroll calendar",
            "Parental leave India",
            "Stock options taxation",
            "Travel reimbursement caps",
            "Insurance dependents",
            "Relocation policy",
            "Sick leave carry-over",
            "Tuition reimbursement",
          ].map((q, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="h-6 w-6 rounded-md bg-[#FF6B5B]/15 text-[#FF6B5B] grid place-items-center text-[10px] font-bold">{i + 1}</div>
              <div className="flex-1 text-sm">{q}</div>
              <div className="h-1.5 w-24 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C]" style={{ width: `${100 - i * 8}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
          <h3 className="font-display font-bold mb-4">Satisfaction</h3>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <ThumbsUp className="h-8 w-8 text-emerald-400 mx-auto mb-1" />
              <div className="text-3xl font-display font-extrabold">94%</div>
              <div className="text-xs text-white/50">positive</div>
            </div>
            <div className="text-center">
              <ThumbsDown className="h-8 w-8 text-rose-400 mx-auto mb-1" />
              <div className="text-3xl font-display font-extrabold">6%</div>
              <div className="text-xs text-white/50">negative</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
          <h3 className="font-display font-bold mb-4">Region heatmap</h3>
          <div className="grid grid-cols-3 gap-2">
            {["IN", "US", "UK", "ZA", "AT", "SG", "CA", "IE", "GL"].map((r, i) => (
              <div key={r} className="aspect-square rounded-xl grid place-items-center font-display font-bold text-white" style={{ backgroundColor: `rgba(255,107,91,${0.15 + i * 0.08})` }}>
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Analytics;
