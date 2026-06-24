import React, { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Mic, Sparkles, Globe2, ShieldCheck,
  MessageSquare, FileText, Users, Clock, Zap, Volume2, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIOrb } from "@/components/common/AIOrb";
import { MeshBackground } from "@/components/common/MeshBackground";
import { HeroChatDemo } from "@/components/common/HeroChatDemo";

const LandingPage: React.FC = () => {
  useLayoutEffect(() => {
    document.documentElement.classList.add("dark");
    return () => { document.documentElement.classList.remove("dark"); };
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden max-w-[100vw]">
      <MeshBackground variant="marketing" />

      {/* NAV */}
      <header className="sticky top-0 z-30 px-6 lg:px-10 4xl:px-16 py-4 flex items-center justify-between bg-[#03030A]/70 backdrop-blur-xl border-b border-white/[0.05]">
        <Link to="/" className="flex items-center gap-2.5" data-testid="public-logo">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shadow-[0_0_24px_rgba(255,107,91,0.45)]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-extrabold tracking-tight text-white">Zensar AI</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">Employee Assistant</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm" data-testid="header-nav">
          <a href="#capabilities" data-testid="nav-capabilities"
            className="px-3 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/[0.05] transition">Capabilities</a>
          <a href="#how-it-works" data-testid="nav-how"
            className="px-3 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/[0.05] transition">How it works</a>
          <a href="#pillars" data-testid="nav-pillars"
            className="px-3 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/[0.05] transition">Pillars</a>
          <a href="#try-it" data-testid="nav-try"
            className="px-3 py-2 rounded-full text-[#FF6B5B] font-medium hover:bg-white/[0.05] transition flex items-center gap-1">
            Try it <ArrowRight className="h-3 w-3" />
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/sign-in">
            <Button variant="ghost" size="sm" data-testid="header-signin-btn"
              className="text-white/80 hover:text-white hover:bg-white/[0.06]">Sign in</Button>
          </Link>
          <Link to="/sign-up">
            <Button size="sm" data-testid="header-signup-btn"
              className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110 transition rounded-full px-5 shadow-[0_0_18px_rgba(255,107,91,0.35)]">
              Get started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO — orb + clear value prop + obvious CTAs */}
      <section className="relative px-6 lg:px-10 4xl:px-16 pt-12 lg:pt-20 pb-20 lg:pb-28">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 items-center gap-12 lg:gap-16">
          {/* Left: headline + value */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-white/75 mb-6" data-testid="hero-pill">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B5B] pulse-soft" />
              Region-aware · Voice-enabled · Cited
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl 3xl:text-7xl font-extrabold tracking-tight leading-[1.04] mb-5">
              Your HR questions,
              <br />
              <span className="text-gradient-aurora">answered in seconds.</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Ask anything — leaves, payroll, benefits, policies. The assistant pulls answers from your region's HR corpus, cites the source, and routes you to a human when it matters.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
              <Link to="/sign-up">
                <Button size="lg" data-testid="hero-cta-signup"
                  className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110 transition rounded-full h-12 px-7 text-base font-semibold shadow-[0_0_28px_rgba(255,107,91,0.4)]">
                  Get started free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/sign-in">
                <Button size="lg" variant="ghost" data-testid="hero-cta-signin"
                  className="rounded-full h-12 px-7 text-base font-semibold border border-white/15 text-white/85 hover:bg-white/[0.06] hover:border-white/30">
                  Sign in
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-5 gap-y-2 mt-7 text-sm text-white/45">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Source-cited</span>
              <span className="flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5 text-[#6366F1]" /> 9 regions</span>
              <span className="flex items-center gap-1.5"><Mic className="h-3.5 w-3.5 text-[#FF6B5B]" /> Voice in & out</span>
            </div>
          </motion.div>

          {/* Right: Orb + LIVE chat demo under it */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.16, 0.84, 0.44, 1] }}
            className="relative order-1 lg:order-2" id="try-it">
            <div className="mx-auto" style={{ maxWidth: 360 }}>
              <AIOrb size={300} />
            </div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
              className="-mt-4">
              <HeroChatDemo />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS — 3 simple steps */}
      <section id="how-it-works" className="relative px-6 lg:px-10 py-16 lg:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs text-[#FF6B5B] font-semibold uppercase tracking-[0.2em] mb-3">How it works</div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Three steps to an answer.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {[
              { n: "01", icon: MessageSquare, color: "#FF6B5B", t: "Ask in your words",
                d: "Type or speak naturally. No special syntax. Multi-turn follow-ups remembered." },
              { n: "02", icon: BookOpen, color: "#6366F1", t: "Cited from your corpus",
                d: "Every answer points to the exact policy, section and page — scoped to your region." },
              { n: "03", icon: Users, color: "#E11D2C", t: "Human when needed",
                d: "Low confidence? Tap 'Talk to HR' — your regional team picks up with full context." },
            ].map((s, i) => (
              <motion.div key={s.n}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="rounded-2xl p-7 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15 transition">
                <div className="flex items-center justify-between mb-5">
                  <div className="h-11 w-11 rounded-xl grid place-items-center"
                    style={{ background: `${s.color}1A`, border: `1px solid ${s.color}40` }}>
                    <s.icon className="h-5 w-5" style={{ color: s.color }} />
                  </div>
                  <span className="font-display text-2xl font-extrabold text-white/15">{s.n}</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{s.t}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES — bento, less chrome, more clarity */}
      <section id="capabilities" className="relative px-6 lg:px-10 py-16 lg:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs text-[#FF6B5B] font-semibold uppercase tracking-[0.2em] mb-3">What's inside</div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Designed for daily HR life.</h2>
          </div>

          <div className="grid md:grid-cols-6 gap-4 lg:gap-5">
            <div className="md:col-span-4 rounded-3xl bg-gradient-to-br from-[#0A0A1F] via-[#0E0E2A] to-[#12123A] border border-white/[0.06] p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#FF6B5B]/15 blur-3xl" />
              <div className="relative z-10 max-w-md">
                <div className="text-xs text-[#FF6B5B] font-semibold uppercase tracking-[0.2em] mb-3">AI assistant</div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold mb-3">A chat that knows HR — and your HR.</h3>
                <p className="text-white/55 leading-relaxed">
                  Streaming responses, multi-turn memory, smart follow-ups, thumbs feedback and one-tap regenerate. Every reply ships with citations.
                </p>
              </div>
            </div>
            <FeatureCard icon={Volume2} color="#FF6B5B" t="Voice in & out" d="Push-to-talk. TTS playback with voice and speed presets." />
            <FeatureCard icon={Globe2} color="#6366F1" t="9 regions" d="India · USA · UK · ZA · AT · SG · CA · IE · Global." />
            <FeatureCard icon={ShieldCheck} color="#E11D2C" t="RLS-secured" d="Row-level security per region. Audit-logged. GDPR-friendly." />
            <FeatureCard icon={Users} color="#10B981" t="HR handover" d="One-tap escalation to your regional mailbox with full context." />
            <div className="md:col-span-2 rounded-3xl p-8 bg-[#1A1A6B] border border-white/[0.06] relative overflow-hidden">
              <Clock className="h-8 w-8 text-[#FF6B5B] mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">Always on, always learning</h3>
              <p className="text-white/65 text-sm">
                Low-confidence answers turn into knowledge gaps — your admin fixes them with a single upload.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR EXPERIENCE PILLARS — Zensar identity beat */}
      <section id="pillars" className="relative px-6 lg:px-10 py-16 lg:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs text-[#FF6B5B] font-semibold uppercase tracking-[0.2em] mb-3">Principles</div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Our experience pillars.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { color: "#1A1A6B", shape: "rounded-full",          title: "Put people first",       desc: "Designed around the employee — accessible, friendly, fast." },
              { color: "#FF6B5B", shape: "rounded-tl-[2rem]",     title: "Embrace the unexpected", desc: "Adapts to new policies, new regions and new questions." },
              { color: "#E11D2C", shape: "rounded-r-[2.5rem]",    title: "Solve together",         desc: "Bridges employees, HR and admins in a single workflow." },
              { color: "#6366F1", shape: "rounded-bl-[2rem]",     title: "Take charge of success", desc: "Frees HR from repetitive queries — focus on higher-value work." },
            ].map((p, i) => (
              <motion.div key={p.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.08, duration: 0.6 }}
                data-testid={`pillar-${i}`}
                className="rounded-2xl p-6 bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15 transition">
                <div className={`h-12 w-12 mb-5 ${p.shape}`}
                  style={{ background: p.color, boxShadow: `0 0 24px ${p.color}55` }} />
                <h3 className="font-display text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 lg:px-10 py-20">
        <div className="max-w-4xl mx-auto rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden border border-white/[0.06]"
          style={{ background: "linear-gradient(135deg, #0A0A1F 0%, #12123A 100%)" }}>
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-[#FF6B5B]/20 blur-3xl" />
          <div className="relative z-10">
            <div className="text-xs text-[#FF6B5B] font-semibold uppercase tracking-[0.2em] mb-3">Get started</div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              60 seconds to your first answer.
            </h2>
            <p className="text-white/60 max-w-lg mx-auto mb-7">
              Create your account, confirm your region, and start asking. Your IT team can plug the n8n RAG pipeline behind the scenes — you don't have to wait.
            </p>
            <Link to="/sign-up">
              <Button size="lg" data-testid="cta-bottom-signup"
                className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110 rounded-full h-12 px-8 text-base font-bold shadow-[0_0_32px_rgba(255,107,91,0.45)]">
                Create your account <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative px-6 lg:px-10 py-8 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div>© {new Date().getFullYear()} Zensar AI Employee Assistant</div>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:text-white/70">Help</Link>
            <span className="opacity-30">·</span>
            <span>Built for HR. Powered by your policies.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: any; color: string; t: string; d: string }> = ({ icon: Icon, color, t, d }) => (
  <div className="md:col-span-2 rounded-3xl bg-white/[0.025] border border-white/[0.06] p-6 hover:bg-white/[0.05] hover:border-white/15 transition">
    <div className="h-10 w-10 rounded-xl grid place-items-center mb-4"
      style={{ background: `${color}1A`, border: `1px solid ${color}33` }}>
      <Icon className="h-4 w-4" style={{ color }} />
    </div>
    <h3 className="font-display text-lg font-bold mb-1.5">{t}</h3>
    <p className="text-sm text-white/55 leading-relaxed">{d}</p>
  </div>
);

export default LandingPage;
