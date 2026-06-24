import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Upload, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const GAPS = [
  { q: "What's the relocation cap for senior managers?", count: 7, last: "2h ago" },
  { q: "Can I take 4 weeks paternity leave in Ireland?", count: 4, last: "1d ago" },
  { q: "Are stock options taxed in Austria?", count: 3, last: "3d ago" },
];

const KnowledgeGaps: React.FC = () => (
  <div data-testid="knowledge-gaps-page">
    <PageHeader
      eyebrow="Improvement"
      title="Knowledge gaps"
      subtitle="Questions the bot couldn't answer confidently. Close the loop by uploading the right policy."
    />
    <div className="space-y-3">
      {GAPS.map((g, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-5 flex items-center gap-4"
          data-testid={`gap-row-${i}`}
        >
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-400 grid place-items-center shrink-0">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium">{g.q}</div>
            <div className="text-xs text-white/40 mt-1">Asked {g.count}× · last {g.last}</div>
          </div>
          <Badge className="bg-white/5 text-white/70 border border-white/10">Unresolved</Badge>
          <Button size="sm" className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] rounded-xl" data-testid={`gap-upload-${i}`}>
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload fix
          </Button>
        </div>
      ))}
    </div>
  </div>
);

export default KnowledgeGaps;
