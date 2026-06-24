import React, { useState } from "react";
import { Search, Filter, FileText, Download, Star, BookOpen, Grid3x3, List } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["All", "HR", "Leave", "Payroll", "Benefits", "IT", "Code of Conduct", "Onboarding"];

const MOCK = [
  { id: "1", title: "India HR Policy v3.2", cat: "HR", region: "India", updated: "Jan 2026", recent: true },
  { id: "2", title: "Global Code of Conduct", cat: "Code of Conduct", region: "Global", updated: "Dec 2025" },
  { id: "3", title: "UK Leave & Holidays", cat: "Leave", region: "UK", updated: "Feb 2026", recent: true },
  { id: "4", title: "US Benefits Handbook", cat: "Benefits", region: "USA", updated: "Nov 2025" },
  { id: "5", title: "IT Acceptable Use Policy", cat: "IT", region: "Global", updated: "Jan 2026" },
  { id: "6", title: "South Africa Payroll Calendar", cat: "Payroll", region: "South Africa", updated: "Feb 2026" },
];

const PolicyLibrary: React.FC = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const items = MOCK.filter(
    (p) => (cat === "All" || p.cat === cat) && p.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div data-testid="policy-library-page">
      <PageHeader
        eyebrow="Knowledge"
        title="Policy library"
        subtitle="Search and download policies scoped to your region plus Global."
        actions={
          <div className="flex gap-1 rounded-xl border border-white/10 p-1">
            <Button size="icon" variant={view === "grid" ? "secondary" : "ghost"} onClick={() => setView("grid")} data-testid="lib-view-grid" className="h-8 w-8"><Grid3x3 className="h-4 w-4" /></Button>
            <Button size="icon" variant={view === "list" ? "secondary" : "ghost"} onClick={() => setView("list")} data-testid="lib-view-list" className="h-8 w-8"><List className="h-4 w-4" /></Button>
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search policies, e.g. 'parental leave'"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            data-testid="lib-search"
            className="pl-9 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/30"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              data-testid={`lib-cat-${c}`}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                cat === c
                  ? "bg-[#FF6B5B]/15 text-[#FF6B5B] border-[#FF6B5B]/40"
                  : "bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <div
              key={p.id}
              data-testid={`policy-card-${p.id}`}
              className="group relative rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-5 hover:border-white/15 transition-all"
            >
              {p.recent && (
                <Badge className="absolute top-4 right-4 bg-[#FF6B5B]/15 text-[#FF6B5B] border-0 text-[10px] uppercase tracking-wider">
                  Updated
                </Badge>
              )}
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#1A1A6B] to-[#0F0F4A] grid place-items-center mb-4">
                <FileText className="h-5 w-5 text-white/80" />
              </div>
              <div className="font-medium text-base mb-1.5 pr-12 leading-snug">{p.title}</div>
              <div className="flex items-center gap-2 text-[11px] text-white/40 mb-4">
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{p.cat}</span>
                <span>·</span>
                <span>{p.region}</span>
                <span>·</span>
                <span>{p.updated}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="ghost" className="h-8 text-white/70 hover:bg-white/5 hover:text-white" data-testid={`policy-view-${p.id}`}>
                  <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Preview
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-white/70 hover:bg-white/5 hover:text-[#FF6B5B]" data-testid={`policy-download-${p.id}`}>
                  <Download className="h-3.5 w-3.5 mr-1.5" /> Download
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-white/40 hover:text-yellow-400 hover:bg-white/5 ml-auto" data-testid={`policy-fav-${p.id}`}>
                  <Star className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md overflow-hidden divide-y divide-white/5">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02]" data-testid={`policy-row-${p.id}`}>
              <FileText className="h-5 w-5 text-white/60 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{p.title}</div>
                <div className="text-[11px] text-white/40">{p.cat} · {p.region} · {p.updated}</div>
              </div>
              <Button size="sm" variant="ghost" className="text-[#FF6B5B]" data-testid={`policy-list-download-${p.id}`}><Download className="h-3.5 w-3.5 mr-1" /> Download</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PolicyLibrary;
