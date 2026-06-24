import React from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  actions,
}) => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && (
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#FF6B5B] font-semibold mb-2">
          {eyebrow}
        </div>
      )}
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-white/60 text-base mt-2 max-w-2xl">{subtitle}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);
