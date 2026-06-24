import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Ban } from "lucide-react";
import { listUsers, updateUserRole, setUserActive } from "@/services/db";
import { safe } from "@/services/safe";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserRow {
  id: string;
  email: string;
  full_name?: string;
  role: "employee" | "hr" | "admin";
  is_active: boolean;
  regions?: { name?: string };
}

const roleColor = (r: string) =>
  r === "admin" ? "bg-blue-500/15 text-blue-300" : r === "hr" ? "bg-purple-500/15 text-purple-300" : "bg-white/5 text-white/70";

const UserManagement: React.FC = () => {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    const data = await safe(() => listUsers());
    setUsers((data as UserRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const filtered = users.filter((u) => `${u.full_name || ""} ${u.email}`.toLowerCase().includes(q.toLowerCase()));

  const onRole = async (id: string, role: "employee" | "hr" | "admin") => {
    await safe(() => updateUserRole(id, role));
    toast.success("Role updated");
    reload();
  };

  const onToggleActive = async (id: string, active: boolean) => {
    await safe(() => setUserActive(id, active));
    toast.success(active ? "User enabled" : "User disabled");
    reload();
  };

  return (
    <div data-testid="user-management-page">
      <PageHeader eyebrow="Admin" title="User management" subtitle="Filter by region, assign roles, deactivate accounts." />
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" data-testid="users-search" className="pl-9 bg-white/5 border-white/10" />
      </div>
      {loading ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50" data-testid="users-empty">
          {users.length === 0 ? "No users yet — invite via sign-up." : "No users match."}
        </div>
      ) : (
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
                <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]" data-testid={`user-row-${u.email}`}>
                  <td className="p-4">
                    <div className="font-medium">{u.full_name || u.email}</div>
                    <div className="text-xs text-white/50">{u.email}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-white/60">{u.regions?.name || "—"}</td>
                  <td className="p-4">
                    <Select value={u.role} onValueChange={(v: string) => onRole(u.id, v as any)}>
                      <SelectTrigger className="w-32 bg-white/5 border-white/10 h-8" data-testid={`user-role-${u.email}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${u.is_active ? "text-emerald-400" : "text-white/40"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.is_active ? "bg-emerald-400" : "bg-white/30"}`} />
                      {u.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="ghost" onClick={() => onToggleActive(u.id, !u.is_active)} className="text-rose-400/80 hover:bg-rose-500/10" data-testid={`user-disable-${u.email}`}>
                      <Ban className="h-3.5 w-3.5 mr-1" /> {u.is_active ? "Disable" : "Enable"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
