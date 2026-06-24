import React, { useEffect, useState } from "react";
import { ArrowRight, Mic, Sparkles, Command } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommandSpotlightProps {
  prompts?: string[];
  testId?: string;
}

/**
 * Centerpiece input — Raycast / ChatGPT vibe. Cycling placeholder, "/" pill,
 * voice button, and a glowing border that breathes.
 */
export const CommandSpotlight: React.FC<CommandSpotlightProps> = ({
  prompts = [
    "How do I apply for parental leave in the UK?",
    "What's the WFH policy for India this quarter?",
    "Show me my last 3 payslips",
    "Open the leave portal",
    "Talk to HR about my relocation",
  ],
  testId = "command-spotlight",
}) => {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [val, setVal] = useState("");
  const navigate = useNavigate();

  // Typewriter through prompts
  useEffect(() => {
    const target = prompts[idx % prompts.length];
    let i = 0;
    let timer: any;
    const tick = () => {
      i++;
      setTyped(target.slice(0, i));
      if (i < target.length) {
        timer = setTimeout(tick, 38);
      } else {
        timer = setTimeout(() => {
          // erase
          let j = target.length;
          const erase = () => {
            j--;
            setTyped(target.slice(0, j));
            if (j > 0) timer = setTimeout(erase, 18);
            else {
              setIdx((p) => p + 1);
            }
          };
          timer = setTimeout(erase, 1800);
        }, 0);
      }
    };
    tick();
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const submit = () => {
    const q = (val || typed).trim();
    if (!q) return;
    navigate(`/app/chat?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="spotlight-shell relative" data-testid={testId}>
      <div className="spotlight-glow" aria-hidden />
      <div className="spotlight-inner">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] uppercase tracking-[0.18em] text-white/60 shrink-0">
          <Sparkles className="h-3 w-3 text-[#FF6B5B]" /> ask
        </div>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={typed + (val ? "" : "▍")}
          data-testid="spotlight-input"
          className="flex-1 bg-transparent outline-none text-lg sm:text-xl text-white placeholder:text-white/40 font-display tracking-tight"
        />
        <button
          onClick={() => navigate("/app/chat?voice=1")}
          data-testid="spotlight-voice"
          className="h-10 w-10 rounded-full grid place-items-center text-white/70 hover:text-white hover:bg-white/[0.06] transition shrink-0"
          aria-label="Use voice"
        >
          <Mic className="h-4 w-4" />
        </button>
        <button
          onClick={submit}
          data-testid="spotlight-submit"
          className="h-10 px-5 rounded-full bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] text-white font-semibold text-sm hover:brightness-110 transition shrink-0 flex items-center gap-1.5 shadow-[0_0_24px_rgba(255,107,91,0.4)]"
        >
          Ask <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/35">
        <Command className="h-2.5 w-2.5" /> ⌘ + K · or speak naturally
      </div>
    </div>
  );
};
