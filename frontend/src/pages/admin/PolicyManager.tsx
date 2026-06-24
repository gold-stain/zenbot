import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Trash2 } from "lucide-react";
import { listPolicies, deletePolicy } from "@/services/db";
import { safe } from "@/services/safe";
import { toast } from "sonner";

interface Policy {
  id: string;
  title: string;
  current_version: number;
  category?: string;
  updated_at: string;
  policy_regions?: Array<{ regions?: { name?: string } }>;
}

const PolicyManager: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    const data = await safe(() => listPolicies());
    setPolicies((data as Policy[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Soft-delete this policy?")) return;
    await safe(() => deletePolicy(id));
    toast.success("Policy retired");
    reload();
  };

  return (
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
      {loading ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50">Loading…</div>
      ) : policies.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50" data-testid="policy-mgr-empty">
          No policies yet. Click "Upload policy" to start.
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md overflow-hidden divide-y divide-white/5">
          {policies.map((p) => {
            const regions = (p.policy_regions || []).map((pr) => pr.regions?.name).filter(Boolean);
            return (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02]" data-testid={`policy-mgr-row-${p.id}`}>
                <FileText className="h-5 w-5 text-white/60" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {p.title} <span className="text-white/40 font-normal ml-1.5">v{p.current_version}</span>
                  </div>
                  <div className="text-[11px] text-white/40 mt-0.5">
                    {p.category || "—"} · Updated {new Date(p.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {regions.map((r) => (
                    <Badge key={r as string} className="bg-white/5 text-white/70 border border-white/10 text-[10px]">{r}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <Button size="icon" variant="ghost" onClick={() => onDelete(p.id)} className="h-8 w-8 text-rose-400/80 hover:bg-rose-500/10" data-testid={`policy-mgr-delete-${p.id}`}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PolicyManager;
