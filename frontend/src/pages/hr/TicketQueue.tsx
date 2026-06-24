import React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, AlertCircle } from "lucide-react";

const MOCK = [
  { id: "TKT-2A4B91C2", subject: "Relocation reimbursement — Pune to Bengaluru", by: "Priya S.", status: "open", prio: "high", age: "1h", overdue: false },
  { id: "TKT-9F03D11A", subject: "Parental leave eligibility", by: "Rahul M.", status: "in_progress", prio: "medium", age: "2d", overdue: true },
  { id: "TKT-8B12CC55", subject: "Issue with insurance claim portal", by: "Aarti P.", status: "awaiting_employee", prio: "medium", age: "3d", overdue: false },
];

const TicketQueue: React.FC = () => (
  <div data-testid="hr-queue-page">
    <PageHeader eyebrow="Queue" title="Ticket queue" subtitle="All escalated tickets in your region. Assign, respond, close." />
    <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="text-[10px] uppercase tracking-[0.18em] text-white/40">
          <tr className="border-b border-white/5">
            <th className="text-left p-4">Ticket</th>
            <th className="text-left p-4 hidden md:table-cell">Raised by</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4 hidden lg:table-cell">Age</th>
            <th className="text-left p-4"> </th>
          </tr>
        </thead>
        <tbody>
          {MOCK.map((t) => (
            <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]" data-testid={`queue-row-${t.id}`}>
              <td className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] text-white/40">{t.id}</span>
                  {t.overdue && (
                    <Badge className="bg-rose-500/15 text-rose-400 border-0 text-[9px] uppercase tracking-wider">
                      <AlertCircle className="h-2.5 w-2.5 mr-1" /> Overdue
                    </Badge>
                  )}
                </div>
                <div className="font-medium">{t.subject}</div>
              </td>
              <td className="p-4 hidden md:table-cell text-white/60">{t.by}</td>
              <td className="p-4">
                <Badge className="bg-[#FF6B5B]/15 text-[#FF6B5B] border-0 text-[10px] uppercase tracking-wider">{t.status.replace("_", " ")}</Badge>
              </td>
              <td className="p-4 hidden lg:table-cell text-white/50">
                <Clock className="inline h-3 w-3 mr-1" />
                {t.age}
              </td>
              <td className="p-4 text-right">
                <Link to={`/app/hr/tickets/${t.id}`}>
                  <Button size="sm" variant="ghost" className="text-[#FF6B5B] hover:bg-white/5" data-testid={`queue-open-${t.id}`}>
                    Open <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TicketQueue;
