import Link from "next/link";
import { ReactNode } from "react";

import { LocaleSwitch } from "@/components/locale-switch";
import { NavLink } from "@/components/nav-link";
import type { Locale } from "@/lib/i18n";

export function AppShell({
  children,
  locale,
  shell,
}: {
  children: ReactNode;
  locale: Locale;
  shell: {
    badge: string;
    brandDescription: string;
    activeSite: string;
    activeSiteSummary: string;
    switchLabel: string;
    nav: {
      dashboard: string;
      assets: string;
      machineHealth: string;
      workOrders: string;
      incidents: string;
      safety: string;
      reports: string;
      users: string;
      intake: string;
      settings: string;
    };
  };
}) {
  const navItems = [
    { href: "/dashboard", label: shell.nav.dashboard },
    { href: "/assets", label: shell.nav.assets },
    { href: "/machine-health", label: shell.nav.machineHealth },
    { href: "/work-orders", label: shell.nav.workOrders },
    { href: "/incidents", label: shell.nav.incidents },
    { href: "/safety", label: shell.nav.safety },
    { href: "/reports", label: shell.nav.reports },
    { href: "/admin/users", label: shell.nav.users },
    { href: "/admin/intake", label: shell.nav.intake },
    { href: "/admin/settings", label: shell.nav.settings },
  ];

  return (
    <div className="app-shell px-4 py-4 md:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-2rem)] grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="sidebar-rail relative overflow-hidden rounded-[2rem] border border-white/10 p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.28)]">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.32),transparent_68%)]" />
            <div className="absolute inset-y-0 start-0 w-px bg-white/10" />
            <div className="absolute inset-y-0 end-0 w-px bg-white/5" />
          </div>

          <div className="relative mb-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[11px] uppercase tracking-[0.28em] text-slate-200">
                {shell.badge}
              </div>
              <LocaleSwitch locale={locale} label={shell.switchLabel} />
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.8)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Industrial Control Plane</span>
              </div>
              <h1 className="text-[2rem] font-semibold tracking-tight">Kashef Ai</h1>
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">{shell.brandDescription}</p>
            </div>
          </div>
          <nav className="relative space-y-1.5">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>

          <div className="relative mt-8 space-y-4 rounded-[1.6rem] border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{shell.activeSite}</p>
                <p className="mt-2 text-base font-semibold text-white">Riyadh Metals Factory</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">{shell.activeSiteSummary}</p>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                Live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/8 bg-slate-900/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Coverage</p>
                <p className="mt-2 text-lg font-semibold text-white">4 assets</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-900/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Timezone</p>
                <p className="mt-2 text-lg font-semibold text-white">Riyadh</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="space-y-5">
          <div className="surface-shell rounded-[2rem] p-3 md:p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
