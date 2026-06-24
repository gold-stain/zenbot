import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listRegionTickets } from "@/services/db";
import { safe } from "@/services/safe";

interface Ticket {
  id: string;
  code: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

const formatAge = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 36e5) return `${Math.max(1, Math.floor(diff / 6e4))}m`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h`;
  return `${Math.floor(diff / 864e5)}d`;
};

const isOverdue = (t: Ticket) => {
  const ageDays = (Date.now() - new Date(t.created_at).getTime()) / 864e5;
  return t.status !== "resolved" && t.status !== "closed" && ageDays > 2;
};

const TicketQueue: React.FC = () => {
  const { regionId, role } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await safe(() => listRegionTickets(role === "admin" ? null : regionId));
      setTickets((data as Ticket[]) || []);
      setLoading(false);
    })();
  }, [regionId, role]);

  return (
    <div data-testid="hr-queue-page">
      <PageHeader eyebrow="Queue" title="Ticket queue" subtitle="All escalated tickets in your region. Assign, respond, close." />
      {loading ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50">Loading…</div>
      ) : tickets.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50" data-testid="queue-empty">
          No tickets in your queue.
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              <tr className="border-b border-white/5">
                <th className="text-left p-4">Ticket</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 hidden lg:table-cell">Age</th>
                <th className="text-left p-4"> </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]" data-testid={`queue-row-${t.id}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] text-white/40">{t.code}</span>
                      {isOverdue(t) && (
                        <Badge className="bg-rose-500/15 text-rose-400 border-0 text-[9px] uppercase tracking-wider">
                          <AlertCircle className="h-2.5 w-2.5 mr-1" /> Overdue
                        </Badge>
                      )}
                      {t.priority === "high" && (
                        <Badge className="bg-amber-500/15 text-amber-400 border-0 text-[9px] uppercase tracking-wider">
                          High
                        </Badge>
                      )}
                    </div>
                    <div className="font-medium">{t.subject}</div>
                  </td>
                  <td className="p-4">
                    <Badge className="bg-[#FF6B5B]/15 text-[#FF6B5B] border-0 text-[10px] uppercase tracking-wider">
                      {t.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-white/50">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {formatAge(t.created_at)}
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
      )}
    </div>
  );
};

export default TicketQueue;
