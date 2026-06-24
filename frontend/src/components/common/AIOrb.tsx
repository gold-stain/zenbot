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
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
      return; // skip on touch devices
    }
    let raf = 0;
    let nextX = 0;
    let nextY = 0;
    const apply = () => {
      el.style.setProperty("--tx", `${nextX}px`);
      el.style.setProperty("--ty", `${nextY}px`);
      raf = 0;
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      nextX = dx * 12;
      nextY = dy * 12;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
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
