"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "group relative block overflow-hidden rounded-2xl px-4 py-3 text-sm font-medium transition duration-200",
        active
          ? "bg-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
          : "text-slate-300 hover:bg-white/8 hover:text-white"
      )}
    >
      <span
        className={clsx(
          "absolute inset-y-3 start-2 w-1 rounded-full transition",
          active ? "bg-emerald-400" : "bg-transparent group-hover:bg-white/30"
        )}
      />
      <span className="relative ps-3">{label}</span>
    </Link>
  );
}
