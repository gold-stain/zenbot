import React, { useMemo } from "react";

/**
 * Atmospheric drifting particles — pure CSS, no canvas.
 * Place absolutely inside a relative parent.
 */
export const Particles: React.FC<{ count?: number; className?: string }> = ({
  count = 28,
  className = "",
}) => {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 14,
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.5,
        hue: Math.random() > 0.5 ? "#FF6B5B" : "#6366F1",
      })),
    [count]
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {items.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `-${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background: p.hue,
            boxShadow: `0 0 8px ${p.hue}`,
          }}
        />
      ))}
    </div>
  );
};
