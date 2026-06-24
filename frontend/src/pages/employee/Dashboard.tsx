import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, CreditCard, HeartHandshake, Laptop, BookOpen, ArrowUpRight,
  Clock, TicketCheck, Bell, MessageSquare, Activity, Globe2, Mic, Radio,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AIOrb } from "@/components/common/AIOrb";
import { Particles } from "@/components/common/Particles";
import { CommandSpotlight } from "@/components/common/CommandSpotlight";
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

const QUICK_INTENTS = [
  { label: "Apply leave", icon: Calendar, q: "Apply for leave" },
  { label: "Payslip", icon: CreditCard, q: "Show my latest payslip" },
  { label: "Benefits", icon: HeartHandshake, q: "What benefits do I have" },
  { label: "WFH", icon: Laptop, q: "What is the WFH policy" },
  { label: "Policies", icon: BookOpen, q: "Open the policy library" },
];

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const [threads, setThreads] = useState<Thread[]>([]);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [openTickets, setOpenTickets] = useState(0);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const t = await safe(() => listChatThreads(user.id));
      setThreads(((t as Thread[]) || []).slice(0, 5));
      const n = await safe(() => listNotifications(user.id));
      setNotifs(((n as Notif[]) || []).slice(0, 4));
      const ts = await safe(() => listMyTickets(user.id));
      setOpenTickets(((ts as any[]) || []).filter((x) => x.status !== "resolved" && x.status !== "closed").length);
    })();
  }, [user]);

  const hour = now.getHours();
  const greet = hour < 5 ? "Still up" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 22 ? "Good evening" : "Night owl";

  return (
    <div data-testid="employee-dashboard" className="relative min-h-[calc(100vh-9rem)]">
      <Particles count={36} />

      {/* HUD strip — top sci-fi line */}
      <div className="hidden sm:flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-white/35 font-mono mb-10 px-1">
        <div className="flex items-center gap-2">
          <Radio className="h-3 w-3 text-[#FF6B5B] pulse-soft" />
          assistant · online
        </div>
        <div className="flex items-center gap-6">
          <span>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
          <span className="text-white/25">·</span>
          <span>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          <span className="text-white/25">·</span>
          <span className="text-[#FF6B5B]">v1.0.0</span>
        </div>
      </div>

      {/* HERO — Orb + greeting + spotlight */}
      <div className="relative grid lg:grid-cols-[1fr,auto,1fr] items-center gap-8 lg:gap-12 mb-16">
        {/* left: time-of-day greeting, asymmetric */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
          className="text-right hidden lg:block">
          <div className="text-[10px] uppercase tracking-[0.32em] text-[#FF6B5B] font-mono mb-3">{greet.toUpperCase()}</div>
          <div className="font-display text-5xl 3xl:text-6xl font-extrabold tracking-tight leading-[0.95]">
            <span className="block text-white/95">{firstName}.</span>
            <span className="block text-gradient-aurora mt-1">Ask anything.</span>
          </div>
          <div className="text-sm text-white/45 mt-4 max-w-xs ml-auto">
            Region-scoped policy answers · voice · citations · seamless HR escalation.
          </div>
        </motion.div>

        {/* center: AI orb */}
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.16, 0.84, 0.44, 1] }}
          className="mx-auto">
          <AIOrb size={340} />
        </motion.div>

        {/* right: live signal panel */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="hidden lg:flex flex-col gap-2">
          <HudRow label="Conversations" value={threads.length} color="#FF6B5B" />
          <HudRow label="Open tickets" value={openTickets} color="#6366F1" />
          <HudRow label="Unread alerts" value={notifs.filter((n) => !n.is_read).length} color="#E11D2C" />
        </motion.div>

        {/* mobile greeting */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="lg:hidden text-center -mt-4">
          <div className="text-[10px] uppercase tracking-[0.32em] text-[#FF6B5B] font-mono mb-2">{greet.toUpperCase()}</div>
          <div className="font-display text-4xl font-extrabold tracking-tight">
            {firstName}. <span className="text-gradient-aurora">Ask anything.</span>
          </div>
        </motion.div>
      </div>

      {/* Spotlight input */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
        className="max-w-3xl mx-auto mb-10">
        <CommandSpotlight />
      </motion.div>

      {/* Intent chips — floating around the spotlight */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="flex flex-wrap justify-center gap-2 mb-16">
        {QUICK_INTENTS.map((q, i) => (
          <motion.div key={q.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.06 }}>
            <Link to={`/app/chat?q=${encodeURIComponent(q.q)}`} data-testid={`intent-${q.label}`}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition">
              <q.icon className="h-3.5 w-3.5 text-[#FF6B5B]" />
              {q.label}
              <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Lower panel: recent + alerts (asymmetric) */}
      <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
          className="lg:col-span-3 holo-border rounded-2xl bg-ink-card/80 backdrop-blur-md p-6 lg:p-7 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/40 font-mono mb-1">stream · recent</div>
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#FF6B5B]" /> Conversations
              </h2>
            </div>
            <Link to="/app/history" className="text-xs text-[#FF6B5B] hover:underline flex items-center gap-1" data-testid="dashboard-history-link">
              All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {threads.length === 0 ? (
            <div className="text-sm text-white/40 py-10 text-center border border-dashed border-white/[0.08] rounded-xl">
              No threads yet. The orb is listening.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {threads.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.04 }}>
                  <Link to={`/app/chat/${t.id}`} data-testid={`recent-chat-${i}`}
                    className="flex items-center gap-4 py-3.5 group">
                    <span className="font-mono text-[10px] text-white/30 w-8">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate group-hover:text-[#FF6B5B] transition-colors">{t.title}</div>
                    </div>
                    <span className="text-[10px] text-white/40 font-mono flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {formatWhen(t.updated_at)}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/30 group-hover:text-[#FF6B5B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
          className="lg:col-span-2 holo-border rounded-2xl bg-ink-card/80 backdrop-blur-md p-6 lg:p-7 border border-white/[0.06] relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[#FF6B5B]/15 blur-3xl" aria-hidden />
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/40 font-mono mb-1">signals</div>
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#FF6B5B]" /> Live alerts
              </h2>
            </div>
            {notifs.some((n) => !n.is_read) && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B5B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B5B]" />
              </span>
            )}
          </div>
          {notifs.length === 0 ? (
            <div className="text-sm text-white/40 py-10 text-center border border-dashed border-white/[0.08] rounded-xl relative z-10">
              Quiet for now.
            </div>
          ) : (
            <div className="space-y-3 relative z-10">
              {notifs.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                  data-testid={`announcement-${i}`}
                  className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <span className={`mt-1 h-1.5 w-1.5 rounded-full ${a.is_read ? "bg-white/20" : "bg-[#FF6B5B] pulse-soft"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white/90 leading-snug">{a.title}</div>
                    <div className="text-[10px] text-white/40 font-mono mt-1">{formatWhen(a.created_at)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* footer micro hud */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.28em] text-white/30 font-mono">
        <span className="flex items-center gap-1.5"><Activity className="h-2.5 w-2.5 text-emerald-400" /> rag online</span>
        <span className="flex items-center gap-1.5"><Globe2 className="h-2.5 w-2.5 text-[#6366F1]" /> region scoped</span>
        <span className="flex items-center gap-1.5"><Mic className="h-2.5 w-2.5 text-[#FF6B5B]" /> voice ready</span>
      </div>
    </div>
  );
};

const HudRow: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.05] transition">
    <span className="h-1.5 w-1.5 rounded-full pulse-soft" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
    <div className="text-[10px] uppercase tracking-[0.22em] text-white/45 font-mono flex-1">{label}</div>
    <div className="stat-mono text-2xl font-extrabold" style={{ color }}>{value.toString().padStart(2, "0")}</div>
  </div>
);

export default Dashboard;
