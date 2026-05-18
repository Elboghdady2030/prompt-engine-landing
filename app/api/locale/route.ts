import { NextRequest, NextResponse } from "next/server";

import { LOCALE_COOKIE_NAME, resolveLocale } from "@/lib/i18n";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const value = resolveLocale(searchParams.get("value"));
  const redirectPath = sanitizeRedirect(searchParams.get("redirect"));

  const response = NextResponse.redirect(new URL(redirectPath, request.url));
  response.cookies.set(LOCALE_COOKIE_NAME, value, {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

function sanitizeRedirect(value: string | null): string {
  if (!value || !value.startsWith("/")) {
    return "/dashboard";
  }
  return value;
}
