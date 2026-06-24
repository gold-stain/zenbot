import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LifeBuoy, Mic, MessageSquare, ShieldCheck, ArrowUpRight } from "lucide-react";

const FAQS = [
  {
    q: "How do I ask the assistant a question?",
    a: "Open Assistant from the sidebar, type or press the mic button, then hit Send. You can also start a chat from any quick action on the dashboard.",
  },
  {
    q: "How do voice features work?",
    a: "We use your browser's native Web Speech API for push-to-talk. Text-to-speech can be toggled in Settings. Speed and voice are configurable.",
  },
  {
    q: "Why don't I see policies for other countries?",
    a: "Answers and policies are scoped to your region for privacy and compliance. Global policies are always available.",
  },
  {
    q: "Where do I see my tickets?",
    a: "Go to My Tickets in the sidebar. You'll see status, priority and the HR person assigned (if any).",
  },
  {
    q: "How do I change my region?",
    a: "Region is locked at signup. Contact an Admin to change it.",
  },
];

const Help: React.FC = () => (
  <div data-testid="help-page">
    <PageHeader eyebrow="Support" title="Help & FAQ" subtitle="Quick tips and answers to common questions." />
    <div className="grid lg:grid-cols-3 gap-5 mb-8">
      {[
        { icon: MessageSquare, t: "Start a chat", d: "Type or speak. Citations appear automatically." },
        { icon: Mic, t: "Use your voice", d: "Press the mic, talk naturally, then send." },
        { icon: ShieldCheck, t: "Region-scoped", d: "Answers always respect your region." },
      ].map((c) => (
        <div key={c.t} className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6" data-testid={`help-card-${c.t}`}>
          <c.icon className="h-7 w-7 text-[#FF6B5B] mb-3" />
          <div className="font-display font-bold mb-1">{c.t}</div>
          <div className="text-sm text-white/60">{c.d}</div>
        </div>
      ))}
    </div>

    <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6 max-w-3xl">
      <h3 className="font-display font-bold text-lg mb-4">Frequently asked</h3>
      <Accordion type="single" collapsible>
        {FAQS.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-white/5">
            <AccordionTrigger data-testid={`faq-q-${i}`} className="text-left font-medium hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-white/70 leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <div className="flex items-center gap-3">
          <LifeBuoy className="h-5 w-5 text-[#FF6B5B]" />
          <span className="text-sm">Need a human? Raise a ticket from any chat reply.</span>
        </div>
        <ArrowUpRight className="h-4 w-4 text-white/40" />
      </div>
    </div>
  </div>
);

export default Help;
