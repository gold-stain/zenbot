import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Globe2, ExternalLink, Mail } from "lucide-react";

const REGIONS = [
  { name: "India",        flag: "🇮🇳", hr: "hr.in@zensar.com",        portals: 4 },
  { name: "USA",          flag: "🇺🇸", hr: "hr.us@zensar.com",        portals: 3 },
  { name: "UK",           flag: "🇬🇧", hr: "hr.uk@zensar.com",        portals: 3 },
  { name: "South Africa", flag: "🇿🇦", hr: "hr.za@zensar.com",        portals: 2 },
  { name: "Austria",      flag: "🇦🇹", hr: "hr.at@zensar.com",        portals: 2 },
  { name: "Singapore",    flag: "🇸🇬", hr: "hr.sg@zensar.com",        portals: 3 },
  { name: "Canada",       flag: "🇨🇦", hr: "hr.ca@zensar.com",        portals: 2 },
  { name: "Ireland",      flag: "🇮🇪", hr: "hr.ie@zensar.com",        portals: 2 },
  { name: "Global",       flag: "🌐", hr: "global.hr@zensar.com",     portals: 5 },
];

const RegionPortalManager: React.FC = () => (
  <div data-testid="region-portal-manager">
    <PageHeader eyebrow="Admin" title="Regions & portal links" subtitle="Configure HR mailboxes and region-specific portals (Leave, Payroll, ESS…)." />
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {REGIONS.map((r) => (
        <div key={r.name} className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-5" data-testid={`region-card-${r.name}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">{r.flag}</div>
            <div>
              <div className="font-display font-bold text-lg">{r.name}</div>
              <div className="text-xs text-white/40">{r.portals} portals configured</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-white/60">
              <Mail className="h-3.5 w-3.5" /> {r.hr}
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Globe2 className="h-3.5 w-3.5" /> {r.portals} active links
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-4 justify-between text-[#FF6B5B] hover:bg-white/5" data-testid={`region-manage-${r.name}`}>
            Manage <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  </div>
);

export default RegionPortalManager;
