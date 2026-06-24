import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  CreditCard,
  HeartHandshake,
  Laptop,
  BookOpen,
  ArrowRight,
  Sparkles,
  Clock,
  TicketCheck,
  Bell,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { listChatThreads, listNotifications } from "@/services/db";
import { safe } from "@/services/safe";

interface Thread { id: string; title: string; updated_at: string; }
interface Notif { id: string; title: string; created_at: string; is_read: boolean; }

const formatWhen = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 36e5) return `${Math.max(1, Math.floor(diff / 6e4))}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  if (diff < 6048e5) return `${Math.floor(diff / 864e5)}d ago`;
  return new Date(iso).toLocaleDateString();
};

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const [threads, setThreads] = useState<Thread[]>([]);
  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const t = await safe(() => listChatThreads(user.id));
      setThreads(((t as Thread[]) || []).slice(0, 3));
      const n = await safe(() => listNotifications(user.id));
      setNotifs(((n as Notif[]) || []).slice(0, 3));
    })();
  }, [user]);

  const quickActions = [
    { label: "Apply for leave", icon: Calendar, to: "/app/chat?q=Apply+for+leave", color: "from-[#FF6B5B] to-[#E11D2C]", testId: "qa-leave" },
    { label: "View payslip", icon: CreditCard, to: "/app/chat?q=Show+my+latest+payslip", color: "from-[#1A1A6B] to-[#0F0F4A]", testId: "qa-payslip" },
    { label: "Benefits", icon: HeartHandshake, to: "/app/chat?q=What+benefits+do+I+have", color: "from-[#E11D2C] to-[#FF6B5B]", testId: "qa-benefits" },
    { label: "WFH policy", icon: Laptop, to: "/app/chat?q=What+is+the+WFH+policy", color: "from-[#1A1A6B] to-[#FF6B5B]", testId: "qa-wfh" },
    { label: "Policy library", icon: BookOpen, to: "/app/policies", color: "from-[#FF6B5B] to-[#1A1A6B]", testId: "qa-library" },
    { label: "My tickets", icon: TicketCheck, to: "/app/tickets", color: "from-[#0F0F4A] to-[#E11D2C]", testId: "qa-tickets" },
  ];

  return (
    <div data-testid="employee-dashboard">
      <div className="mb-10">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#FF6B5B] font-semibold mb-2">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">
          Hi {firstName}, <span className="text-gradient-coral">what can I help with?</span>
        </h1>
      </div>

      <Link
        to="/app/chat"
        data-testid="dashboard-ask-card"
        className="block group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B0B20] via-[#0B0B20] to-[#12123A] border border-white/10 p-8 lg:p-10 mb-10 hover:border-[#FF6B5B]/40 transition-all"
      >
        <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-[#FF6B5B]/15 blur-3xl group-hover:bg-[#FF6B5B]/25 transition-all" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shadow-lg shadow-[#FF6B5B]/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-display text-2xl font-bold mb-1.5">Ask the assistant anything</div>
            <p className="text-white/60 text-sm max-w-xl">
              From "How many casual leaves do I have?" to "What's the relocation policy in Ireland?" — try voice or type.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70 group-hover:text-[#FF6B5B] transition-colors">
            Start chatting <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>

      <h2 className="font-display text-lg font-bold mb-4 text-white/90">Quick actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
        {quickActions.map((qa) => (
          <Link
            key={qa.label}
            to={qa.to}
            data-testid={qa.testId}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-5 hover:border-white/15 transition-all"
          >
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${qa.color} grid place-items-center mb-4 shadow-lg`}>
              <qa.icon className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm font-medium leading-tight">{qa.label}</div>
            <ChevronRight className="absolute top-5 right-5 h-4 w-4 text-white/30 group-hover:text-[#FF6B5B] group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold">Recent conversations</h2>
            <Link to="/app/history" className="text-xs text-[#FF6B5B] hover:underline flex items-center gap-1" data-testid="dashboard-history-link">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {threads.length === 0 ? (
            <div className="text-sm text-white/50 py-6 text-center">No conversations yet. Open the Assistant to start one.</div>
          ) : (
            <div className="space-y-3">
              {threads.map((t, i) => (
                <Link
                  key={t.id}
                  to={`/app/chat/${t.id}`}
                  data-testid={`recent-chat-${i}`}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-white/5 grid place-items-center shrink-0">
                      <MessageSquare className="h-3.5 w-3.5 text-white/60" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm truncate font-medium">{t.title}</div>
                      <div className="text-[11px] text-white/40 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {formatWhen(t.updated_at)}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-[#FF6B5B]" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold">Notifications</h2>
            <Bell className="h-4 w-4 text-white/40" />
          </div>
          {notifs.length === 0 ? (
            <div className="text-sm text-white/50">All caught up.</div>
          ) : (
            <div className="space-y-4">
              {notifs.map((a, i) => (
                <div key={a.id} className="pb-4 border-b border-white/5 last:border-0 last:pb-0" data-testid={`announcement-${i}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Badge className="bg-[#FF6B5B]/15 text-[#FF6B5B] border-0 text-[10px] uppercase tracking-wider">Update</Badge>
                    <span className="text-[11px] text-white/40">{formatWhen(a.created_at)}</span>
                  </div>
                  <div className="text-sm font-medium text-white/90 leading-snug">{a.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
