import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

type Locale = "en" | "ar";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.9rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(248,250,252,0.86))] p-8 shadow-panel md:flex md:items-end md:justify-between">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 end-0 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/70 to-transparent" />
      </div>
      <div className="relative space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{eyebrow}</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">{title}</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-[15px]">{description}</p>
        </div>
      </div>
      {action ? <div className="relative mt-5 md:mt-0">{action}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "good" | "warning" | "danger";
}) {
  const toneClasses = {
    default: "from-white via-white to-slate-50",
    good: "from-emerald-50 via-white to-white",
    warning: "from-amber-50 via-white to-white",
    danger: "from-rose-50 via-white to-white",
  };

  const toneAccent = {
    default: "bg-slate-900/70",
    good: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
  };

  return (
    <div className={clsx("relative overflow-hidden rounded-[1.7rem] border border-white/70 bg-gradient-to-br p-5 shadow-panel", toneClasses[tone])}>
      <div className="absolute inset-x-5 top-0 h-1 rounded-b-full bg-slate-100">
        <div className={clsx("h-full w-14 rounded-b-full", toneAccent[tone])} />
      </div>
      <div className="relative">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{value}</p>
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,250,252,0.9))] p-6 shadow-panel">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="relative mb-5 space-y-1.5">
        <h2 className="text-lg font-semibold text-slate-950 md:text-[1.15rem]">{title}</h2>
        {subtitle ? <p className="text-sm leading-6 text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function StatusBadge({ value, locale = "en" }: { value: string; locale?: Locale }) {
  const normalizedValue = value.toLowerCase();
  const style =
    normalizedValue === "critical"
      ? "bg-red-100 text-red-700"
      : normalizedValue === "warning" || normalizedValue === "high"
        ? "bg-amber-100 text-amber-700"
        : normalizedValue === "healthy" || normalizedValue === "active" || normalizedValue === "open"
          ? "bg-teal-100 text-teal-700"
          : "bg-slate-100 text-slate-600";

  const translatedValue =
    locale === "ar"
      ? {
          critical: "حرج",
          warning: "تحذير",
          high: "مرتفع",
          medium: "متوسط",
          low: "منخفض",
          healthy: "سليم",
          active: "نشط",
          open: "مفتوح",
          investigating: "قيد التحقق",
          submitted: "تم الإرسال",
          review_required: "يتطلب مراجعة",
          in_progress: "قيد التنفيذ",
        }[normalizedValue] ?? value
      : value;

  return <span className={clsx("inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize", style)}>{translatedValue}</span>;
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="data-table overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white/80">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50/90">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3.5 font-medium text-slate-500">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white/90">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="transition hover:bg-slate-50/80">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3.5 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ActionButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
    >
      {label}
    </Link>
  );
}
