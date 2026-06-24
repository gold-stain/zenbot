import React, { useEffect, useRef } from "react";

interface AIOrbProps {
  size?: number;
  state?: "idle" | "listening" | "thinking" | "speaking";
  className?: string;
}

/**
 * The AI's "presence" — a living, layered orb with halo, plasma rings, and
 * pulsing core. Pure CSS + SVG, no WebGL, but feels alive.
 */
export const AIOrb: React.FC<AIOrbProps> = ({
  size = 280,
  state = "idle",
  className = "",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Subtle mouse-parallax (the orb tilts slightly toward the cursor)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      el.style.setProperty("--tx", `${dx * 12}px`);
      el.style.setProperty("--ty", `${dy * 12}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className={`ai-orb ${state} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div className="ai-orb-halo" />
      <div className="ai-orb-ring ring-1" />
      <div className="ai-orb-ring ring-2" />
      <div className="ai-orb-ring ring-3" />
      <div className="ai-orb-core">
        <div className="ai-orb-shine" />
        <div className="ai-orb-bars">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      </div>
      <svg className="ai-orb-orbit" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="orbgrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#FF6B5B" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#FF6B5B" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="180" fill="none" stroke="url(#orbgrad)" strokeWidth="0.5" strokeDasharray="2 8" opacity="0.6" />
        <circle cx="200" cy="200" r="155" fill="none" stroke="url(#orbgrad)" strokeWidth="0.4" strokeDasharray="1 4" opacity="0.4" />
      </svg>
    </div>
  );
};
