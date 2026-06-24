import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle2, FileText, Tag, Globe2, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STEPS = ["Upload file", "Region & category", "Tags", "Review"];
const REGIONS = ["India", "USA", "UK", "South Africa", "Austria", "Singapore", "Canada", "Ireland", "Global"];

const PolicyUploadWizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<string>("");
  const [region, setRegion] = useState("");
  const [cat, setCat] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState("");

  const addTag = () => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTag("");
    }
  };

  return (
    <div data-testid="policy-upload-wizard">
      <PageHeader eyebrow="Admin" title="Upload policy" subtitle="Step-by-step. Triggers n8n re-embedding when published." />

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto scrollbar-thin">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-3 shrink-0" data-testid={`wizard-step-${i}`}>
            <div className={`h-8 w-8 rounded-full grid place-items-center text-xs font-bold ${
              i < step ? "bg-emerald-500 text-white" :
              i === step ? "bg-gradient-to-br from-[#FF6B5B] to-[#E11D2C] text-white" :
              "bg-white/5 text-white/40 border border-white/10"
            }`}>
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <div className={`text-sm ${i === step ? "text-white" : "text-white/50"}`}>{s}</div>
            {i < STEPS.length - 1 && <div className="h-px w-8 bg-white/10" />}
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/5 bg-[#0B0B20]/80 backdrop-blur-md p-8 max-w-3xl">
        {step === 0 && (
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Pick a file</h3>
            <label className="block border-2 border-dashed border-white/15 rounded-2xl p-12 text-center hover:border-[#FF6B5B]/50 transition-colors cursor-pointer" data-testid="wizard-upload-area">
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0]?.name || "")} />
              <Upload className="h-10 w-10 mx-auto text-white/40 mb-3" />
              <div className="font-medium">{file || "Drop PDF or DOCX, or click to browse"}</div>
              <div className="text-xs text-white/40 mt-1">Max 25MB · Multi-file supported soon</div>
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h3 className="font-display text-xl font-bold mb-1">Region & category</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="bg-white/5 border-white/10 mt-1.5" data-testid="wizard-region">
                    <SelectValue placeholder="Choose region" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={cat} onValueChange={setCat}>
                  <SelectTrigger className="bg-white/5 border-white/10 mt-1.5" data-testid="wizard-cat">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {["HR","Leave","Payroll","Benefits","IT","Code of Conduct","Onboarding"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Tags</h3>
            <div className="flex gap-2 mb-4">
              <Input value={tag} onChange={(e) => setTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add a tag, then Enter" data-testid="wizard-tag-input" className="bg-white/5 border-white/10" />
              <Button onClick={addTag} data-testid="wizard-tag-add" className="bg-white/10">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Badge key={t} className="bg-[#FF6B5B]/15 text-[#FF6B5B] border-0" data-testid={`wizard-tag-${t}`}>
                  <Tag className="h-3 w-3 mr-1" /> {t}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Review & publish</h3>
            <div className="space-y-3 text-sm">
              <Row icon={FileText} label="File" value={file || "—"} />
              <Row icon={Globe2} label="Region" value={region || "—"} />
              <Row icon={Tag} label="Category" value={cat || "—"} />
              <Row icon={Sparkles} label="Tags" value={tags.length ? tags.join(", ") : "—"} />
            </div>
            <div className="mt-6 p-4 rounded-xl bg-[#FF6B5B]/[0.08] border border-[#FF6B5B]/20 text-sm text-white/80">
              Publishing will trigger the <span className="font-mono text-[#FF6B5B]">/embed-policy</span> webhook and re-index the corpus for this region.
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} data-testid="wizard-back">Back</Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] rounded-xl" data-testid="wizard-next">Next</Button>
          ) : (
            <Button className="bg-gradient-to-r from-[#FF6B5B] to-[#E11D2C] rounded-xl" data-testid="wizard-publish">
              <Upload className="h-4 w-4 mr-1.5" /> Publish & re-embed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{ icon: React.ComponentType<{ className?: string }>; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
    <Icon className="h-4 w-4 text-white/40" />
    <span className="text-white/50 w-24">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default PolicyUploadWizard;
