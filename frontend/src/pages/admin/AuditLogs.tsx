import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { listAuditLogs } from "@/services/db";
import { safe } from "@/services/safe";

interface AuditRow {
  id: string;
  actor_id?: string | null;
  action: string;
  entity_type?: string;
  entity_id?: string;
  created_at: string;
}

const AuditLogs: React.FC = () => {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await safe(() => listAuditLogs());
      setRows((data as AuditRow[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div data-testid="audit-logs-page">
      <PageHeader eyebrow="Compliance" title="Audit logs" subtitle="Immutable record of admin actions, logins, and pipeline events." />
      {loading ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50" data-testid="audit-empty">
          No audit events yet.
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              <tr className="border-b border-white/5">
                <th className="text-left p-4">Time</th>
                <th className="text-left p-4">Actor</th>
                <th className="text-left p-4">Action</th>
                <th className="text-left p-4 hidden md:table-cell">Entity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-b border-white/5 last:border-0" data-testid={`audit-row-${l.id}`}>
                  <td className="p-4 font-mono text-xs text-white/50">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="p-4 text-white/70 text-xs font-mono">{l.actor_id?.slice(0, 8) || "system"}</td>
                  <td className="p-4">
                    <Badge className="bg-[#FF6B5B]/10 text-[#FF6B5B] border-0 font-mono text-[11px]">{l.action}</Badge>
                  </td>
                  <td className="p-4 hidden md:table-cell text-white/70">
                    {l.entity_type ? `${l.entity_type}/${l.entity_id || "—"}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
