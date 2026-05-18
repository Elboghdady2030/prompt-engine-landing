"use client";

import { FormEvent, useMemo, useState } from "react";
import clsx from "clsx";

import { askAgentAssistant } from "@/lib/api";
import type { AgentAssistantResponse, Role } from "@/lib/types";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type AgentAssistantPanelProps = {
  locale?: "en" | "ar";
  pageContext:
    | {
        page: "dashboard";
        title?: string;
      }
    | {
        page: "asset";
        assetId: number;
        assetCode: string;
        assetName: string;
        assetCategory?: string;
        assetCriticality?: string;
      };
};

const dictionary = {
  en: {
    title: "Kashef Ai assistant",
    subtitle:
      "Ask the platform to explain operational risk, plan maintenance, or summarize safety exposure with AI-backed plant data.",
    intro:
      "Kashef Ai is ready. Ask for plant risk review, asset diagnosis, maintenance planning, or incident RCA and I will use the industrial agent tools behind the scenes.",
    roleLabel: "Decision role",
    suggestedPrompts: [
      "Review the highest-risk compressor and recommend the next maintenance action.",
      "Summarize the biggest safety exposure across the plant for the HSE manager.",
      "Prepare a maintenance planning brief for the next seven days.",
    ],
    assetPrompts: [
      "Diagnose this asset and explain the most likely failure drivers.",
      "Recommend the next maintenance action for this asset and justify the urgency.",
      "Summarize the current safety exposure linked to this asset.",
    ],
    assistantName: "Kashef Ai",
    you: "You",
    label: "Industrial copilot",
    loading: "Reviewing asset intelligence, work orders, incidents, and safety context…",
    placeholder: "Ask for an asset diagnosis, plant-wide risk review, maintenance plan, or incident RCA summary.",
    helper: "The assistant uses the secured server route and industrial tool layer, not browser-side secrets.",
    button: "Ask Kashef Ai",
    buttonLoading: "Analyzing…",
    error: "Kashef Ai could not complete the request right now.",
    promptsLabel: "Suggested prompts",
    chatLabel: "Conversation",
    roles: {
      plant_manager: "Plant Manager",
      maintenance_manager: "Maintenance Manager",
      reliability_engineer: "Reliability Engineer",
      safety_manager: "Safety Manager",
      factory_owner: "Factory Owner",
    },
  },
  ar: {
    title: "مساعد كاشف AI",
    subtitle:
      "اطلب من المنصة شرح المخاطر التشغيلية، أو اقتراح خطة صيانة، أو تلخيص مستوى التعرض للسلامة بالاعتماد على بيانات المصنع الفعلية.",
    intro:
      "مساعد كاشف AI جاهز. يمكنك طلب مراجعة مخاطر المصنع، أو تشخيص أصل محدد، أو تخطيط الصيانة، أو تلخيص تحليل الحوادث، وسيستخدم طبقة الأدوات الصناعية في الخلفية.",
    roleLabel: "دور متخذ القرار",
    suggestedPrompts: [
      "راجع أعلى الأصول خطورة وقدم التوصية التالية للصيانة.",
      "لخص أكبر تعرض للسلامة على مستوى المصنع لمدير السلامة.",
      "جهز موجز تخطيط الصيانة للأيام السبعة القادمة.",
    ],
    assetPrompts: [
      "شخّص هذا الأصل واشرح أكثر مسببات العطل احتمالاً.",
      "اقترح الإجراء الصياني التالي لهذا الأصل مع توضيح سبب الأولوية.",
      "لخص مستوى التعرض الحالي للسلامة المرتبط بهذا الأصل.",
    ],
    assistantName: "كاشف AI",
    you: "أنت",
    label: "مساعد تشغيلي صناعي",
    loading: "جارٍ مراجعة ذكاء الأصول، وأوامر العمل، والحوادث، وسياق السلامة…",
    placeholder: "اطلب تشخيص أصل، أو مراجعة مخاطر المصنع، أو خطة صيانة، أو ملخص تحليل حادثة.",
    helper: "يستخدم المساعد مساراً آمناً على الخادم وطبقة الأدوات الصناعية، دون كشف المفاتيح داخل المتصفح.",
    button: "اسأل كاشف AI",
    buttonLoading: "جارٍ التحليل…",
    error: "تعذر على كاشف AI إكمال الطلب حالياً.",
    promptsLabel: "مطالبات مقترحة",
    chatLabel: "المحادثة",
    roles: {
      plant_manager: "مدير المصنع",
      maintenance_manager: "مدير الصيانة",
      reliability_engineer: "مهندس الاعتمادية",
      safety_manager: "مدير السلامة والصحة المهنية",
      factory_owner: "المالك التنفيذي للمصنع",
    },
  },
} as const;

export function AgentAssistantPanel({ locale = "en", pageContext }: AgentAssistantPanelProps) {
  const content = dictionary[locale];
  const roleOptions: { value: Role; label: string }[] = [
    { value: "plant_manager", label: content.roles.plant_manager },
    { value: "maintenance_manager", label: content.roles.maintenance_manager },
    { value: "reliability_engineer", label: content.roles.reliability_engineer },
    { value: "safety_manager", label: content.roles.safety_manager },
    { value: "factory_owner", label: content.roles.factory_owner },
  ];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "assistant-intro",
      role: "assistant",
      content: content.intro,
    },
  ]);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<Role>("maintenance_manager");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => message.trim().length > 0 && !loading, [loading, message]);
  const prompts = pageContext.page === "asset" ? content.assetPrompts : content.suggestedPrompts;

  async function submitPrompt(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setError(null);
    setLoading(true);

    try {
      const result: AgentAssistantResponse = await askAgentAssistant({
        message: trimmed,
        context: {
          locale,
          timezone: "Asia/Riyadh",
          requesting_role: role,
        },
        pageContext,
      });

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: result.answer,
        },
      ]);
    } catch (err) {
      const nextError = err instanceof Error ? err.message : content.error;
      setError(nextError);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitPrompt(message);
  }

  return (
    <section className="relative overflow-hidden rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.94))] p-6 shadow-panel">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 start-0 h-48 w-48 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="absolute end-0 top-10 h-40 w-40 rounded-full bg-sky-100/50 blur-3xl" />
      </div>

      <div className="relative mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            {content.label}
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">{content.title}</h2>
          <p className="max-w-3xl text-sm leading-7 text-slate-600">{content.subtitle}</p>
        </div>

        <label className="flex min-w-[16rem] flex-col gap-2 text-sm text-slate-600">
          <span className="font-medium text-slate-700">{content.roleLabel}</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
            className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-teal-500"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="relative mb-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{content.promptsLabel}</p>
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void submitPrompt(prompt)}
              className="rounded-full border border-slate-200/80 bg-white/90 px-4 py-2.5 text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-[1.7rem] border border-slate-200/80 bg-slate-50/70">
        <div className="border-b border-slate-200/80 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{content.chatLabel}</p>
        </div>
        <div className="agent-chat-scroll space-y-3 p-4">
          {messages.map((item) => (
            <div
              key={item.id}
              className={clsx(
                "rounded-[1.5rem] px-4 py-3 text-sm leading-6 shadow-sm",
                item.role === "assistant"
                  ? "max-w-3xl border border-slate-200/70 bg-white text-slate-700"
                  : "ms-auto max-w-2xl bg-slate-950 text-white shadow-[0_16px_30px_rgba(15,23,42,0.2)]"
              )}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] opacity-70">
                {item.role === "assistant" ? content.assistantName : content.you}
              </p>
              <p className="whitespace-pre-wrap">{item.content}</p>
            </div>
          ))}

          {loading ? (
            <div className="max-w-3xl rounded-[1.5rem] border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{content.assistantName}</p>
              <p>{content.loading}</p>
            </div>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-3">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          placeholder={content.placeholder}
          className="w-full rounded-[1.6rem] border border-slate-200/80 bg-white/92 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-teal-500"
        />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">{content.helper}</p>

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? content.buttonLoading : content.button}
          </button>
        </div>
      </form>

      {error ? <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
