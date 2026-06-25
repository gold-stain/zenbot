import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  ExternalLink,
  FileText,
  AlertCircle,
  Plus,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Markdown } from "@/components/common/Markdown";
import {
  createChatThread,
  listMessages,
  appendMessage,
  setMessageFeedback,
  createTicket,
} from "@/services/db";
import { askAssistant, getChatWebhookUrl } from "@/services/chat";
import { safe } from "@/services/safe";

interface Citation {
  title: string;
  section?: string;
  page?: number;
  url?: string;
}
interface PortalChip {
  label: string;
  url: string;
}
interface Message {
  id: string;
  author: "user" | "assistant";
  content: string;
  citations?: Citation[];
  portals?: PortalChip[];
  feedback?: "up" | "down" | null;
  followups?: string[];
  streaming?: boolean;
  persisted?: boolean;
}

const Chat: React.FC = () => {
  const { user, profile, regionId, role } = useAuth();
  const [params] = useSearchParams();
  const { threadId: routeThreadId } = useParams();
  const navigate = useNavigate();
  const presetQ = params.get("q") || "";

  const [threadId, setThreadId] = useState<string | null>(routeThreadId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(presetQ);
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsOn, setTtsOn] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load existing thread if visiting /app/chat/:threadId
  useEffect(() => {
    let mounted = true;
    if (routeThreadId) {
      setThreadId(routeThreadId);
      (async () => {
        const rows = await safe(() => listMessages(routeThreadId));
        if (mounted && rows) {
          setMessages(
            rows.map((m: any) => ({
              id: m.id,
              author: m.author,
              content: m.content,
              citations: m.citations || [],
              portals: m.portals || [],
              feedback: m.feedback || null,
              persisted: true,
            }))
          );
        }
      })();
    }
    return () => {
      mounted = false;
    };
  }, [routeThreadId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (presetQ && messages.length === 0 && !routeThreadId) {
      setTimeout(() => handleSend(presetQ), 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureThread = async (firstQuestion: string): Promise<string | null> => {
    if (threadId) return threadId;
    if (!user) return null;
    const t = await safe(() =>
      createChatThread(user.id, firstQuestion.slice(0, 60))
    );
    if (t?.id) {
      setThreadId(t.id);
      // soft-navigate without re-mount
      window.history.replaceState({}, "", `/app/chat/${t.id}`);
      return t.id;
    }
    return null;
  };

  const streamText = (full: string, msgId: string, onDone?: () => void) => {
    let i = 0;
    const tick = () => {
      i += Math.max(1, Math.round(full.length / 60));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? { ...m, content: full.slice(0, i), streaming: i < full.length }
            : m
        )
      );
      if (i < full.length) {
        setTimeout(tick, 25);
      } else {
        if (ttsOn) speak(full);
        onDone?.();
      }
    };
    tick();
  };

  const speak = (text: string) => {
    try {
      const u = new SpeechSynthesisUtterance(text.replace(/[*_`#>]/g, ""));
      u.rate = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  };

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || sending) return;
    setSending(true);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      author: "user",
      content: text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    const tid = await ensureThread(text);
    if (tid) await safe(() => appendMessage(tid, { author: "user", content: text }));

    try {
      const history = messages.map((m) => ({
        role: m.author as "user" | "assistant",
        content: m.content,
      }));
      const reply = await askAssistant({
        question: text,
        threadId: tid || undefined,
        history,
        userId: user?.id,
        regionId,
        role,
      });

      const aiMsgId = crypto.randomUUID();
      const aiMsg: Message = {
        id: aiMsgId,
        author: "assistant",
        content: "",
        citations: reply.citations || [],
        portals: reply.portals || [],
        followups: reply.followups || [],
        streaming: true,
      };
      setMessages((m) => [...m, aiMsg]);

      streamText(reply.answer, aiMsgId, async () => {
        if (tid) {
          await safe(() =>
            appendMessage(tid, {
              author: "assistant",
              content: reply.answer,
              citations: reply.citations || [],
              portals: reply.portals || [],
              confidence: reply.confidence,
            })
          );
        }
      });
    } catch (err: any) {
      toast.error(err?.message || "Assistant unavailable");
    } finally {
      setSending(false);
    }
  };

  const toggleVoice = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice input not supported in this browser");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      const t = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(t);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const setFeedback = async (id: string, f: "up" | "down") => {
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, feedback: f } : x)));
    const msg = messages.find((m) => m.id === id);
    if (msg?.persisted || threadId) {
      await safe(() => setMessageFeedback(id, f));
    }
  };

  const regenerate = (id: string) => {
    const idx = messages.findIndex((m) => m.id === id);
    if (idx <= 0) return;
    const prevUser = [...messages]
      .slice(0, idx)
      .reverse()
      .find((m) => m.author === "user");
    if (!prevUser) return;
    // Strip the old assistant message and re-ask
    setMessages((m) => m.slice(0, idx));
    handleSend(prevUser.content);
  };

  const escalate = async () => {
    if (!user) return;
    const lastUser = [...messages].reverse().find((m) => m.author === "user");
    const t = await safe(() =>
      createTicket({
        subject: lastUser?.content.slice(0, 120) || "Escalation from chat",
        description: messages.map((m) => `${m.author}: ${m.content}`).join("\n\n"),
        region_id: regionId,
        user_id: user.id,
        priority: "medium",
        thread_id: threadId,
      })
    );
    if (t) toast.success(`Ticket ${t.code || "created"} · routed to your regional HR queue`);
    else toast.success("Ticket created · routed to your regional HR queue");
  };

  const newChat = () => {
    setThreadId(null);
    setMessages([]);
    setInput("");
    navigate("/app/chat");
  };

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    profile?.email?.slice(0, 2).toUpperCase() ||
    "U";

  const liveWebhook = !!getChatWebhookUrl();

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)]" data-testid="chat-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shadow-lg shadow-[#FF6B5B]/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-display text-xl font-bold leading-tight">ZenBot</div>
            <div className="text-[11px] text-white/50 tracking-wide flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${liveWebhook ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
              {liveWebhook ? "Connected · region-scoped" : "Demo mode · configure webhook in Admin → System"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setTtsOn(!ttsOn)}
            data-testid="chat-tts-toggle"
            className={`text-white/70 hover:bg-white/5 ${ttsOn ? "text-[#FF6B5B]" : ""}`}
          >
            <Volume2 className="h-4 w-4 mr-1.5" />
            TTS {ttsOn ? "on" : "off"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={newChat}
            data-testid="chat-new"
            className="text-white/70 hover:bg-white/5"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New chat
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 space-y-6 pb-6">
        {messages.length === 0 && (
          <div className="h-full grid place-items-center" data-testid="chat-empty-state">
            <div className="text-center max-w-xl">
              <div className="h-16 w-16 mx-auto rounded-3xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shadow-2xl shadow-[#FF6B5B]/30 mb-6 animate-pulse-glow">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-display text-3xl font-bold mb-3">What's on your mind?</h2>
              <p className="text-white/50 mb-8">Try a quick question or just talk — I'll listen.</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "How do I apply for leave?",
                  "What's the WFH policy this quarter?",
                  "Show me the parental leave duration",
                  "Open the leave portal",
                ].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    data-testid={`chat-suggestion-${i}`}
                    className="text-left text-sm px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#FF6B5B]/40 hover:bg-white/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((m) =>
          m.author === "user" ? (
            <div key={m.id} className="flex justify-end animate-fade-up" data-testid={`msg-user-${m.id}`}>
              <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                <div className="bg-[#1A1A6B] rounded-2xl rounded-tr-sm px-5 py-3 shadow-md text-white">
                  {m.content}
                </div>
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10 grid place-items-center text-[10px] font-semibold shrink-0">
                  {initials}
                </div>
              </div>
            </div>
          ) : (
            <div key={m.id} className="animate-fade-up max-w-[92%]" data-testid={`msg-ai-${m.id}`}>
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] grid place-items-center shrink-0 mt-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex-1 border-l-2 border-[#FF6B5B] pl-4">
                  <div className="text-white/90">
                    {m.streaming ? (
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {m.content}
                        <span className="inline-block ml-1 align-middle">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6B5B] typing-dot" />
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6B5B] typing-dot ml-1" style={{ animationDelay: "0.18s" }} />
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6B5B] typing-dot ml-1" style={{ animationDelay: "0.36s" }} />
                        </span>
                      </div>
                    ) : (
                      <Markdown>{m.content}</Markdown>
                    )}
                  </div>

                  {!m.streaming && m.citations && m.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {m.citations.map((c, i) => (
                        <button
                          key={i}
                          data-testid={`msg-citation-${m.id}-${i}`}
                          className="inline-flex items-center gap-1.5 text-[11px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/70 hover:text-[#FF6B5B] hover:border-[#FF6B5B]/40 transition-all"
                        >
                          <FileText className="h-3 w-3" />
                          {c.title}
                          {c.section ? ` · ${c.section}` : ""}
                          {c.page ? ` · p.${c.page}` : ""}
                        </button>
                      ))}
                    </div>
                  )}

                  {!m.streaming && m.portals && m.portals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {m.portals.map((p, i) => (
                        <a
                          key={i}
                          href={p.url}
                          data-testid={`msg-portal-${m.id}-${i}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#1A1A6B]/40 text-[#FF8A7C] border border-[#1A1A6B]/60 rounded-lg px-3 py-1.5 hover:bg-[#1A1A6B]/60 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" /> {p.label}
                        </a>
                      ))}
                    </div>
                  )}

                  {!m.streaming && (
                    <div className="flex items-center gap-1 mt-4 text-white/40">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setFeedback(m.id, "up")}
                        data-testid={`msg-thumbup-${m.id}`}
                        className={`h-7 w-7 hover:text-emerald-400 hover:bg-white/5 ${m.feedback === "up" ? "text-emerald-400" : ""}`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setFeedback(m.id, "down")}
                        data-testid={`msg-thumbdown-${m.id}`}
                        className={`h-7 w-7 hover:text-rose-400 hover:bg-white/5 ${m.feedback === "down" ? "text-rose-400" : ""}`}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(m.content);
                          toast.success("Copied");
                        }}
                        data-testid={`msg-copy-${m.id}`}
                        className="h-7 w-7 hover:bg-white/5"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => regenerate(m.id)}
                        data-testid={`msg-regen-${m.id}`}
                        className="h-7 w-7 hover:bg-white/5"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={escalate}
                        data-testid={`msg-escalate-${m.id}`}
                        className="ml-auto h-7 px-2 text-[11px] text-white/50 hover:text-[#FF6B5B] hover:bg-white/5"
                      >
                        <UserCog className="h-3.5 w-3.5 mr-1" /> Talk to HR
                      </Button>
                    </div>
                  )}

                  {!m.streaming && m.followups && m.followups.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.followups.map((f, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(f)}
                          data-testid={`msg-followup-${m.id}-${i}`}
                          className="text-xs px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#FF6B5B]/40 hover:bg-white/5 transition-all text-white/70"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="sticky bottom-0">
        <div className="rounded-2xl bg-[#0B0B20]/90 backdrop-blur-xl border border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] p-2 flex items-center gap-1.5">
          <Badge className="ml-2 hidden sm:inline-flex bg-white/5 text-white/60 border border-white/10 text-[10px]">
            <AlertCircle className="h-3 w-3 mr-1" /> Region-scoped
          </Badge>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder={listening ? "Listening…" : "Ask anything about HR, policies, leave, payroll…"}
            data-testid="chat-input"
            className="flex-1 bg-transparent px-3 py-2.5 outline-none text-sm placeholder:text-white/30"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleVoice}
            data-testid="chat-voice-btn"
            className={`h-10 w-10 rounded-xl ${listening ? "text-[#FF6B5B] bg-[#FF6B5B]/10 animate-pulse-glow" : "text-white/60 hover:text-white hover:bg-white/5"}`}
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            data-testid="chat-send-btn"
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110 transition-all shadow-lg shadow-[#FF6B5B]/30 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-[10px] text-white/30 mt-2 text-center">
          Answers are scoped to your region · Press Enter to send · ⌘/Ctrl + K to focus
        </div>
      </div>
    </div>
  );
};

export default Chat;
