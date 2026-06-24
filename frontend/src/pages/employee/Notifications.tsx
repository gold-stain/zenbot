import React from "react";
import { Bell, FileText, TicketCheck, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const MOCK = [
  { id: "1", icon: TicketCheck, title: "Your ticket TKT-9F03 is now In Progress", time: "12m ago", read: false },
  { id: "2", icon: FileText, title: "New policy published: 'India WFH 2026'", time: "2h ago", read: false },
  { id: "3", icon: ShieldAlert, title: "Password was changed", time: "Yesterday", read: true },
  { id: "4", icon: Bell, title: "Welcome to Zensar AI Assistant", time: "Last week", read: true },
];

const Notifications: React.FC = () => (
  <div data-testid="notifications-page">
    <PageHeader eyebrow="Inbox" title="Notifications" subtitle="Ticket updates, policy alerts, and account activity." />
    <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md overflow-hidden divide-y divide-white/5">
      {MOCK.map((n) => (
        <div key={n.id} className={`flex items-start gap-4 px-5 py-4 ${n.read ? "" : "bg-[#FF6B5B]/[0.04]"}`} data-testid={`notif-${n.id}`}>
          <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 grid place-items-center shrink-0">
            <n.icon className="h-4 w-4 text-white/70" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium leading-tight">{n.title}</div>
            <div className="text-[11px] text-white/40 mt-1">{n.time}</div>
          </div>
          {!n.read && <span className="h-2 w-2 rounded-full bg-[#FF6B5B] mt-2" />}
        </div>
      ))}
    </div>
  </div>
);

export default Notifications;
