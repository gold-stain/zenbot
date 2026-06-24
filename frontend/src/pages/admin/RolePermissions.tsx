import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Check, X } from "lucide-react";

const ROLES = ["Employee", "HR", "Admin"] as const;
const PERMS = [
  { name: "Chat with assistant", e: true, hr: true, a: true },
  { name: "Browse own region's policies", e: true, hr: true, a: true },
  { name: "Raise tickets", e: true, hr: true, a: true },
  { name: "View regional ticket queue", e: false, hr: true, a: true },
  { name: "Respond to tickets", e: false, hr: true, a: true },
  { name: "View knowledge gaps", e: false, hr: true, a: true },
  { name: "Upload / manage policies", e: false, hr: false, a: true },
  { name: "Manage users & roles", e: false, hr: false, a: true },
  { name: "View audit logs", e: false, hr: false, a: true },
  { name: "Configure n8n & system settings", e: false, hr: false, a: true },
];

const RolePermissions: React.FC = () => (
  <div data-testid="role-permissions-page">
    <PageHeader eyebrow="Admin" title="Role permissions" subtitle="A clear matrix of what each role can do across the platform." />
    <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="text-[10px] uppercase tracking-[0.18em] text-white/40">
          <tr className="border-b border-white/5">
            <th className="text-left p-4">Permission</th>
            {ROLES.map((r) => <th key={r} className="p-4 text-center">{r}</th>)}
          </tr>
        </thead>
        <tbody>
          {PERMS.map((p) => (
            <tr key={p.name} className="border-b border-white/5 last:border-0" data-testid={`perm-${p.name}`}>
              <td className="p-4 font-medium">{p.name}</td>
              <td className="p-4 text-center">{p.e ? <Check className="h-4 w-4 mx-auto text-emerald-400" /> : <X className="h-4 w-4 mx-auto text-white/20" />}</td>
              <td className="p-4 text-center">{p.hr ? <Check className="h-4 w-4 mx-auto text-emerald-400" /> : <X className="h-4 w-4 mx-auto text-white/20" />}</td>
              <td className="p-4 text-center">{p.a ? <Check className="h-4 w-4 mx-auto text-emerald-400" /> : <X className="h-4 w-4 mx-auto text-white/20" />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RolePermissions;
