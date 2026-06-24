import React, { useEffect, useState } from "react";
import { Bell, FileText, TicketCheck, ShieldAlert, CheckCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { listNotifications, markNotificationRead, markAllNotificationsRead } from "@/services/db";
import { safe } from "@/services/safe";

interface Notif {
  id: string;
  type: string;
  title: string;
  body?: string;
  is_read: boolean;
  created_at: string;
}

const iconFor = (type: string) =>
  type.includes("ticket") ? TicketCheck : type.includes("policy") ? FileText : type.includes("security") ? ShieldAlert : Bell;

const formatWhen = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 36e5) return `${Math.max(1, Math.floor(diff / 6e4))}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  if (diff < 6048e5) return `${Math.floor(diff / 864e5)}d ago`;
  return new Date(iso).toLocaleDateString();
};

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    if (!user) return;
    const data = await safe(() => listNotifications(user.id));
    setItems((data as Notif[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const markAll = async () => {
    if (!user) return;
    await safe(() => markAllNotificationsRead(user.id));
    reload();
  };

  const onClick = async (n: Notif) => {
    if (!n.is_read) {
      await safe(() => markNotificationRead(n.id));
      reload();
    }
  };

  return (
    <div data-testid="notifications-page">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        subtitle="Ticket updates, policy alerts, and account activity."
        actions={
          items.some((i) => !i.is_read) ? (
            <Button onClick={markAll} variant="ghost" className="text-white/80 hover:bg-white/5" data-testid="notif-mark-all">
              <CheckCheck className="h-4 w-4 mr-1.5" /> Mark all read
            </Button>
          ) : null
        }
      />
      {loading ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50">Loading…</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50" data-testid="notif-empty">
          You're all caught up.
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md overflow-hidden divide-y divide-white/5">
          {items.map((n) => {
            const Icon = iconFor(n.type);
            return (
              <div
                key={n.id}
                onClick={() => onClick(n)}
                className={`flex items-start gap-4 px-5 py-4 cursor-pointer ${n.is_read ? "" : "bg-[#FF6B5B]/[0.04]"}`}
                data-testid={`notif-${n.id}`}
              >
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 grid place-items-center shrink-0">
                  <Icon className="h-4 w-4 text-white/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium leading-tight">{n.title}</div>
                  {n.body && <div className="text-xs text-white/50 mt-0.5">{n.body}</div>}
                  <div className="text-[11px] text-white/40 mt-1">{formatWhen(n.created_at)}</div>
                </div>
                {!n.is_read && <span className="h-2 w-2 rounded-full bg-[#FF6B5B] mt-2" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
