"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import type { Locale } from "@/lib/i18n";

export function LocaleSwitch({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirect = `${pathname}${searchParams?.size ? `?${searchParams.toString()}` : ""}`;

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <div className="inline-flex rounded-full border border-white/10 bg-slate-900/35 p-1 backdrop-blur-xl">
        <LocaleOption current={locale} target="en" redirect={redirect} />
        <LocaleOption current={locale} target="ar" redirect={redirect} />
      </div>
    </div>
  );
}

function LocaleOption({
  current,
  target,
  redirect,
}: {
  current: Locale;
  target: Locale;
  redirect: string;
}) {
  const active = current === target;
  return (
    <Link
      href={`/api/locale?value=${target}&redirect=${encodeURIComponent(redirect)}`}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-white text-slate-950 shadow-[0_8px_20px_rgba(255,255,255,0.16)]" : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {target.toUpperCase()}
    </Link>
  );
}
