import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { getDirection, getLocale, getMessages } from "@/lib/i18n";


export const metadata: Metadata = {
  title: "Kashef Ai",
  description: "Saudi-ready enterprise predictive maintenance and safety intelligence SaaS platform.",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();
  const direction = getDirection(locale);
  const messages = getMessages(locale);

  return (
    <html lang={locale} dir={direction}>
      <body>
        <AppShell locale={locale} shell={messages.shell}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
