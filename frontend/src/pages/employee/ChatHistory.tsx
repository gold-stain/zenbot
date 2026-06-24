import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MessageSquare, Archive, Trash2, Pencil, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { listChatThreads, archiveChatThread, deleteChatThread, renameChatThread } from "@/services/db";
import { safe } from "@/services/safe";

interface Thread {
  id: string;
  title: string;
  updated_at: string;
  created_at: string;
}

const formatWhen = (iso: string) => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 36e5) return `${Math.max(1, Math.floor(diff / 6e4))}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  if (diff < 6048e5) return `${Math.floor(diff / 864e5)}d ago`;
  return d.toLocaleDateString();
};

const ChatHistory: React.FC = () => {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [threads, setThreads] = useState<Thread[]>([]);

  const reload = async () => {
    if (!user) return;
    const data = await safe(() => listChatThreads(user.id));
    setThreads((data as Thread[]) || []);
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const list = threads.filter((m) => m.title.toLowerCase().includes(q.toLowerCase()));

  const onRename = async (id: string, oldTitle: string) => {
    const next = prompt("Rename conversation", oldTitle);
    if (!next || next === oldTitle) return;
    await safe(() => renameChatThread(id, next));
    toast.success("Renamed");
    reload();
  };

  const onArchive = async (id: string) => {
    await safe(() => archiveChatThread(id));
    toast.success("Archived");
    reload();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this conversation?")) return;
    await safe(() => deleteChatThread(id));
    toast.success("Deleted");
    reload();
  };

  return (
    <div data-testid="chat-history-page">
      <PageHeader eyebrow="Archive" title="Chat history" subtitle="Search past conversations, rename, archive or remove them." />
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
          <div className="p-12 text-center text-white/50" data-testid="history-empty">
            {threads.length === 0 ? "No conversations yet. Start one from the Assistant." : "No conversations match."}
          </div>
        )}
        {list.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] group" data-testid={`history-row-${c.id}`}>
            <Link to={`/app/chat/${c.id}`} className="flex items-center gap-4 flex-1 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-white/5 grid place-items-center shrink-0">
                <MessageSquare className="h-4 w-4 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{c.title}</div>
                <div className="text-[11px] text-white/40 flex items-center gap-2 mt-0.5">
                  <Clock className="h-3 w-3" /> {formatWhen(c.updated_at)}
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" onClick={() => onRename(c.id, c.title)} className="h-8 w-8 text-white/60 hover:bg-white/5" data-testid={`history-rename-${c.id}`}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onArchive(c.id)} className="h-8 w-8 text-white/60 hover:bg-white/5" data-testid={`history-archive-${c.id}`}>
                <Archive className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete(c.id)} className="h-8 w-8 text-rose-400/80 hover:bg-rose-500/10" data-testid={`history-delete-${c.id}`}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
