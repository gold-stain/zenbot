import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const FLOWS = [
  { name: "POST /chat",          status: "healthy", latency: "412ms", last: "12s ago", desc: "User query → AI answer" },
  { name: "POST /embed-policy",  status: "healthy", latency: "1.8s",  last: "2m ago",  desc: "Doc upload → chunks → embeddings → pgvector" },
  { name: "POST /escalate",      status: "healthy", latency: "320ms", last: "5m ago",  desc: "Ticket created → regional HR email" },
  { name: "POST /reindex",       status: "warning", latency: "—",     last: "2h ago",  desc: "Admin manual re-index (no run today)" },
];

const N8nStatus: React.FC = () => (
  <div data-testid="n8n-status-page">
    <PageHeader
      eyebrow="Pipelines"
      title="n8n workflow status"
      subtitle="Health of the AI pipeline that powers the assistant."
      actions={
        <Button variant="ghost" className="text-white/80 hover:bg-white/5" data-testid="n8n-refresh">
          <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
        </Button>
      }
    />
    <div className="grid sm:grid-cols-2 gap-4">
      {FLOWS.map((f) => (
        <div key={f.name} className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-5" data-testid={`n8n-flow-${f.name}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-sm text-white/90">{f.name}</span>
            {f.status === "healthy" ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Healthy
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
                <AlertTriangle className="h-4 w-4" /> Idle
              </span>
            )}
          </div>
          <div className="text-sm text-white/60 mb-4">{f.desc}</div>
          <div className="flex items-center gap-4 text-[11px] text-white/40">
            <span>Latency · <span className="text-white/70 font-mono">{f.latency}</span></span>
            <span>Last run · <span className="text-white/70">{f.last}</span></span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default N8nStatus;
