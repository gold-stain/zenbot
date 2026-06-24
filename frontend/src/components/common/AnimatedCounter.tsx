import React, { useEffect, useState } from "react";

interface CounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedCounter: React.FC<CounterProps> = ({
  value,
  duration = 900,
  className,
  prefix = "",
  suffix = "",
}) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <span className={className}>
      {prefix}
      {n.toLocaleString()}
      {suffix}
    </span>
  );
};

/** Tiny SVG sparkline for KPI cards */
export const Sparkline: React.FC<{ points: number[]; color?: string; height?: number }> = ({
  points,
  color = "#FF6B5B",
  height = 32,
}) => {
  if (!points.length) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = 100 / Math.max(1, points.length - 1);
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step},${height - ((p - min) / range) * height}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L 100,${height} L 0,${height} Z`} fill={`url(#sg-${color})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
