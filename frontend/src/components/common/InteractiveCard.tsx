import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  testId?: string;
  glow?: boolean;
  href?: string;
  onClick?: () => void;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = "",
  testId,
  glow = true,
  onClick,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 120, damping: 18 });
  const ySpring = useSpring(y, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-4, 4]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      data-testid={testId}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`relative rounded-2xl bg-ink-card border border-white/[0.06] overflow-hidden group transition-colors hover:border-white/15 ${glow ? "neon-border" : ""} ${className}`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(255,107,91,0.07), transparent 50%)" }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
