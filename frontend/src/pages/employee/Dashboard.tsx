import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, CreditCard, HeartHandshake, Laptop, BookOpen, ArrowRight,
  Sparkles, Clock, TicketCheck, Bell, ChevronRight, MessageSquare, Zap, Mic, ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { InteractiveCard } from "@/components/common/InteractiveCard";
import { listChatThreads, listNotifications, listMyTickets } from "@/services/db";
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
  const [openTickets, setOpenTickets] = useState(0);
  const [policiesScoped, setPoliciesScoped] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const t = await safe(() => listChatThreads(user.id));
      setThreads(((t as Thread[]) || []).slice(0, 4));
      const n = await safe(() => listNotifications(user.id));
      setNotifs(((n as Notif[]) || []).slice(0, 4));
      const ts = await safe(() => listMyTickets(user.id));
      setOpenTickets(((ts as any[]) || []).filter((x) => x.status !== "resolved" && x.status !== "closed").length);
      setPoliciesScoped(0);
    })();
  }, [user]);

  const quickActions = [
    { label: "Apply for leave", icon: Calendar, to: "/app/chat?q=Apply+for+leave", color: "from-[#FF6B5B] to-[#E11D2C]", testId: "qa-leave" },
    { label: "View payslip", icon: CreditCard, to: "/app/chat?q=Show+my+latest+payslip", color: "from-[#1A1A6B] to-[#0F0F4A]", testId: "qa-payslip" },
    { label: "Benefits", icon: HeartHandshake, to: "/app/chat?q=What+benefits+do+I+have", color: "from-[#E11D2C] to-[#FF6B5B]", testId: "qa-benefits" },
    { label: "WFH policy", icon: Laptop, to: "/app/chat?q=What+is+the+WFH+policy", color: "from-[#6366F1] to-[#1A1A6B]", testId: "qa-wfh" },
    { label: "Policy library", icon: BookOpen, to: "/app/policies", color: "from-[#FF6B5B] to-[#6366F1]", testId: "qa-library" },
    { label: "My tickets", icon: TicketCheck, to: "/app/tickets", color: "from-[#0F0F4A] to-[#E11D2C]", testId: "qa-tickets" },
  ];

  return (
    <div data-testid="employee-dashboard" className="space-y-10 4xl:space-y-14">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#FF6B5B] font-semibold mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B5B] pulse-soft" />
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl 3xl:text-7xl font-extrabold tracking-tight leading-[1.05]">
          Hi {firstName},
          <br />
          <span className="text-gradient-aurora">what can I help with?</span>
        </h1>
      </motion.div>

      {/* Featured: ask card with shine */}
      <Link to="/app/chat" data-testid="dashboard-ask-card" className="block">
        <motion.div whileHover={{ scale: 1.005 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 p-8 lg:p-12 bg-gradient-to-br from-[#0A0A1F] via-[#0E0E2A] to-[#12123A] aurora">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }}
              className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shadow-[0_0_40px_rgba(255,107,91,0.45)]">
              <Sparkles className="h-7 w-7 text-white" />
            </motion.div>
            <div className="flex-1">
              <div className="font-display text-2xl lg:text-3xl font-bold mb-2">
                Ask the assistant anything
              </div>
              <p className="text-white/60 text-sm max-w-2xl">
                From <em className="text-white/80">"How many casual leaves do I have?"</em> to <em className="text-white/80">"What's the relocation policy in Ireland?"</em> — try voice or type.
              </p>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/10 text-sm font-medium hover:bg-white/[0.1] transition">
              Start chatting <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </motion.div>
      </Link>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <KpiTile icon={Zap}      label="Conversations" value={threads.length} color="#FF6B5B" testId="kpi-convs" />
        <KpiTile icon={TicketCheck} label="Open tickets" value={openTickets} color="#6366F1" testId="kpi-tickets" />
        <KpiTile icon={BookOpen} label="Policies in your scope" value={policiesScoped} color="#E11D2C" testId="kpi-policies" />
        <KpiTile icon={Bell}     label="Unread notifications" value={notifs.filter((n) => !n.is_read).length} color="#10B981" testId="kpi-notifs" />
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="font-display text-lg font-bold mb-4 text-white/90 flex items-center gap-2">
          <Mic className="h-4 w-4 text-[#FF6B5B]" /> Quick actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          {quickActions.map((qa, i) => (
            <motion.div key={qa.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.45 }}>
              <Link to={qa.to} data-testid={qa.testId}>
                <InteractiveCard className="p-5 card-tilt h-full">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${qa.color} grid place-items-center mb-4 shadow-lg`}>
                    <qa.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-sm font-medium leading-tight">{qa.label}</div>
                  <ChevronRight className="absolute top-5 right-5 h-4 w-4 text-white/30 group-hover:text-[#FF6B5B] group-hover:translate-x-0.5 transition-all" />
                </InteractiveCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent + notifications */}
      <div className="grid lg:grid-cols-3 gap-4 lg:gap-5">
        <InteractiveCard className="lg:col-span-2 p-6" glow>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#FF6B5B]" /> Recent conversations
            </h2>
            <Link to="/app/history" className="text-xs text-[#FF6B5B] hover:underline flex items-center gap-1" data-testid="dashboard-history-link">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {threads.length === 0 ? (
            <div className="text-sm text-white/50 py-10 text-center border-2 border-dashed border-white/5 rounded-xl">
              No conversations yet. Open the Assistant to start one.
            </div>
          ) : (
            <div className="space-y-2">
              {threads.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link to={`/app/chat/${t.id}`} data-testid={`recent-chat-${i}`}
                    className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/15 transition-all group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 grid place-items-center shrink-0">
                        <MessageSquare className="h-4 w-4 text-white/70" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm truncate font-medium">{t.title}</div>
                        <div className="text-[11px] text-white/40 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {formatWhen(t.updated_at)}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-[#FF6B5B] group-hover:translate-x-0.5 transition" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </InteractiveCard>

        <InteractiveCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#FF6B5B]" /> Notifications
            </h2>
            {notifs.some((n) => !n.is_read) && (
              <span className="h-2 w-2 rounded-full bg-[#FF6B5B] pulse-soft" />
            )}
          </div>
          {notifs.length === 0 ? (
            <div className="text-sm text-white/50 py-10 text-center border-2 border-dashed border-white/5 rounded-xl">
              All caught up <ShieldCheck className="inline h-4 w-4 text-emerald-400 ml-1" />
            </div>
          ) : (
            <div className="space-y-3">
              {notifs.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                  className="pb-3 border-b border-white/5 last:border-0 last:pb-0" data-testid={`announcement-${i}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Badge className="bg-[#FF6B5B]/15 text-[#FF6B5B] border-0 text-[10px] uppercase tracking-wider">{a.is_read ? "Read" : "New"}</Badge>
                    <span className="text-[11px] text-white/40">{formatWhen(a.created_at)}</span>
                  </div>
                  <div className="text-sm font-medium text-white/90 leading-snug">{a.title}</div>
                </motion.div>
              ))}
            </div>
          )}
        </InteractiveCard>
      </div>
    </div>
  );
};

const KpiTile: React.FC<{ icon: any; label: string; value: number; color: string; testId: string }> = ({ icon: Icon, label, value, color, testId }) => (
  <InteractiveCard className="p-5 card-tilt" testId={testId}>
    <div className="flex items-start justify-between mb-3">
      <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)`, border: `1px solid ${color}33` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <span className="text-[10px] uppercase tracking-wider text-white/30 font-mono">live</span>
    </div>
    <div className="font-display text-3xl 3xl:text-4xl font-extrabold leading-none">{value}</div>
    <div className="text-xs text-white/50 uppercase tracking-wider mt-2">{label}</div>
  </InteractiveCard>
);

export default Dashboard;
