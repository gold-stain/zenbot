import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, CreditCard, HeartHandshake, Laptop, BookOpen, ArrowRight,
  Clock, TicketCheck, Bell, MessageSquare, Mic, ChevronRight,
  Sparkles, FileText, Plane, Users as UsersIcon, ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AIOrb } from "@/components/common/AIOrb";
import { CommandSpotlight } from "@/components/common/CommandSpotlight";
import { listChatThreads, listNotifications, listMyTickets } from "@/services/db";
import { safe } from "@/services/safe";

interface Thread { id: string; title: string; updated_at: string; }
interface Notif { id: string; title: string; created_at: string; is_read: boolean; }

const friendlyWhen = (iso: string) => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60 * 60e3) return `${Math.max(1, Math.floor(diff / 6e4))} min ago`;
  if (diff < 24 * 36e5) return `${Math.floor(diff / 36e5)} hr ago`;
  if (diff < 7 * 864e5) return d.toLocaleDateString(undefined, { weekday: "short" });
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const SUGGESTIONS = [
  {
    cat: "Time off",
    icon: Calendar,
    color: "#FF6B5B",
    items: [
      "How many casual leaves do I have left?",
      "Apply for 3 days of paternity leave",
      "Show the holiday calendar for my region",
    ],
  },
  {
    cat: "Pay & benefits",
    icon: CreditCard,
    color: "#6366F1",
    items: [
      "Show my last payslip",
      "What benefits am I eligible for?",
      "How is overtime calculated?",
    ],
  },
  {
    cat: "Policies",
    icon: BookOpen,
    color: "#E11D2C",
    items: [
      "What's the WFH policy for 2026?",
      "Travel reimbursement caps",
      "Code of conduct — gifts & vendors",
    ],
  },
  {
    cat: "Career",
    icon: Plane,
    color: "#10B981",
    items: [
      "Internal mobility — how do I apply?",
      "Promotion cycle dates",
      "Tuition reimbursement policy",
    ],
  },
];

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const [threads, setThreads] = useState<Thread[]>([]);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [openTickets, setOpenTickets] = useState(0);
  const [activeCat, setActiveCat] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const t = await safe(() => listChatThreads(user.id));
      setThreads(((t as Thread[]) || []).slice(0, 6));
      const n = await safe(() => listNotifications(user.id));
      setNotifs(((n as Notif[]) || []).slice(0, 5));
      const ts = await safe(() => listMyTickets(user.id));
      setOpenTickets(((ts as any[]) || []).filter((x) => x.status !== "resolved" && x.status !== "closed").length);
    })();
  }, [user]);

  const hour = new Date().getHours();
  const greet = hour < 5 ? "Still up" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 22 ? "Good evening" : "Late night";

  return (
    <div data-testid="employee-dashboard" className="relative">
      {/* HERO — smaller orb, clearer headline, then big spotlight */}
      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-10 lg:mb-12"
      >
        <div className="shrink-0">
          <AIOrb size={180} />
        </div>
        <div className="flex-1 text-center lg:text-left">
          <div className="text-sm text-[#FF6B5B] font-medium mb-2">{greet}, {firstName}</div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl 3xl:text-6xl font-extrabold tracking-tight leading-[1.05] mb-3">
            How can I help today?
          </h1>
          <p className="text-base text-white/55 max-w-xl mx-auto lg:mx-0">
            Ask in your own words — leave, payroll, benefits, policies. Get an answer in seconds, cited from your region's HR corpus.
          </p>
        </div>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.55 }}
        className="max-w-3xl mx-auto mb-4">
        <CommandSpotlight />
      </motion.div>

      <div className="flex items-center justify-center gap-2 text-xs text-white/40 mb-14">
        <Mic className="h-3 w-3 text-[#FF6B5B]" /> Press the mic to speak · Enter to send
      </div>

      {/* Top stats — clean, friendly, NOT a sci-fi HUD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-12">
        <StatCard icon={MessageSquare} value={threads.length} label="Conversations" sublabel="last 30 days" color="#FF6B5B" />
        <StatCard icon={TicketCheck} value={openTickets} label="Open tickets" sublabel={openTickets ? "needs follow-up" : "all clear"} color="#6366F1" />
        <StatCard icon={Bell} value={notifs.filter((n) => !n.is_read).length} label="Unread alerts" sublabel="last 7 days" color="#E11D2C" />
        <StatCard icon={Sparkles} value={notifs.length} label="Activity" sublabel="touches this week" color="#10B981" />
      </div>

      {/* Suggestions — by category, much friendlier */}
      <section className="mb-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl font-bold mb-1">Try asking</h2>
            <p className="text-sm text-white/50">Tap any suggestion — the assistant will take it from there.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={s.cat}
              onClick={() => setActiveCat(i)}
              data-testid={`suggest-cat-${s.cat}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeCat === i
                  ? "bg-white/[0.08] text-white border-white/20 shadow-[0_0_24px_rgba(255,107,91,0.15)]"
                  : "bg-white/[0.02] text-white/65 border-white/[0.06] hover:bg-white/[0.05] hover:text-white"
              }`}
              style={activeCat === i ? { color: s.color, borderColor: `${s.color}55` } : {}}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {SUGGESTIONS[activeCat].items.map((q, i) => (
            <motion.div key={q} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link
                to={`/app/chat?q=${encodeURIComponent(q)}`}
                data-testid={`suggest-q-${i}`}
                className="group block rounded-2xl bg-white/[0.025] border border-white/[0.06] p-4 hover:bg-white/[0.05] hover:border-white/15 transition h-full"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg shrink-0 grid place-items-center"
                    style={{ background: `${SUGGESTIONS[activeCat].color}1A`, border: `1px solid ${SUGGESTIONS[activeCat].color}33` }}>
                    <MessageSquare className="h-3.5 w-3.5" style={{ color: SUGGESTIONS[activeCat].color }} />
                  </div>
                  <div className="flex-1 text-sm text-white/85 leading-snug">{q}</div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/30 group-hover:text-[#FF6B5B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition shrink-0 mt-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick links — friendly icon row */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-5">Quick links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { to: "/app/policies", icon: BookOpen, label: "Policy library", desc: "Browse & download" },
            { to: "/app/tickets", icon: TicketCheck, label: "My tickets", desc: `${openTickets} open` },
            { to: "/app/notifications", icon: Bell, label: "Notifications", desc: `${notifs.filter((n) => !n.is_read).length} unread` },
            { to: "/app/history", icon: Clock, label: "Chat history", desc: `${threads.length} threads` },
            { to: "/app/help", icon: HeartHandshake, label: "Help & FAQ", desc: "Get unstuck" },
          ].map((l) => (
            <Link key={l.to} to={l.to} data-testid={`quick-${l.label}`}
              className="group rounded-2xl bg-white/[0.025] border border-white/[0.06] p-4 hover:bg-white/[0.05] hover:border-white/15 transition">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 grid place-items-center mb-3">
                <l.icon className="h-4 w-4 text-[#FF6B5B]" />
              </div>
              <div className="font-medium text-sm">{l.label}</div>
              <div className="text-xs text-white/45 mt-0.5">{l.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom: recent conversations + alerts (cleaner) */}
      <div className="grid lg:grid-cols-5 gap-5 lg:gap-6">
        <section className="lg:col-span-3 rounded-2xl bg-white/[0.025] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#FF6B5B]" /> Pick up where you left off
            </h3>
            <Link to="/app/history" className="text-xs text-[#FF6B5B] hover:underline flex items-center gap-1" data-testid="dashboard-history-link">
              All conversations <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {threads.length === 0 ? (
            <div className="text-sm text-white/40 py-12 text-center border border-dashed border-white/[0.08] rounded-xl">
              <MessageSquare className="h-8 w-8 mx-auto text-white/20 mb-3" />
              No conversations yet. Try one of the suggestions above.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {threads.map((t, i) => (
                <Link key={t.id} to={`/app/chat/${t.id}`} data-testid={`recent-chat-${i}`}
                  className="flex items-center gap-3 py-3 group hover:bg-white/[0.02] -mx-3 px-3 rounded-lg transition">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.04] border border-white/[0.06] grid place-items-center shrink-0">
                    <MessageSquare className="h-3.5 w-3.5 text-white/55" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate group-hover:text-[#FF6B5B] transition-colors">{t.title}</div>
                    <div className="text-[11px] text-white/45 mt-0.5">{friendlyWhen(t.updated_at)}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/25 group-hover:text-[#FF6B5B] group-hover:translate-x-0.5 transition" />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="lg:col-span-2 rounded-2xl bg-white/[0.025] border border-white/[0.06] p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#FF6B5B]/12 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#FF6B5B]" /> What's new
              </h3>
              {notifs.some((n) => !n.is_read) && (
                <span className="text-[10px] uppercase tracking-wider text-[#FF6B5B] font-semibold">
                  {notifs.filter((n) => !n.is_read).length} new
                </span>
              )}
            </div>
            {notifs.length === 0 ? (
              <div className="text-sm text-white/40 py-12 text-center border border-dashed border-white/[0.08] rounded-xl">
                <Bell className="h-8 w-8 mx-auto text-white/20 mb-3" />
                You're all caught up.
              </div>
            ) : (
              <div className="space-y-3">
                {notifs.map((a, i) => (
                  <div key={a.id} data-testid={`announcement-${i}`}
                    className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${a.is_read ? "bg-white/20" : "bg-[#FF6B5B] pulse-soft"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white/90 leading-snug">{a.title}</div>
                      <div className="text-[11px] text-white/45 mt-1">{friendlyWhen(a.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: any; value: number; label: string; sublabel: string; color: string }> = ({
  icon: Icon, value, label, sublabel, color,
}) => (
  <div className="rounded-2xl bg-white/[0.025] border border-white/[0.06] p-5 hover:bg-white/[0.05] hover:border-white/15 transition">
    <div className="flex items-center justify-between mb-3">
      <div className="h-9 w-9 rounded-xl grid place-items-center"
        style={{ background: `${color}1A`, border: `1px solid ${color}33` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
    </div>
    <div className="font-display text-3xl font-extrabold tracking-tight" style={{ color }}>{value}</div>
    <div className="text-sm font-medium text-white/85 mt-1">{label}</div>
    <div className="text-[11px] text-white/45 mt-0.5">{sublabel}</div>
  </div>
);

export default Dashboard;
