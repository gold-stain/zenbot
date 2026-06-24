import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageSquare,
  Globe2,
  Shield,
  Mic,
  Sparkles,
  FileSearch,
  Users,
  Zap,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";

const LandingPage: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const [demoQ, setDemoQ] = useState("");
  const examples = [
    "How do I apply for parental leave in the UK?",
    "What's the WFH policy in India for 2026?",
    "Show me the payroll calendar for South Africa.",
    "Open the leave portal.",
  ];

  return (
    <PublicLayout>
      {/* HERO — Zensar-style bold left-aligned */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 mb-7" data-testid="hero-pill">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B5B] animate-pulse" />
              Now serving 9 regions · Powered by your own policies
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl 3xl:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6">
              The HR <br className="hidden sm:block" />
              answer engine,
              <br />
              <span className="text-gradient-brand">
                built for every Zensari.
              </span>
            </h1>

            <p className="text-lg text-zinc-600 max-w-xl mb-9 leading-relaxed">
              Ask in your own words. Get the right policy, with the right
              citation, scoped to your region. Speak it. Read it. Escalate to a
              human when it matters.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/sign-up">
                <Button
                  size="lg"
                  data-testid="hero-cta-signup"
                  className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110 transition-all shadow-lg shadow-[#FF6B5B]/30 rounded-full h-12 px-7 text-base font-semibold"
                >
                  Get started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  data-testid="hero-cta-signin"
                  className="rounded-full h-12 px-7 text-base font-semibold border-2 border-zinc-200 text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300"
                >
                  Sign in
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-zinc-500 ml-2">
                <PlayCircle className="h-4 w-4" />
                Watch 60-sec intro
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#1A1A6B]" />
                Region-scoped answers
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#1A1A6B]" />
                Voice in & out
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#1A1A6B]" />
                Source citations
              </div>
            </div>
          </div>

          {/* Visual chat preview */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#FF6B5B]/20 via-[#E11D2C]/10 to-[#1A1A6B]/20 blur-2xl rounded-3xl" />
              <div className="relative rounded-3xl bg-[#050514] text-white p-6 shadow-2xl border border-white/10 grain">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-xs font-medium tracking-wide">Zensar AI</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">Live demo</span>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-end">
                    <div className="bg-[#1A1A6B] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] shadow-md">
                      How many casual leaves do I have left this quarter?
                    </div>
                  </div>
                  <div className="border-l-2 border-[#FF6B5B] pl-4 max-w-[92%]">
                    <div className="text-white/90 leading-relaxed">
                      You have <span className="font-semibold text-[#FF6B5B]">4 casual leaves</span> remaining in Q1 2026, per the
                      <span className="text-white"> India Leave Policy v3.2</span>.
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 text-[10px] bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-white/70">
                        <FileSearch className="h-3 w-3" /> India-Leave-v3.2.pdf · §4.1
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] bg-[#1A1A6B]/40 border border-[#1A1A6B]/60 rounded-full px-2.5 py-1 text-white/90">
                        <ArrowRight className="h-3 w-3" /> Open Leave Portal
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B5B] typing-dot" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B5B] typing-dot" style={{ animationDelay: "0.18s" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B5B] typing-dot" style={{ animationDelay: "0.36s" }} />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                  <input
                    aria-label="demo chat input"
                    placeholder={examples[demoQ.length % examples.length] || "Ask anything…"}
                    value={demoQ}
                    onChange={(e) => setDemoQ(e.target.value)}
                    data-testid="hero-demo-input"
                    className="bg-transparent outline-none flex-1 text-sm placeholder:text-white/30"
                  />
                  <button className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center hover:scale-105 transition-transform">
                    <Mic className="h-3.5 w-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars — direct nod to Zensar's "Our experience pillars" */}
      <section className="bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-14">
            Our experience pillars
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                color: "bg-[#1A1A6B]",
                shape: "rounded-full",
                title: "Region-first",
                desc: "Every answer is scoped to your region. India, UK, USA, ZA, Austria, Singapore, Canada, Ireland — plus Global.",
              },
              {
                color: "bg-[#FF6B5B]",
                shape: "rounded-tl-[2rem]",
                clip: "clip-triangle",
                title: "Voice-native",
                desc: "Push to talk. Listen back. Configure voice and speed. Built for hybrid workplaces in motion.",
              },
              {
                color: "bg-[#E11D2C]",
                shape: "rounded-r-[3rem]",
                title: "Always cited",
                desc: "Every reply ships with the source policy, section, page number and a one-tap download.",
              },
              {
                color: "bg-[#1A1A6B]",
                shape: "rounded-bl-[2rem]",
                title: "Human-handover",
                desc: "Stuck? Talk to HR. The bot routes your ticket to the right regional mailbox with full context.",
              },
            ].map((p, i) => (
              <div key={i} data-testid={`pillar-${i}`}>
                <div className={`h-16 w-16 ${p.color} ${p.shape} mb-6`} />
                <h3 className="font-display text-xl font-bold mb-3">{p.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features bento */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-6 gap-5">
          <div className="md:col-span-4 rounded-3xl bg-[#050514] text-white p-10 relative overflow-hidden grain">
            <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-[#FF6B5B]/20 blur-3xl" />
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FF6B5B] mb-4">
                <Sparkles className="h-3 w-3" /> AI ASSISTANT
              </div>
              <h3 className="font-display text-3xl font-bold mb-3">
                A chat that knows HR — and your HR.
              </h3>
              <p className="text-white/60 leading-relaxed">
                Streaming responses. Multi-turn memory. Smart follow-ups.
                Thumbs up/down feedback. Regenerate. Citations on tap.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 rounded-3xl bg-white border border-zinc-100 p-8 shadow-sm">
            <Mic className="h-8 w-8 text-[#FF6B5B] mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">Voice in & out</h3>
            <p className="text-zinc-600 text-sm">
              Push-to-talk via Web Speech. TTS playback with voice/speed
              presets. Auto-stop on silence.
            </p>
          </div>
          <div className="md:col-span-2 rounded-3xl bg-white border border-zinc-100 p-8 shadow-sm">
            <Globe2 className="h-8 w-8 text-[#1A1A6B] mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">9 Regions</h3>
            <p className="text-zinc-600 text-sm">
              India · USA · UK · South Africa · Austria · Singapore · Canada
              · Ireland · Global.
            </p>
          </div>
          <div className="md:col-span-2 rounded-3xl bg-white border border-zinc-100 p-8 shadow-sm">
            <Shield className="h-8 w-8 text-[#E11D2C] mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">RLS-secured</h3>
            <p className="text-zinc-600 text-sm">
              Row-level security per region. Three roles. Audit-logged.
              GDPR-friendly.
            </p>
          </div>
          <div className="md:col-span-2 rounded-3xl bg-[#1A1A6B] text-white p-8 relative overflow-hidden">
            <Users className="h-8 w-8 text-[#FF6B5B] mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">HR handover</h3>
            <p className="text-white/70 text-sm">
              Tickets routed to your regional mailbox with full chat context
              and SLA tracking.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-[#1A1A6B] via-[#1A1A6B] to-[#0F0F4A] p-12 lg:p-16 text-white relative overflow-hidden">
          <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-[#FF6B5B]/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-[#E11D2C]/10 blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                Ready when your people are.
              </h2>
              <p className="text-white/70 text-base">
                Sign up in 60 seconds. Region is detected automatically. Your
                IT team can finish the n8n + Supabase setup behind the scenes.
              </p>
            </div>
            <Link to="/sign-up">
              <Button
                size="lg"
                data-testid="cta-bottom-signup"
                className="bg-white text-[#1A1A6B] hover:bg-white/90 rounded-full h-12 px-7 text-base font-bold shadow-lg"
              >
                Create your account <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;
