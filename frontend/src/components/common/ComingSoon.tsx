import React from "react";
import { Construction } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

interface ComingSoonProps {
  eyebrow?: string;
  title: string;
  description?: string;
  testId?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  eyebrow,
  title,
  description,
  testId,
}) => {
  return (
    <div data-testid={testId}>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={description} />
      <div className="rounded-3xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-10 lg:p-14 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#FF6B5B]/10 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center mb-6 shadow-lg shadow-[#FF6B5B]/30">
            <Construction className="h-7 w-7 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">
            UI scaffolded · Backend wiring next
          </h2>
          <p className="text-white/60 leading-relaxed">
            This view is part of the {title.toLowerCase()} surface. The
            structure, navigation, design tokens and route guards are live —
            data wiring will plug in once the Supabase tables and n8n flows are
            connected.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-white/40">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              Region-scoped
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              RLS-protected
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              Role-aware
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
