import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppTheme } from "@/hooks/useAppTheme";

const STORAGE_KEY = "zensar.prefs";

interface Prefs {
  tts: boolean;
  voice: string;
  speed: number;
  lang: string;
  emailNotif: boolean;
  pushNotif: boolean;
}

const DEFAULTS: Prefs = {
  tts: true,
  voice: "en-US-female",
  speed: 1,
  lang: "en",
  emailNotif: true,
  pushNotif: false,
};

const Settings: React.FC = () => {
  const { theme, setTheme } = useAppTheme();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    toast.success("Preferences saved");
  };

  return (
    <div data-testid="settings-page">
      <PageHeader eyebrow="Preferences" title="Settings" subtitle="Make the assistant feel like yours." />
      <div className="max-w-3xl space-y-5">
        <Section title="Voice">
          <Row label="Text-to-speech (read replies aloud)">
            <Switch checked={prefs.tts} onCheckedChange={(v: boolean) => setPrefs({ ...prefs, tts: v })} data-testid="settings-tts" />
          </Row>
          <Row label="Voice">
            <Select value={prefs.voice} onValueChange={(v: string) => setPrefs({ ...prefs, voice: v })}>
              <SelectTrigger className="w-56 bg-white/5 border-white/10" data-testid="settings-voice">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US-female">English (US) · Female</SelectItem>
                <SelectItem value="en-US-male">English (US) · Male</SelectItem>
                <SelectItem value="en-IN-female">English (IN) · Female</SelectItem>
                <SelectItem value="en-GB-female">English (UK) · Female</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row label={`Playback speed (${prefs.speed.toFixed(1)}x)`}>
            <Slider value={[prefs.speed]} min={0.5} max={2} step={0.1} onValueChange={(v: number[]) => setPrefs({ ...prefs, speed: v[0] })} className="w-56" data-testid="settings-speed" />
          </Row>
        </Section>

        <Section title="Language & theme">
          <Row label="Interface language">
            <Select value={prefs.lang} onValueChange={(v: string) => setPrefs({ ...prefs, lang: v })}>
              <SelectTrigger className="w-56 bg-white/5 border-white/10" data-testid="settings-lang">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row label="App theme">
            <Select value={theme} onValueChange={(v: string) => setTheme(v as "dark" | "light")}>
              <SelectTrigger className="w-56 bg-white/5 border-white/10" data-testid="settings-theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark (futuristic)</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </Section>

        <Section title="Notifications">
          <Row label="Email notifications">
            <Switch checked={prefs.emailNotif} onCheckedChange={(v: boolean) => setPrefs({ ...prefs, emailNotif: v })} data-testid="settings-email" />
          </Row>
          <Row label="In-app notifications">
            <Switch checked={prefs.pushNotif} onCheckedChange={(v: boolean) => setPrefs({ ...prefs, pushNotif: v })} data-testid="settings-push" />
          </Row>
        </Section>

        <div className="flex justify-end pt-2">
          <Button onClick={save} data-testid="settings-save-btn" className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] text-white hover:brightness-110 transition-all rounded-xl px-6">
            Save preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-2xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-6">
    <h3 className="font-display font-bold text-lg mb-5">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <Label className="text-sm font-medium text-white/80">{label}</Label>
    {children}
  </div>
);

export default Settings;
