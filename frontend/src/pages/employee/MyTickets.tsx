import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listMyTickets, createTicket } from "@/services/db";
import { safe } from "@/services/safe";
import { toast } from "sonner";

interface Ticket {
  id: string;
  code: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  region_id?: string;
}

const STATUS: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-[#FF6B5B]/15 text-[#FF6B5B]" },
  in_progress: { label: "In progress", color: "bg-amber-500/15 text-amber-400" },
  awaiting_employee: { label: "Awaiting you", color: "bg-purple-500/15 text-purple-300" },
  resolved: { label: "Resolved", color: "bg-emerald-500/15 text-emerald-400" },
  closed: { label: "Closed", color: "bg-white/10 text-white/50" },
};

const formatAge = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 36e5) return `${Math.max(1, Math.floor(diff / 6e4))}m`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h`;
  return `${Math.floor(diff / 864e5)}d`;
};

const MyTickets: React.FC = () => {
  const { user, regionId } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    if (!user) return;
    setLoading(true);
    const data = await safe(() => listMyTickets(user.id));
    setTickets((data as Ticket[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onNew = async () => {
    if (!user) return;
    const subject = prompt("Subject:");
    if (!subject) return;
    const t = await safe(() =>
      createTicket({
        subject,
        description: "",
        region_id: regionId,
        user_id: user.id,
        priority: "medium",
      })
    );
    if (t) {
      toast.success("Ticket raised");
      reload();
    }
  };

  return (
    <div data-testid="my-tickets-page">
      <PageHeader
        eyebrow="Support"
        title="My tickets"
        subtitle="Track every HR escalation you've raised."
        actions={
          <Button onClick={onNew} className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] rounded-xl" data-testid="ticket-new-btn">
            <Plus className="h-4 w-4 mr-1.5" /> New ticket
          </Button>
        }
      />
      {loading ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50">Loading…</div>
      ) : tickets.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50" data-testid="tickets-empty">
          No tickets yet. Raise one from a chat reply or click "New ticket".
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => {
            const s = STATUS[t.status] || STATUS.open;
            return (
              <div
                key={t.id}
                data-testid={`ticket-card-${t.id}`}
                className="group rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-5 hover:border-white/15 transition-all flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-mono text-[11px] text-white/40">{t.code}</span>
                    <Badge className={`${s.color} border-0 text-[10px] uppercase tracking-wider`}>{s.label}</Badge>
                    {t.priority === "high" && (
                      <Badge className="bg-rose-500/15 text-rose-400 border-0 text-[10px] uppercase tracking-wider">
                        High priority
                      </Badge>
                    )}
                  </div>
                  <div className="font-medium text-base truncate">{t.subject}</div>
                  <div className="text-[11px] text-white/40 flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> Opened {formatAge(t.created_at)} ago
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
