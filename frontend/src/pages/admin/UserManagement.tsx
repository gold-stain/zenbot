import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserCog, Ban } from "lucide-react";

const MOCK = [
  { name: "Priya Sharma", email: "priya.s@zensar.com", region: "India", role: "employee", active: true },
  { name: "James Carter", email: "james.c@zensar.com", region: "UK", role: "hr", active: true },
  { name: "Aarti Patel", email: "aarti.p@zensar.com", region: "India", role: "employee", active: true },
  { name: "Megan Lee", email: "megan.l@zensar.com", region: "Singapore", role: "admin", active: true },
  { name: "Sipho Ndlovu", email: "sipho.n@zensar.com", region: "South Africa", role: "hr", active: false },
];

const roleColor = (r: string) =>
  r === "admin" ? "bg-blue-500/15 text-blue-300" :
  r === "hr" ? "bg-purple-500/15 text-purple-300" :
  "bg-white/5 text-white/70";

const UserManagement: React.FC = () => {
  const [q, setQ] = useState("");
  const filtered = MOCK.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div data-testid="user-management-page">
      <PageHeader eyebrow="Admin" title="User management" subtitle="Filter by region, assign roles, deactivate accounts." />
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" data-testid="users-search" className="pl-9 bg-white/5 border-white/10" />
      </div>
      <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-[0.18em] text-white/40">
            <tr className="border-b border-white/5">
              <th className="text-left p-4">User</th>
              <th className="text-left p-4 hidden md:table-cell">Region</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4 hidden lg:table-cell">Status</th>
              <th className="text-right p-4"> </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.email} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]" data-testid={`user-row-${u.email}`}>
                <td className="p-4">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-white/50">{u.email}</div>
                </td>
                <td className="p-4 hidden md:table-cell text-white/60">{u.region}</td>
                <td className="p-4">
                  <Badge className={`${roleColor(u.role)} border-0 uppercase tracking-wider text-[10px]`}>{u.role}</Badge>
                </td>
                <td className="p-4 hidden lg:table-cell">
                  <span className={`inline-flex items-center gap-1.5 text-xs ${u.active ? "text-emerald-400" : "text-white/40"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${u.active ? "bg-emerald-400" : "bg-white/30"}`} />
                    {u.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button size="sm" variant="ghost" className="text-white/60 hover:bg-white/5" data-testid={`user-edit-role-${u.email}`}>
                    <UserCog className="h-3.5 w-3.5 mr-1" /> Role
                  </Button>
                  <Button size="sm" variant="ghost" className="text-rose-400/80 hover:bg-rose-500/10" data-testid={`user-disable-${u.email}`}>
                    <Ban className="h-3.5 w-3.5 mr-1" /> {u.active ? "Disable" : "Enable"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
