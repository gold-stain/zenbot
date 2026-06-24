import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Mic, Sparkles, Globe2, Shield, ShieldCheck,
  Zap, Radio, Activity, MessageSquare, Cpu, Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIOrb } from "@/components/common/AIOrb";
import { MeshBackground } from "@/components/common/MeshBackground";
import { Particles } from "@/components/common/Particles";

const LandingPage: React.FC = () => {
  // Landing is its own dark world — opt in for this page only
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => { document.documentElement.classList.remove("dark"); };
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden max-w-[100vw]">
      <MeshBackground variant="marketing" />

      {/* NAV */}
      <header className="relative z-20 px-6 lg:px-10 4xl:px-16 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" data-testid="public-logo">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shadow-[0_0_24px_rgba(255,107,91,0.45)]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-extrabold tracking-tight text-white">Zensar AI</div>
            <div className="text-[9px] uppercase tracking-[0.24em] text-white/45">Employee Assistant · v1</div>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] uppercase tracking-[0.24em] text-white/55 font-mono">
          <Radio className="h-2.5 w-2.5 text-[#FF6B5B] pulse-soft" /> assistant online
        </div>
        <div className="flex items-center gap-2">
          <Link to="/sign-in">
            <Button variant="ghost" size="sm" data-testid="header-signin-btn" className="text-white/80 hover:text-white hover:bg-white/[0.06]">Sign in</Button>
          </Link>
          <Link to="/sign-up">
            <Button size="sm" data-testid="header-signup-btn"
              className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110 transition rounded-full px-5 shadow-[0_0_18px_rgba(255,107,91,0.35)]">
              Get started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO — orb centerpiece + asymmetric headline */}
      <section className="relative px-6 lg:px-10 4xl:px-16 pt-10 lg:pt-16 pb-24 lg:pb-32">
        <Particles count={40} />

        <div className="hidden lg:flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-white/30 font-mono mb-12">
          <div>region · global · rls active</div>
          <div className="flex items-center gap-6">
            <span>3 roles</span>
            <span className="text-white/15">·</span>
            <span>9 regions</span>
            <span className="text-white/15">·</span>
            <span className="text-[#FF6B5B]">∞ conversations</span>
          </div>
        </div>

        <div className="relative grid lg:grid-cols-[1fr,auto,1fr] items-center gap-8 lg:gap-16 max-w-[1600px] mx-auto">
          {/* left text */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="lg:text-right space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[10px] uppercase tracking-[0.22em] text-white/65" data-testid="hero-pill">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B5B] pulse-soft" />
              Your HR. Trained on your policies.
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl 3xl:text-8xl font-extrabold tracking-tight leading-[0.95]">
              <span className="block text-white/95">An HR brain,</span>
              <span className="block text-gradient-aurora">that knows yours.</span>
            </h1>
            <p className="text-base lg:text-lg text-white/55 lg:max-w-md lg:ml-auto leading-relaxed">
              Speak it. Type it. Ask anything — from <span className="text-white/90">"how many leaves do I have"</span> to <span className="text-white/90">"what's my relocation cap in Ireland"</span>. Every answer cited. Every reply region-scoped. Every escalation routed to the right human.
            </p>
            <div className="flex flex-wrap lg:justify-end items-center gap-3">
              <Link to="/sign-up">
                <Button size="lg" data-testid="hero-cta-signup"
                  className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110 transition rounded-full h-12 px-7 text-base font-semibold shadow-[0_0_32px_rgba(255,107,91,0.45)]">
                  Get started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/sign-in">
                <Button size="lg" variant="ghost" data-testid="hero-cta-signin"
                  className="rounded-full h-12 px-7 text-base font-semibold border border-white/15 text-white/85 hover:bg-white/[0.06] hover:border-white/30">
                  Sign in
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* center: ORB */}
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 0.84, 0.44, 1] }}
            className="relative mx-auto z-10">
            <AIOrb size={420} />
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="absolute -bottom-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-[0.24em] text-white/70 font-mono">
                <Waves className="h-3 w-3 text-[#FF6B5B] pulse-soft" /> listening
              </div>
            </div>
          </motion.div>

          {/* right: floating capability cards */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="relative z-10 space-y-3">
            <FloatCard icon={Mic}        title="Voice-native"     hint="Push to talk · TTS" delay={0} />
            <FloatCard icon={Globe2}     title="Region-aware"     hint="9 regions + Global" delay={0.08} />
            <FloatCard icon={ShieldCheck} title="Source-cited"     hint="Policy · §section · page" delay={0.16} />
            <FloatCard icon={MessageSquare} title="Human escalation" hint="One tap → regional HR" delay={0.24} />
          </motion.div>
        </div>
      </section>

      {/* STREAM RIBBON — sample query streaming */}
      <section className="relative px-6 lg:px-10 py-16">
        <div className="max-w-5xl mx-auto holo-border rounded-3xl bg-ink-card/70 backdrop-blur-md p-8 lg:p-10 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF6B5B] pulse-soft" />
              <span className="text-[10px] uppercase tracking-[0.28em] text-white/45 font-mono">stream · demo</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.28em] text-white/30 font-mono">india · leave</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="bg-[#1A1A6B]/60 rounded-2xl rounded-tr-sm px-5 py-3 text-sm text-white max-w-[80%]">
                How many casual leaves do I have left this quarter?
              </div>
            </div>
            <div className="border-l-2 border-[#FF6B5B] pl-5 max-w-[92%]">
              <div className="text-white/90 leading-relaxed">
                You have <span className="font-semibold text-[#FF6B5B]">4 casual leaves</span> remaining in Q1 2026, per the <span className="text-white">India Leave Policy v3.2</span> — section 4.1.
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/70 font-mono">India-Leave-v3.2.pdf · §4.1 · p.12</span>
                <span className="inline-flex items-center gap-1.5 text-[10px] bg-[#1A1A6B]/40 border border-[#1A1A6B]/60 rounded-full px-3 py-1 text-white/85 font-mono"><ArrowRight className="h-2.5 w-2.5" /> Open Leave Portal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS — keep Zensar identity but dark */}
      <section className="relative px-6 lg:px-10 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.32em] text-[#FF6B5B] font-mono mb-3">design principles</div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-16">Built on four pillars.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { color: "#FF6B5B", shape: "rounded-full",          title: "People-first",     desc: "Voice, citations, follow-ups. Designed for humans first, models second." },
              { color: "#6366F1", shape: "rounded-tl-[3rem]",     title: "Region-aware",     desc: "Every answer scoped to your region. RLS at the database. Zero leakage." },
              { color: "#E11D2C", shape: "rounded-r-[3rem]",      title: "Always cited",     desc: "Policy name. Section. Page. One-tap download. Confidence on every reply." },
              { color: "#1A1A6B", shape: "rounded-bl-[2.5rem]",    title: "Human handover",   desc: "Low confidence → graceful escalation to the right regional HR." },
            ].map((p, i) => (
              <motion.div key={p.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }} transition={{ delay: i * 0.08, duration: 0.6 }}
                data-testid={`pillar-${i}`}
                className="holo-border rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition">
                <div className={`h-12 w-12 mb-6 ${p.shape}`} style={{ background: p.color, boxShadow: `0 0 24px ${p.color}55` }} />
                <h3 className="font-display text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 lg:px-10 pb-24">
        <div className="max-w-5xl mx-auto rounded-3xl p-12 lg:p-16 relative overflow-hidden holo-border border border-white/[0.06]"
             style={{ background: "linear-gradient(135deg, #0A0A1F 0%, #12123A 100%)" }}>
          <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-[#FF6B5B]/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-[#6366F1]/15 blur-3xl" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#FF6B5B] font-mono mb-4">ready</div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">
                Plug it in. Light it up.
              </h2>
              <p className="text-white/60 max-w-md">
                Sign up, point it at your n8n RAG pipeline, and the assistant goes live across all 9 regions. 60-second onboarding.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { icon: Cpu, t: "Connect n8n webhook" },
                { icon: Shield, t: "Apply Supabase RLS migration" },
                { icon: Zap, t: "Onboard your first 100 employees" },
              ].map((s, i) => (
                <div key={s.t} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <span className="font-mono text-[10px] text-white/40 w-6">{String(i + 1).padStart(2, "0")}</span>
                  <s.icon className="h-4 w-4 text-[#FF6B5B]" />
                  <span className="text-sm text-white/85">{s.t}</span>
                </div>
              ))}
              <Link to="/sign-up" className="mt-2">
                <Button size="lg" data-testid="cta-bottom-signup"
                  className="w-full rounded-full h-12 bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white font-bold shadow-[0_0_32px_rgba(255,107,91,0.45)]">
                  Create your account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative px-6 lg:px-10 py-8 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div>© {new Date().getFullYear()} Zensar AI Employee Assistant</div>
          <div className="flex items-center gap-5 font-mono uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5"><Activity className="h-3 w-3 text-emerald-400" /> rls</span>
            <span className="flex items-center gap-1.5"><Globe2 className="h-3 w-3" /> 9 regions</span>
            <span className="flex items-center gap-1.5"><Mic className="h-3 w-3" /> voice</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FloatCard: React.FC<{ icon: any; title: string; hint: string; delay: number }> = ({ icon: Icon, title, hint, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + delay }}
    whileHover={{ x: -4 }}
    className="holo-border flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
    <div className="h-9 w-9 rounded-lg grid place-items-center" style={{ background: "linear-gradient(135deg, rgba(255,107,91,0.18), rgba(255,107,91,0.04))", border: "1px solid rgba(255,107,91,0.25)" }}>
      <Icon className="h-4 w-4 text-[#FF6B5B]" />
    </div>
    <div className="min-w-0">
      <div className="text-sm font-medium leading-tight">{title}</div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 font-mono mt-0.5">{hint}</div>
    </div>
  </motion.div>
);

export default LandingPage;
