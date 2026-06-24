import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";

const LOGS = [
  { t: "10:42", actor: "megan.l@zensar.com", action: "policy.upload", entity: "India-Leave-v3.2.pdf", ip: "10.0.4.21" },
  { t: "10:31", actor: "james.c@zensar.com", action: "ticket.resolve", entity: "TKT-71B40C99", ip: "10.0.6.88" },
  { t: "09:58", actor: "system",              action: "n8n.reindex",   entity: "policies/global",  ip: "n8n" },
  { t: "09:20", actor: "priya.s@zensar.com", action: "auth.login",     entity: "—",                ip: "10.0.4.55" },
  { t: "08:11", actor: "megan.l@zensar.com", action: "user.role_change", entity: "sipho.n -> hr", ip: "10.0.4.21" },
];

const AuditLogs: React.FC = () => (
  <div data-testid="audit-logs-page">
    <PageHeader eyebrow="Compliance" title="Audit logs" subtitle="Immutable record of admin actions, logins, and pipeline events." />
    <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="text-[10px] uppercase tracking-[0.18em] text-white/40">
          <tr className="border-b border-white/5">
            <th className="text-left p-4">Time</th>
            <th className="text-left p-4">Actor</th>
            <th className="text-left p-4">Action</th>
            <th className="text-left p-4 hidden md:table-cell">Entity</th>
            <th className="text-left p-4 hidden lg:table-cell">IP</th>
          </tr>
        </thead>
        <tbody>
          {LOGS.map((l, i) => (
            <tr key={i} className="border-b border-white/5 last:border-0" data-testid={`audit-row-${i}`}>
              <td className="p-4 font-mono text-xs text-white/50">{l.t}</td>
              <td className="p-4">{l.actor}</td>
              <td className="p-4">
                <Badge className="bg-[#FF6B5B]/10 text-[#FF6B5B] border-0 font-mono text-[11px]">{l.action}</Badge>
              </td>
              <td className="p-4 hidden md:table-cell text-white/70">{l.entity}</td>
              <td className="p-4 hidden lg:table-cell font-mono text-xs text-white/40">{l.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AuditLogs;
