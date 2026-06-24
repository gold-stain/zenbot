import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Paperclip, Send, User, Sparkles, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { getTicket, listTicketMessages, postTicketMessage, updateTicketStatus } from "@/services/db";
import { safe } from "@/services/safe";
import { toast } from "sonner";

interface Ticket {
  id: string;
  code: string;
  subject: string;
  description?: string;
  status: string;
  priority: string;
  created_by: string;
  created_at: string;
}

interface TMsg {
  id: string;
  ticket_id: string;
  author_id: string;
  body: string;
  created_at: string;
}

const TicketDetail: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TMsg[]>([]);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("open");
  const [sending, setSending] = useState(false);

  const reload = async () => {
    if (!id) return;
    const t = await safe(() => getTicket(id));
    if (t) {
      setTicket(t as Ticket);
      setStatus((t as Ticket).status);
    }
    const ms = await safe(() => listTicketMessages(id));
    setMessages((ms as TMsg[]) || []);
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSend = async () => {
    if (!reply.trim() || !id || !user) return;
    setSending(true);
    await safe(() => postTicketMessage(id, user.id, reply));
    if (status !== ticket?.status) await safe(() => updateTicketStatus(id, status));
    setReply("");
    setSending(false);
    toast.success("Reply sent");
    reload();
  };

  const onStatusChange = async (next: string) => {
    if (!id) return;
    setStatus(next);
    await safe(() => updateTicketStatus(id, next));
    toast.success("Status updated");
  };

  if (!ticket) {
    return (
      <div data-testid="ticket-detail-page">
        <Link to="/app/hr/queue" className="text-xs text-white/50 hover:text-white inline-flex items-center gap-1.5 mb-3">
          <ArrowLeft className="h-3 w-3" /> Back to queue
        </Link>
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50">Loading ticket…</div>
      </div>
    );
  }

  return (
    <div data-testid="ticket-detail-page">
      <Link to="/app/hr/queue" className="text-xs text-white/50 hover:text-white inline-flex items-center gap-1.5 mb-3" data-testid="ticket-back">
        <ArrowLeft className="h-3 w-3" /> Back to queue
      </Link>
      <PageHeader
        eyebrow={`Ticket · ${ticket.code}`}
        title={ticket.subject}
        subtitle={`Priority ${ticket.priority} · Opened ${new Date(ticket.created_at).toLocaleString()}`}
        actions={
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-48 bg-white/5 border-white/10" data-testid="ticket-status-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="awaiting_employee">Awaiting employee</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
            <h3 className="font-display font-bold mb-4">Description</h3>
            <p className="text-white/80 whitespace-pre-wrap text-sm">{ticket.description || "No description provided."}</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
            <h3 className="font-display font-bold mb-4">Thread</h3>
            {messages.length === 0 ? (
              <div className="text-sm text-white/50">No replies yet.</div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <Bubble key={m.id} side={m.author_id === ticket.created_by ? "user" : "ai"} text={m.body} time={new Date(m.created_at).toLocaleString()} />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
            <h3 className="font-display font-bold mb-4">Respond</h3>
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={5}
              placeholder="Write a response to the employee…"
              data-testid="ticket-reply-input"
              className="bg-white/5 border-white/10 rounded-xl resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <Button variant="ghost" size="sm" className="text-white/60 hover:bg-white/5" data-testid="ticket-attach">
                <Paperclip className="h-4 w-4 mr-1.5" /> Attach
              </Button>
              <Button onClick={onSend} disabled={sending || !reply.trim()} className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] rounded-xl" data-testid="ticket-send-reply">
                <Send className="h-4 w-4 mr-1.5" /> Send reply
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
            <h3 className="font-display font-bold mb-4">Meta</h3>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex justify-between"><span className="text-white/40">Code</span><span className="font-mono">{ticket.code}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Priority</span><span>{ticket.priority}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Status</span><span>{status}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Bubble: React.FC<{ side: "user" | "ai"; text: string; time: string }> = ({ side, text, time }) => (
  side === "user" ? (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center shrink-0">
        <User className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="text-xs text-white/50 mb-1">Employee · {time}</div>
        <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-xl whitespace-pre-wrap">{text}</div>
      </div>
    </div>
  ) : (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shrink-0">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="text-xs text-white/50 mb-1 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> HR · {time}</div>
        <div className="border-l-2 border-[#FF6B5B] pl-4 max-w-xl text-white/80 whitespace-pre-wrap">{text}</div>
      </div>
    </div>
  )
);

export default TicketDetail;
