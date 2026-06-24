import React, { useState } from "react";
import { Search, MessageSquare, Archive, Trash2, Pencil, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MOCK = [
  { id: "1", title: "How do I claim relocation expenses?", time: "2h ago", count: 8 },
  { id: "2", title: "What is the parental leave policy?", time: "Yesterday", count: 5 },
  { id: "3", title: "Show me my last 3 payslips", time: "2d ago", count: 3 },
  { id: "4", title: "WFH eligibility for IT Ops", time: "Last week", count: 12 },
  { id: "5", title: "How to nominate beneficiaries", time: "Mar 12", count: 4 },
];

const ChatHistory: React.FC = () => {
  const [q, setQ] = useState("");
  const list = MOCK.filter((m) => m.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div data-testid="chat-history-page">
      <PageHeader
        eyebrow="Archive"
        title="Chat history"
        subtitle="Search past conversations, rename, archive or remove them."
      />
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          placeholder="Search conversations…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          data-testid="history-search"
          className="pl-9 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/30"
        />
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md overflow-hidden divide-y divide-white/5">
        {list.length === 0 && (
          <div className="p-12 text-center text-white/50" data-testid="history-empty">No conversations match.</div>
        )}
        {list.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] group" data-testid={`history-row-${c.id}`}>
            <div className="h-9 w-9 rounded-lg bg-white/5 grid place-items-center shrink-0">
              <MessageSquare className="h-4 w-4 text-white/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{c.title}</div>
              <div className="text-[11px] text-white/40 flex items-center gap-2 mt-0.5">
                <Clock className="h-3 w-3" /> {c.time} · {c.count} messages
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white/60 hover:bg-white/5" data-testid={`history-rename-${c.id}`}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white/60 hover:bg-white/5" data-testid={`history-archive-${c.id}`}><Archive className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-400/80 hover:bg-rose-500/10" data-testid={`history-delete-${c.id}`}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
