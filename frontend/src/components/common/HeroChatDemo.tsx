import React, { useEffect, useRef, useState } from "react";
import { Send, Mic, MicOff, Sparkles, FileText, ArrowRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Msg {
  id: string;
  role: "user" | "assistant";
  text: string;
  citation?: { title: string; section?: string; page?: number };
  portals?: { label: string }[];
  streaming?: boolean;
}

const CANNED: Record<string, Omit<Msg, "id" | "role"> & { delay?: number }> = {
  leave: {
    text:
      "You have **4 casual leaves** and **8 earned leaves** remaining this quarter, per the India Leave Policy v3.2.",
    citation: { title: "India-Leave-v3.2.pdf", section: "§4.1", page: 12 },
    portals: [{ label: "Open Leave Portal" }, { label: "Download PDF" }],
  },
  wfh: {
    text:
      "Per the **2026 Hybrid Work Policy**, you can WFH up to **3 days/week** with manager approval. Full-remote requires a 30-day notice.",
    citation: { title: "Hybrid-Work-2026.pdf", section: "§2.3", page: 5 },
    portals: [{ label: "Request WFH" }],
  },
  payslip: {
    text: "Your last payslip is dated **27 Feb 2026**. Net credit: ₹1,82,430. Want me to email a copy?",
    citation: { title: "Payroll Calendar 2026.pdf", section: "Q1", page: 2 },
    portals: [{ label: "View payslips" }, { label: "Email me a copy" }],
  },
  fallback: {
    text:
      "Great question. I'd usually fetch this from your region's HR corpus via the RAG pipeline. Once your IT team plugs in the n8n webhook, you'll get a grounded, cited answer here in seconds.",
    citation: { title: "Sample · India Region", section: "demo", page: 1 },
  },
};

const pickCanned = (q: string) => {
  const s = q.toLowerCase();
  if (s.includes("leave") || s.includes("vacation") || s.includes("holiday")) return CANNED.leave;
  if (s.includes("wfh") || s.includes("remote") || s.includes("hybrid")) return CANNED.wfh;
  if (s.includes("payslip") || s.includes("salary") || s.includes("pay")) return CANNED.payslip;
  return CANNED.fallback;
};

export const HeroChatDemo: React.FC = () => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "u-seed",
      role: "user",
      text: "How many leaves do I have left this quarter?",
    },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  // Stream the seeded reply once on mount
  useEffect(() => {
    const reply = CANNED.leave;
    streamAssistant(reply.text, reply.citation, reply.portals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const streamAssistant = (
    text: string,
    citation?: Msg["citation"],
    portals?: Msg["portals"]
  ) => {
    const id = "a-" + Date.now();
    setMessages((m) => [...m, { id, role: "assistant", text: "", streaming: true, citation, portals }]);
    setBusy(true);
    let i = 0;
    const tick = () => {
      i += Math.max(1, Math.round(text.length / 50));
      setMessages((m) =>
        m.map((x) =>
          x.id === id ? { ...x, text: text.slice(0, i), streaming: i < text.length } : x
        )
      );
      if (i < text.length) setTimeout(tick, 22);
      else setBusy(false);
    };
    setTimeout(tick, 380);
  };

  const send = (override?: string) => {
    const q = (override ?? input).trim();
    if (!q || busy) return;
    const uid = "u-" + Date.now();
    setMessages((m) => [...m, { id: uid, role: "user", text: q }]);
    setInput("");
    const reply = pickCanned(q);
    setTimeout(() => streamAssistant(reply.text, reply.citation, reply.portals), 200);
  };

  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.onresult = (e: any) => setInput(Array.from(e.results).map((x: any) => x[0].transcript).join(""));
    r.onend = () => setListening(false);
    recRef.current = r;
    r.start();
    setListening(true);
  };

  const renderBold = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") ? (
        <strong key={i} className="font-semibold text-[#FF6B5B]">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    );

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl bg-[#0A0A1F]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden" data-testid="hero-chat-demo">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-xs font-semibold text-white">Zensar AI</div>
            <div className="text-[10px] text-white/45 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-soft" /> Live demo
            </div>
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-white/40">India · Leave</span>
      </div>

      {/* messages */}
      <div className="max-h-72 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((m) =>
            m.role === "user" ? (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
                data-testid={`demo-msg-user-${m.id}`}
              >
                <div className="bg-[#1A1A6B]/70 text-white text-sm rounded-2xl rounded-tr-sm px-3.5 py-2 max-w-[85%]">
                  {m.text}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-l-2 border-[#FF6B5B] pl-3.5"
                data-testid={`demo-msg-ai-${m.id}`}
              >
                <div className="text-sm text-white/90 leading-relaxed">
                  {renderBold(m.text)}
                  {m.streaming && (
                    <span className="inline-block ml-1 align-middle">
                      <span className="inline-block h-1 w-1 rounded-full bg-[#FF6B5B] typing-dot" />
                      <span
                        className="inline-block h-1 w-1 rounded-full bg-[#FF6B5B] typing-dot ml-1"
                        style={{ animationDelay: "0.18s" }}
                      />
                      <span
                        className="inline-block h-1 w-1 rounded-full bg-[#FF6B5B] typing-dot ml-1"
                        style={{ animationDelay: "0.36s" }}
                      />
                    </span>
                  )}
                </div>
                {!m.streaming && m.citation && (
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-white/55">
                    <FileText className="h-3 w-3" />
                    {m.citation.title}
                    {m.citation.section ? ` · ${m.citation.section}` : ""}
                    {m.citation.page ? ` · p.${m.citation.page}` : ""}
                  </div>
                )}
                {!m.streaming && m.portals && m.portals.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.portals.map((p, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[10px] bg-[#1A1A6B]/40 text-white/85 border border-[#1A1A6B]/60 rounded-full px-2 py-1"
                      >
                        {p.label} <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* quick suggestions */}
      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        {["WFH policy 2026", "My last payslip", "Parental leave"].map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            data-testid={`demo-quick-${s}`}
            className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/65 hover:text-white hover:bg-white/[0.08] transition"
          >
            {s}
          </button>
        ))}
      </div>

      {/* composer */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] px-2.5 py-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={listening ? "Listening…" : "Try: How do I claim relocation?"}
            data-testid="demo-input"
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/35 px-2"
          />
          <button
            onClick={toggleVoice}
            data-testid="demo-voice"
            className={`h-8 w-8 rounded-full grid place-items-center transition ${
              listening ? "bg-[#FF6B5B]/15 text-[#FF6B5B]" : "text-white/55 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            {listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => send()}
            disabled={!input.trim() || busy}
            data-testid="demo-send"
            className="h-8 px-3 rounded-full bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] text-white text-xs font-semibold hover:brightness-110 transition disabled:opacity-40 flex items-center gap-1"
          >
            Send <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
