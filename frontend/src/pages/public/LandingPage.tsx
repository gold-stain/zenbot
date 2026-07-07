import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Clock,
  Globe2,
  Headphones,
  MessageCircle,
  MessageSquare,
  Mic,
  Send,
  Signal,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MeshBackground } from "@/components/common/MeshBackground";

const stats = [
  { value: "24/7", label: "employee self-service" },
  { value: "9", label: "region-aware portals" },
  { value: "<4h", label: "handoff-ready context" },
];

const LandingPage: React.FC = () => {
  useLayoutEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden max-w-[100vw] bg-[radial-gradient(circle_at_8%_8%,rgba(255,107,91,0.42),transparent_28%),radial-gradient(circle_at_88%_14%,rgba(215,255,122,0.22),transparent_24%),radial-gradient(circle_at_48%_48%,rgba(26,26,107,0.96),transparent_42%),linear-gradient(135deg,#170823_0%,#1A1A6B_34%,#E11D2C_72%,#FF6B5B_100%)] aurora grain">
      <MeshBackground variant="marketing" />
      <Header />
      <HeroSection />
      <SectionTransition variant="one" />
      <HowItWorksSection />
      <SectionTransition variant="two" />
      <CapabilitiesSection />
      <SectionTransition variant="three" />
      <PillarsSection />
      <SectionTransition variant="one" />
      <ImpactSection />
      <Footer />
      <FloatingAIChatWidget />
    </div>
  );
};

const Header: React.FC = () => (
  <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-10 4xl:px-16 py-4 flex items-center justify-between bg-[#03030A]/70 backdrop-blur-2xl border-b border-white/[0.07]">
    <Link to="/" className="flex items-center gap-2.5" data-testid="public-logo">
      <img src="/favicon.svg" alt="ZenBot" className="h-9 w-9 rounded-lg shadow-[0_0_24px_rgba(255,107,91,0.45)]" />
      <div className="leading-tight">
        <div className="font-display font-extrabold text-white">ZenBot</div>
        <div className="text-[10px] uppercase text-white/45">Employee Assistant</div>
      </div>
    </Link>

    <nav className="hidden md:flex items-center gap-1 text-sm" data-testid="header-nav">
      <a href="#capabilities" className="px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.05] transition">Capabilities</a>
      <a href="#how-it-works" className="px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.05] transition">How it works</a>
      <a href="#pillars" className="px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.05] transition">Pillars</a>
      <a href="#try-it" className="px-3 py-2 rounded-lg text-[#D7FF7A] font-medium hover:bg-white/[0.05] transition flex items-center gap-1">
        Live flow <ArrowRight className="h-3 w-3" />
      </a>
    </nav>

    <div className="flex items-center gap-2">
      <Link to="/sign-in">
        <Button variant="ghost" size="sm" data-testid="header-signin-btn" className="text-white/80 hover:text-white hover:bg-white/[0.06]">
          Sign in
        </Button>
      </Link>
      <Link to="/sign-up">
        <Button size="sm" data-testid="header-signup-btn" className="bg-[#D7FF7A] text-[#07140F] hover:bg-[#e5ff9f] transition rounded-lg px-4 sm:px-5 font-bold shadow-[0_0_24px_rgba(215,255,122,0.24)]">
          Get started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  </header>
);

const HeroSection: React.FC = () => (
  <section className="relative min-h-[calc(100vh-73px)] px-4 sm:px-6 lg:px-10 4xl:px-16 overflow-hidden flex items-center">
    <img
      src="/zenbot-people-hero.png"
      alt="Zensar employees collaborating"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(3,3,10,0.98)_0%,rgba(26,26,107,0.82)_38%,rgba(225,29,44,0.38)_68%,rgba(3,3,10,0.32)_100%)]" />
    <div className="absolute inset-0 grid-bg opacity-45" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,107,91,0.28),transparent_32%),radial-gradient(circle_at_70%_18%,rgba(215,255,122,0.16),transparent_28%),linear-gradient(180deg,transparent_0%,rgba(3,3,10,0.94)_100%)]" />

    <div className="relative z-10 max-w-7xl mx-auto w-full py-16 lg:py-20">
      <div className="relative min-h-[620px] lg:min-h-[660px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl pt-8 lg:pt-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.18] text-xs text-white/85 mb-6 shadow-[0_0_36px_rgba(255,107,91,0.14)]" data-testid="hero-pill">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D7FF7A] pulse-soft" />
            People-first HR service - Region locked - AI assisted
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl 3xl:text-8xl font-extrabold leading-[0.9] mb-6 max-w-5xl">
            Employee support
            <br />
            <span className="text-gradient-aurora">that feels human.</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/74 leading-relaxed mb-8 max-w-2xl">
            ZenBot turns policy answers, HR handoffs, profile context, and regional routing into one intelligent service layer for every Zensar employee.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Link to="/sign-up">
              <Button size="lg" data-testid="hero-cta-signup" className="w-full sm:w-auto bg-[#D7FF7A] text-[#07140F] hover:bg-[#e5ff9f] transition rounded-full h-13 px-7 text-base font-bold shadow-[0_0_34px_rgba(215,255,122,0.3)]">
                Start with your profile <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button size="lg" variant="ghost" data-testid="hero-cta-signin" className="w-full sm:w-auto rounded-full h-13 px-7 text-base font-semibold border border-white/25 text-white hover:bg-white/[0.08] hover:border-white/45">
                Sign in
              </Button>
            </Link>
          </div>
          <motion.div
            className="grid grid-cols-3 gap-3 max-w-xl mt-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.65 }}
          >
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/12 bg-white/[0.055] px-4 py-3 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                <div className="font-display text-2xl font-extrabold">{item.value}</div>
                <div className="text-[11px] text-white/45 leading-tight">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <AnimatedAIShowcase />
      </div>
    </div>
  </section>
);

const AnimatedAIShowcase: React.FC = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStage((value) => (value + 1) % 5);
    }, 1600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div
      id="try-it"
      initial={{ opacity: 0, y: 24, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: 0.35, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative lg:absolute lg:right-0 lg:bottom-12 mt-10 lg:mt-0 w-full max-w-[27rem] ml-auto"
    >
      <motion.div
        aria-hidden
        className="absolute -left-6 -top-5 h-16 w-16 rounded-[2rem] border border-[#D7FF7A]/30 bg-[#D7FF7A]/10 backdrop-blur-xl"
        animate={{ y: [0, -10, 0], rotate: [0, 7, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-4 -bottom-4 h-20 w-20 rounded-[1.6rem] border border-[#FF6B5B]/25 bg-[#FF6B5B]/10 backdrop-blur-xl"
        animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 overflow-hidden rounded-[1.75rem] border border-white/18 bg-[linear-gradient(145deg,rgba(255,255,255,0.14),rgba(255,255,255,0.045))] backdrop-blur-3xl shadow-[0_28px_80px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(215,255,122,0.16),transparent_34%),radial-gradient(circle_at_100%_20%,rgba(255,107,91,0.18),transparent_32%)]" />
        <div className="relative p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="" className="h-9 w-9 rounded-xl" />
              <div>
                <div className="text-[10px] uppercase text-[#D7FF7A] font-semibold">Live AI reply</div>
                <div className="text-sm font-bold">ZenBot</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-[10px] text-emerald-100">
              <Signal className="h-3 w-3" />
              active
            </div>
          </div>

          <div className="space-y-3 min-h-[14rem]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="ml-auto max-w-[82%] rounded-[1.2rem] rounded-br-sm bg-[#D7FF7A] px-4 py-3 text-sm font-semibold text-[#07140F] shadow-[0_12px_30px_rgba(215,255,122,0.18)]"
            >
              How many casual leave days do I have?
            </motion.div>

            <AnimatePresence mode="wait">
              {stage === 1 && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.32 }}
                  className="flex max-w-[76%] items-center gap-2 rounded-[1.2rem] rounded-bl-sm border border-white/14 bg-white/[0.09] px-4 py-3 text-white/70"
                >
                  <Bot className="h-4 w-4 text-[#FF6B5B]" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/70" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/70 [animation-delay:0.15s]" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/70 [animation-delay:0.3s]" />
                </motion.div>
              )}

              {stage >= 2 && (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.36 }}
                  className="max-w-[88%] rounded-[1.2rem] rounded-bl-sm border border-white/14 bg-[#06100E]/68 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                >
                  <div className="mb-2 flex items-center gap-2 text-[10px] uppercase text-[#D7FF7A]">
                    <Sparkles className="h-3.5 w-3.5" />
                    attached answer
                  </div>
                  <p className="text-sm leading-relaxed text-white/86">
                    You have 6 casual leave days available. I can help you start a request for your manager.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-[11px] text-white/56">
            <span>South Africa policy</span>
            <span className="text-[#D7FF7A]">region locked</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HowItWorksSection: React.FC = () => (
  <section id="how-it-works" className="relative px-4 sm:px-6 lg:px-10 py-16 lg:py-24 scroll-mt-20 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(215,255,122,0.14),transparent_28%),linear-gradient(135deg,rgba(26,26,107,0.34),rgba(255,107,91,0.08))]" />
    <div className="max-w-7xl mx-auto">
      <SectionHeading eyebrow="How it works" title="A service desk around each employee." subtitle="Fast answers, clean escalation, and profile-aware support without making employees learn a new system." />
      <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
        {[
          { n: "01", icon: MessageSquare, color: "#FF6B5B", t: "Ask naturally", d: "Type or speak. ZenBot keeps context across follow-ups and starts with the employee profile." },
          { n: "02", icon: BookOpen, color: "#6366F1", t: "Answer with evidence", d: "Policy answers cite the exact document, section, and page for the user's locked region." },
          { n: "03", icon: Users, color: "#D7FF7A", t: "Escalate with context", d: "When HR needs to step in, the profile, region, manager, and support history travel with the case." },
        ].map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="rounded-lg p-7 lg:p-8 bg-white/[0.035] border border-white/[0.08] hover:bg-white/[0.055] hover:border-white/15 transition card-tilt"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 rounded-lg grid place-items-center" style={{ background: `${s.color}1A`, border: `1px solid ${s.color}40` }}>
                <s.icon className="h-5 w-5" style={{ color: s.color }} />
              </div>
              <span className="font-display text-3xl font-extrabold text-white/15">{s.n}</span>
            </div>
            <h3 className="font-display text-2xl font-bold mb-3">{s.t}</h3>
            <p className="text-sm text-white/58 leading-relaxed">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CapabilitiesSection: React.FC = () => (
  <section id="capabilities" className="relative px-4 sm:px-6 lg:px-10 py-16 lg:py-24 scroll-mt-20 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_16%,rgba(255,107,91,0.22),transparent_30%),radial-gradient(circle_at_12%_74%,rgba(99,102,241,0.2),transparent_34%)]" />
    <div className="max-w-7xl mx-auto">
      <SectionHeading eyebrow="What's inside" title="Built like an employee service platform." subtitle="The profile section, support flow, and policy engine work together so every answer starts with useful context." />

      <div className="grid md:grid-cols-6 gap-4 lg:gap-5">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          className="md:col-span-4 rounded-lg bg-gradient-to-br from-[#07140F] via-[#0A0A1F] to-[#12123A] border border-white/[0.08] p-8 lg:p-10 relative overflow-hidden"
        >
          <div className="relative z-10 max-w-xl">
            <div className="text-xs text-[#D7FF7A] font-semibold uppercase mb-3">Employee profile</div>
            <h3 className="font-display text-3xl lg:text-4xl font-bold mb-4">Every answer starts with the right person, place, and policy.</h3>
            <p className="text-white/60 leading-relaxed">
              Region lock, profile picture, manager routing, support metrics, skills, and working preferences help HR resolve requests faster.
            </p>
          </div>
          <div className="relative z-10 mt-8 grid sm:grid-cols-3 gap-3">
            {["Admin locked region", "Avatar-ready identity", "Manager-aware routing"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white/75">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
        <FeatureCard icon={Volume2} color="#FF6B5B" t="Voice in and out" d="Push-to-talk support and playback-ready answers for accessible employee service." />
        <FeatureCard icon={Globe2} color="#6366F1" t="Admin-managed regions" d="Employees are auto-scoped; admins control changes to keep RLS and policies clean." />
        <FeatureCard icon={ShieldCheck} color="#E11D2C" t="RLS-secured" d="Supabase policies, audit-friendly profile data, and regional access boundaries." />
        <FeatureCard icon={Users} color="#D7FF7A" t="HR handover" d="Escalate with employee profile, manager, history, and support context intact." />
        <FeatureCard icon={Clock} color="#8EA7FF" t="Always learning" d="Knowledge gaps and low-confidence questions become clear admin follow-ups." />
      </div>
    </div>
  </section>
);

const PillarsSection: React.FC = () => (
  <section id="pillars" className="relative px-4 sm:px-6 lg:px-10 py-16 lg:py-24 scroll-mt-20 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(215,255,122,0.1),transparent_34%,rgba(225,29,44,0.13)),radial-gradient(circle_at_50%_50%,rgba(26,26,107,0.34),transparent_42%)]" />
    <div className="max-w-7xl mx-auto">
      <SectionHeading eyebrow="Principles" title="Our experience pillars." subtitle="A people-focused product should feel confident, clear, and useful from the first click." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { color: "#1A1A6B", title: "Put people first", desc: "Profile context makes every HR interaction feel more personal." },
          { color: "#FF6B5B", title: "Embrace the unexpected", desc: "From policy questions to urgent escalations, the flow stays calm." },
          { color: "#E11D2C", title: "Solve together", desc: "Employees, HR, and admins share one support context." },
          { color: "#D7FF7A", title: "Take charge", desc: "Cleaner profiles create cleaner answers and faster routing." },
        ].map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="rounded-lg p-6 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.055] hover:border-white/15 transition"
          >
            <div className="h-2 w-16 rounded-full mb-6" style={{ background: p.color, boxShadow: `0 0 24px ${p.color}55` }} />
            <h3 className="font-display text-xl font-bold mb-2">{p.title}</h3>
            <p className="text-sm text-white/58 leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ImpactSection: React.FC = () => (
  <section className="relative px-4 sm:px-6 lg:px-10 py-20 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,107,91,0.24),transparent_34%),linear-gradient(180deg,transparent,rgba(3,3,10,0.45))]" />
    <div className="max-w-5xl mx-auto rounded-[2rem] p-8 sm:p-10 lg:p-14 text-center relative overflow-hidden border border-white/[0.14] shadow-[0_30px_90px_rgba(26,26,107,0.28)]" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(26,26,107,0.62) 42%, rgba(225,29,44,0.34) 100%)", backdropFilter: "blur(28px)" }}>
      <div className="relative z-10">
        <div className="text-xs text-[#D7FF7A] font-semibold uppercase mb-3">Get started</div>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
          Build your profile. Get better support.
        </h2>
        <p className="text-white/62 max-w-xl mx-auto mb-7">
          ZenBot starts with the employee profile so every policy answer and HR handoff has context from the beginning.
        </p>
        <Link to="/sign-up">
          <Button size="lg" data-testid="cta-bottom-signup" className="bg-[#D7FF7A] text-[#07140F] hover:bg-[#e5ff9f] rounded-lg h-12 px-8 text-base font-bold shadow-[0_0_28px_rgba(215,255,122,0.25)]">
            Create your account <Zap className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

const SectionTransition: React.FC<{ variant: "one" | "two" | "three" }> = ({ variant }) => {
  const styles = {
    one: "from-[#FF6B5B]/0 via-[#FF6B5B]/30 to-[#D7FF7A]/0",
    two: "from-[#1A1A6B]/0 via-[#6366F1]/32 to-[#E11D2C]/0",
    three: "from-[#D7FF7A]/0 via-[#D7FF7A]/24 to-[#FF6B5B]/0",
  };

  return (
    <div className="relative h-20 sm:h-24 overflow-hidden" aria-hidden>
      <motion.div
        className={`absolute left-1/2 top-1/2 h-24 w-[120vw] -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] rounded-full bg-gradient-to-r ${styles[variant]} blur-sm`}
        animate={{ x: ["-4%", "4%", "-4%"], scaleY: [1, 1.2, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-px w-[88vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent"
        animate={{ opacity: [0.25, 0.8, 0.25], x: ["3%", "-3%", "3%"] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const FloatingAIChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const quickActions = useMemo(() => ["Leave policy", "Open ticket", "Update profile"], []);

  return (
    <div className="fixed z-40 bottom-4 right-4 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-[380px] rounded-lg border border-white/14 bg-[#07140F]/95 backdrop-blur-2xl shadow-2xl shadow-black/45 overflow-hidden"
            data-testid="floating-ai-chat-panel"
          >
            <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-display font-bold">ZenBot Assistant</div>
                  <div className="text-xs text-emerald-200 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 pulse-soft" />
                    Active now
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-white/45 hover:text-white text-sm">
                Close
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="rounded-lg bg-white/[0.055] border border-white/10 p-3 text-sm text-white/78">
                Hi, I can help with policies, leave, tickets, or profile guidance.
              </div>
              <div className="rounded-lg bg-[#D7FF7A]/12 border border-[#D7FF7A]/20 p-3 text-sm text-white">
                Try asking: "Which leave policy applies to me?"
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 text-white/45">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/50" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/50 [animation-delay:0.15s]" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/50 [animation-delay:0.3s]" />
              </div>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((item) => (
                  <button key={item} type="button" className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.07]">
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-2">
                <Input aria-label="Chat message" placeholder="Ask ZenBot..." className="h-9 border-0 bg-transparent text-sm focus-visible:ring-0" />
                <Button size="icon" className="h-9 w-9 rounded-lg bg-[#D7FF7A] text-[#07140F] hover:bg-[#e5ff9f]">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((value) => !value)}
        className="ml-auto h-14 px-5 rounded-lg bg-[#D7FF7A] text-[#07140F] shadow-[0_0_34px_rgba(215,255,122,0.35)] flex items-center gap-2 font-bold"
        data-testid="floating-ai-chat-button"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Ask ZenBot</span>
      </motion.button>
    </div>
  );
};

const SectionHeading: React.FC<{ eyebrow: string; title: string; subtitle: string }> = ({ eyebrow, title, subtitle }) => (
  <div className="max-w-3xl mx-auto text-center mb-12">
    <div className="text-xs text-[#FF6B5B] font-semibold uppercase mb-3">{eyebrow}</div>
    <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">{title}</h2>
    <p className="text-white/58 leading-relaxed">{subtitle}</p>
  </div>
);

const FeatureCard: React.FC<{ icon: any; color: string; t: string; d: string }> = ({ icon: Icon, color, t, d }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    className="md:col-span-2 rounded-lg bg-white/[0.03] border border-white/[0.08] p-6 hover:bg-white/[0.055] hover:border-white/15 transition card-tilt"
  >
    <div className="h-11 w-11 rounded-lg grid place-items-center mb-5" style={{ background: `${color}1A`, border: `1px solid ${color}33` }}>
      <Icon className="h-4 w-4" style={{ color }} />
    </div>
    <h3 className="font-display text-xl font-bold mb-2">{t}</h3>
    <p className="text-sm text-white/58 leading-relaxed">{d}</p>
  </motion.div>
);

const Footer: React.FC = () => (
  <footer className="relative px-4 sm:px-6 lg:px-10 py-8 border-t border-white/[0.06]">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
      <div>ZenBot Employee Assistant</div>
      <div className="flex items-center gap-4">
        <Link to="/help" className="hover:text-white/70">Help</Link>
        <span className="opacity-30">-</span>
        <span>Built for HR. Powered by your policies.</span>
      </div>
    </div>
  </footer>
);

export default LandingPage;
