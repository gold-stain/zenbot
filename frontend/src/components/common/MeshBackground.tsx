import React from "react";

/**
 * Full-screen mesh gradient — multiple radial blobs blended on near-black.
 * Replaces the simple "Ambient" component with something genuinely cinematic.
 */
export const MeshBackground: React.FC<{ variant?: "dashboard" | "chat" | "marketing" }> = ({
  variant = "dashboard",
}) => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#03030A]">
      {/* base mesh blobs */}
      <div className={`mesh-blob mesh-blob-1 ${variant}`} />
      <div className={`mesh-blob mesh-blob-2 ${variant}`} />
      <div className={`mesh-blob mesh-blob-3 ${variant}`} />
      <div className={`mesh-blob mesh-blob-4 ${variant}`} />
      {/* grid + grain overlays */}
      <div className="absolute inset-0 grid-bg opacity-[0.4]" />
      <div className="absolute inset-0 grain" />
      {/* vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)"
      }} />
      {/* top scanline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF6B5B]/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent" />
    </div>
  );
};
