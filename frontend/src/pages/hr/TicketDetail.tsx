import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Paperclip, Send, User, Sparkles, ShieldCheck, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TicketDetail: React.FC = () => {
  const { id } = useParams();
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("in_progress");

  return (
    <div data-testid="ticket-detail-page">
      <Link to="/app/hr/queue" className="text-xs text-white/50 hover:text-white inline-flex items-center gap-1.5 mb-3" data-testid="ticket-back">
        <ArrowLeft className="h-3 w-3" /> Back to queue
      </Link>
      <PageHeader
        eyebrow={`Ticket · ${id}`}
        title="Relocation reimbursement — Pune to Bengaluru"
        subtitle="Raised by Priya S. · India region · Priority high"
        actions={
          <Select value={status} onValueChange={setStatus}>
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
          {/* Chat history */}
          <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
            <h3 className="font-display font-bold mb-4">Original conversation</h3>
            <div className="space-y-4">
              <Bubble side="user" name="Priya S." text="I'm relocating from Pune to Bengaluru next month. What can I claim?" />
              <Bubble side="ai" name="Zensar AI" text="Per India Relocation Policy v2.1, you can claim packing & moving (capped at ₹50k), travel for self + dependents, and a one-time settling-in allowance. I'd recommend confirming the cap with HR." />
              <Bubble side="user" name="Priya S." text="Got it. I'd like to talk to HR to confirm the cap for senior roles." />
            </div>
          </div>

          {/* HR reply composer */}
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
              <Button className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] rounded-xl" data-testid="ticket-send-reply">
                <Send className="h-4 w-4 mr-1.5" /> Send reply
              </Button>
            </div>
          </div>
        </div>

        {/* Employee + meta */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
            <h3 className="font-display font-bold mb-4">Employee</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#1A1A6B] to-[#FF6B5B] grid place-items-center text-sm font-bold">PS</div>
              <div>
                <div className="font-medium">Priya S.</div>
                <div className="text-xs text-white/50">priya.s@zensar.com</div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex justify-between"><span className="text-white/40">Region</span><span>India</span></div>
              <div className="flex justify-between"><span className="text-white/40">Department</span><span>Engineering</span></div>
              <div className="flex justify-between"><span className="text-white/40">Employee ID</span><span>ZEN-104382</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
            <h3 className="font-display font-bold mb-4">Quick attach</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-white/70 hover:bg-white/5" data-testid="ticket-attach-relocation">
                <FileText className="h-4 w-4 mr-2 text-[#FF6B5B]" /> India Relocation Policy v2.1
              </Button>
              <Button variant="ghost" className="w-full justify-start text-white/70 hover:bg-white/5" data-testid="ticket-attach-payroll">
                <FileText className="h-4 w-4 mr-2 text-[#FF6B5B]" /> Q1 Payroll Calendar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Bubble: React.FC<{ side: "user" | "ai"; name: string; text: string }> = ({ side, name, text }) =>
  side === "user" ? (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center shrink-0">
        <User className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="text-xs text-white/50 mb-1">{name}</div>
        <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-xl">{text}</div>
      </div>
    </div>
  ) : (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shrink-0">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="text-xs text-white/50 mb-1 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> {name}</div>
        <div className="border-l-2 border-[#FF6B5B] pl-4 max-w-xl text-white/80">{text}</div>
      </div>
    </div>
  );

export default TicketDetail;
