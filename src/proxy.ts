import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const SESSION_COOKIE = "formation_ia_session";

const intlMiddleware = createMiddleware(routing);

async function readSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as { role?: "admin" | "participant" };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  const intlResponse = intlMiddleware(request);

  // No locale in the URL yet: let next-intl redirect to the negotiated locale.
  // Auth is enforced on the follow-up request, which will carry the prefix.
  if (!pathnameHasLocale) {
    return intlResponse;
  }

  const locale = pathname.split("/")[1];
  const pathWithoutLocale = pathname.slice(`/${locale}`.length) || "/";
  const session = await readSession(request);

  const isProtected =
    pathWithoutLocale.startsWith("/dashboard") ||
    pathWithoutLocale.startsWith("/admin") ||
    pathWithoutLocale === "/onboarding";

  if (isProtected && !session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (pathWithoutLocale.startsWith("/admin") && session?.role !== "admin") {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  if (pathWithoutLocale === "/login" && session) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
