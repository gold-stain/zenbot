import React from "react";

/**
 * Futuristic ambient backdrop for authenticated pages.
 * Layers: deep gradient + grid + aurora + grain + scanline.
 */
export const Ambient: React.FC = () => (
  <>
    <div className="pointer-events-none fixed inset-0 -z-10 bg-ink" />
    <div className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-60" />
    <div className="pointer-events-none fixed inset-0 -z-10 aurora" />
    <div className="pointer-events-none fixed inset-0 -z-10 grain" />
    <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#FF6B5B]/40 to-transparent" />
  </>
);
