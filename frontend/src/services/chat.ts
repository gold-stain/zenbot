/**
 * Wraps the chat call. If a webhook URL is configured (via Settings or env),
 * forward the request there. Otherwise emit a mocked answer.
 */
const STORAGE_KEY = "zensar.chatWebhookUrl";

export function getChatWebhookUrl(): string {
  return localStorage.getItem(STORAGE_KEY) || (process.env.REACT_APP_N8N_CHAT_WEBHOOK as string) || "";
}

export function setChatWebhookUrl(url: string) {
  localStorage.setItem(STORAGE_KEY, url);
}

export interface ChatRequest {
  question: string;
  threadId?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  userId?: string;
  regionId?: string | null;
  role?: string | null;
}

export interface ChatResponse {
  answer: string;
  citations?: Array<{ title: string; section?: string; page?: number; url?: string }>;
  portals?: Array<{ label: string; url: string }>;
  followups?: string[];
  confidence?: number;
}

const MOCK_ANSWERS = [
  "I'd usually fetch this from your region's policy corpus via the n8n RAG pipeline. Connect a webhook in **Admin → System Settings** to enable real answers.",
  "Here's a sample response. Configure the n8n `/chat` webhook to start serving real, region-scoped answers from your policy corpus.",
  "Sample reply: once your n8n pipeline is live, this will be grounded in the policies tagged for your region (plus Global).",
];

export async function askAssistant(req: ChatRequest): Promise<ChatResponse> {
  const url = getChatWebhookUrl();
  if (url) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      throw new Error(`Webhook returned ${res.status}`);
    }
    const data = await res.json();
    return {
      answer: data.answer || data.response || data.message || "(empty response)",
      citations: data.citations || [],
      portals: data.portals || [],
      followups: data.followups || [],
      confidence: data.confidence,
    };
  }
  // Mocked path
  await new Promise((r) => setTimeout(r, 600));
  return {
    answer:
      MOCK_ANSWERS[Math.floor(Math.random() * MOCK_ANSWERS.length)] +
      `\n\nYou asked: *"${req.question}"*`,
    citations: [
      { title: "India-HR-Policy", section: "§4.1 Casual Leave", page: 12 },
      { title: "Global-Code-of-Conduct", section: "Appendix B", page: 3 },
    ],
    portals: [
      { label: "Open Leave Portal", url: "#" },
      { label: "View Payslip", url: "#" },
    ],
    followups: [
      "How do I cancel a pending leave?",
      "What's the parental leave duration?",
      "Show me the policy PDF",
    ],
    confidence: 0.78,
  };
}
