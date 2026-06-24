import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Upload, AlertOctagon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { listKnowledgeGaps, resolveKnowledgeGap } from "@/services/db";
import { safe } from "@/services/safe";
import { toast } from "sonner";

interface Gap {
  id: string;
  question: string;
  occurrences: number;
  created_at: string;
  resolved: boolean;
}

const formatAge = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 36e5) return `${Math.max(1, Math.floor(diff / 6e4))}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return `${Math.floor(diff / 864e5)}d ago`;
};

const KnowledgeGaps: React.FC = () => {
  const { user } = useAuth();
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    const data = await safe(() => listKnowledgeGaps());
    setGaps((data as Gap[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const onResolve = async (id: string) => {
    if (!user) return;
    await safe(() => resolveKnowledgeGap(id, user.id));
    toast.success("Marked resolved");
    reload();
  };

  return (
    <div data-testid="knowledge-gaps-page">
      <PageHeader
        eyebrow="Improvement"
        title="Knowledge gaps"
        subtitle="Questions the bot couldn't answer confidently. Close the loop by uploading the right policy."
      />
      {loading ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50">Loading…</div>
      ) : gaps.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50" data-testid="gaps-empty">
          No unresolved knowledge gaps. Nice work.
        </div>
      ) : (
        <div className="space-y-3">
          {gaps.map((g) => (
            <div
              key={g.id}
              className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-5 flex items-center gap-4"
              data-testid={`gap-row-${g.id}`}
            >
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-400 grid place-items-center shrink-0">
                <AlertOctagon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{g.question}</div>
                <div className="text-xs text-white/40 mt-1">Asked {g.occurrences}× · last {formatAge(g.created_at)}</div>
              </div>
              <Badge className="bg-white/5 text-white/70 border border-white/10">Unresolved</Badge>
              <Button size="sm" onClick={() => onResolve(g.id)} className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] rounded-xl" data-testid={`gap-resolve-${g.id}`}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark resolved
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeGaps;
