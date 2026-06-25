import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getChatWebhookUrl, setChatWebhookUrl } from "@/services/chat";
import { getSetting, setSetting } from "@/services/db";
import { safe } from "@/services/safe";
import { useAuth } from "@/context/AuthContext";

const SystemSettings: React.FC = () => {
  const { user } = useAuth();
  const [model, setModel] = useState("gpt-4o-mini");
  const [temp, setTemp] = useState([0.4]);
  const [conf, setConf] = useState([0.65]);
  const [webhook, setWebhook] = useState(getChatWebhookUrl());
  const [brand, setBrand] = useState("ZenBot");

  useEffect(() => {
    (async () => {
      const v = await safe(() => getSetting("system"));
      if (v) {
        setModel(v.model || "gpt-4o-mini");
        setTemp([v.temperature ?? 0.4]);
        setConf([v.confidence_threshold ?? 0.65]);
        setBrand(v.brand_name || "ZenBot");
        if (v.chat_webhook_url) {
          setWebhook(v.chat_webhook_url);
          setChatWebhookUrl(v.chat_webhook_url);
        }
      }
    })();
  }, []);

  const onSave = async () => {
    setChatWebhookUrl(webhook);
    const payload = {
      model,
      temperature: temp[0],
      confidence_threshold: conf[0],
      brand_name: brand,
      chat_webhook_url: webhook,
    };
    if (user) {
      await safe(() => setSetting("system", payload, user.id));
    }
    toast.success("System settings saved");
  };

  return (
    <div data-testid="system-settings-page">
      <PageHeader eyebrow="Configuration" title="System settings" subtitle="Tune the model, the escalation threshold, and branding." />
      <div className="max-w-3xl space-y-5">
        <Section title="AI model">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>LLM model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="bg-white/5 border-white/10 mt-1.5" data-testid="sys-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT 4o mini</SelectItem>
                  <SelectItem value="gpt-5.2">GPT 5.2</SelectItem>
                  <SelectItem value="claude-sonnet-4.5">Claude Sonnet 4.5</SelectItem>
                  <SelectItem value="gemini-3-flash">Gemini 3 Flash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Temperature ({temp[0].toFixed(2)})</Label>
              <Slider value={temp} min={0} max={1} step={0.05} onValueChange={setTemp} className="mt-4" data-testid="sys-temp" />
            </div>
          </div>
          <div>
            <Label>Escalation confidence threshold ({(conf[0] * 100).toFixed(0)}%)</Label>
            <Slider value={conf} min={0.2} max={0.95} step={0.05} onValueChange={setConf} className="mt-4" data-testid="sys-conf" />
            <p className="text-xs text-white/40 mt-2">Below this confidence, the assistant offers "Talk to HR".</p>
          </div>
        </Section>

        <Section title="n8n webhook">
          <div>
            <Label>POST /chat webhook URL</Label>
            <Input value={webhook} onChange={(e) => setWebhook(e.target.value)} placeholder="https://n8n.zensar.com/webhook/chat" data-testid="sys-webhook" className="bg-white/5 border-white/10 mt-1.5" />
            <p className="text-xs text-white/40 mt-2">
              When set, the chat assistant POSTs <span className="font-mono">{`{ question, threadId, history, userId, regionId, role }`}</span> here. Expected response: <span className="font-mono">{`{ answer, citations?, portals?, followups?, confidence? }`}</span>.
            </p>
          </div>
        </Section>

        <Section title="Branding">
          <div>
            <Label>Display name</Label>
            <Input value={brand} onChange={(e) => setBrand(e.target.value)} data-testid="sys-brand" className="bg-white/5 border-white/10 mt-1.5" />
          </div>
        </Section>

        <div className="flex justify-end">
          <Button onClick={onSave} className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] rounded-xl px-6" data-testid="sys-save">Save settings</Button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
    <h3 className="font-display font-bold text-lg mb-5">{title}</h3>
    <div className="space-y-5">{children}</div>
  </div>
);

export default SystemSettings;
