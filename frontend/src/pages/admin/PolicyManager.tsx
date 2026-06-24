import React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, RefreshCw, Trash2 } from "lucide-react";

const MOCK = [
  { id: "1", title: "India HR Policy", v: "v3.2", regions: ["India"], cat: "HR", updated: "Jan 2026" },
  { id: "2", title: "Global Code of Conduct", v: "v5.0", regions: ["Global"], cat: "Conduct", updated: "Dec 2025" },
  { id: "3", title: "UK Leave & Holidays", v: "v2.1", regions: ["UK"], cat: "Leave", updated: "Feb 2026" },
];

const PolicyManager: React.FC = () => (
  <div data-testid="policy-manager-page">
    <PageHeader
      eyebrow="Admin"
      title="Policy manager"
      subtitle="Upload, version, tag and retire policies. Triggers re-embedding pipeline."
      actions={
        <Link to="/app/admin/policies/upload">
          <Button className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] rounded-xl" data-testid="policy-mgr-upload-btn">
            <Upload className="h-4 w-4 mr-1.5" /> Upload policy
          </Button>
        </Link>
      }
    />
    <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md overflow-hidden divide-y divide-white/5">
      {MOCK.map((p) => (
        <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02]" data-testid={`policy-mgr-row-${p.id}`}>
          <FileText className="h-5 w-5 text-white/60" />
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{p.title} <span className="text-white/40 font-normal ml-1.5">{p.v}</span></div>
            <div className="text-[11px] text-white/40 mt-0.5">
              {p.cat} · Updated {p.updated}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {p.regions.map((r) => (
              <Badge key={r} className="bg-white/5 text-white/70 border border-white/10 text-[10px]">{r}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-1 ml-3">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white/60 hover:bg-white/5" data-testid={`policy-mgr-reindex-${p.id}`}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-400/80 hover:bg-rose-500/10" data-testid={`policy-mgr-delete-${p.id}`}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PolicyManager;
