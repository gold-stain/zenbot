import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Globe2, ExternalLink, Link as LinkIcon } from "lucide-react";
import { listRegions, listPortalLinks } from "@/services/db";
import { safe } from "@/services/safe";

interface Region { id: string; code: string; name: string; flag?: string; }
interface PortalLink { id: string; key: string; label: string; url: string; region_id: string | null; }

const RegionPortalManager: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [links, setLinks] = useState<PortalLink[]>([]);

  useEffect(() => {
    (async () => {
      const r = await safe(() => listRegions());
      setRegions((r as Region[]) || []);
      const l = await safe(() => listPortalLinks(null));
      setLinks((l as PortalLink[]) || []);
    })();
  }, []);

  return (
    <div data-testid="region-portal-manager">
      <PageHeader eyebrow="Admin" title="Regions & portal links" subtitle="Configure HR mailboxes and region-specific portals (Leave, Payroll, ESS…)." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.length === 0 && (
          <div className="col-span-3 rounded-2xl border border-white/5 bg-[#0B0B20]/80 p-12 text-center text-white/50" data-testid="regions-empty">
            No regions found — apply the SQL migration to seed the 9 regions.
          </div>
        )}
        {regions.map((r) => {
          const portals = links.filter((l) => l.region_id === r.id);
          return (
            <div key={r.id} className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-5" data-testid={`region-card-${r.code}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{r.flag || "🌐"}</div>
                <div>
                  <div className="font-display font-bold text-lg">{r.name}</div>
                  <div className="text-xs text-white/40">{portals.length} portals configured</div>
                </div>
              </div>
              {portals.length > 0 ? (
                <div className="space-y-2 text-sm">
                  {portals.slice(0, 4).map((p) => (
                    <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/70 hover:text-[#FF6B5B] truncate">
                      <LinkIcon className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{p.label}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-white/40">No portal links yet.</div>
              )}
              <Button variant="ghost" size="sm" className="w-full mt-4 justify-between text-[#FF6B5B] hover:bg-white/5" data-testid={`region-manage-${r.code}`}>
                Manage <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegionPortalManager;
