import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const SESSION_COOKIE = "formation_ia_session";
const ADMIN_SESSION_COOKIE = "formation_ia_admin_session";

const intlMiddleware = createMiddleware(routing);

async function readCookieSession(request: NextRequest, cookieName: string) {
  const token = request.cookies.get(cookieName)?.value;
  if (!token) return null;

  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload;
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

  const isAdminRoute = pathWithoutLocale.startsWith("/admin");
  const isAdminLoginRoute = pathWithoutLocale === "/admin/login";

  if (isAdminRoute) {
    const adminSession = await readCookieSession(request, ADMIN_SESSION_COOKIE);

    if (isAdminLoginRoute) {
      if (adminSession) {
        return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
      }
      return intlResponse;
    }

    if (!adminSession) {
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
    return intlResponse;
  }

  const session = await readCookieSession(request, SESSION_COOKIE);

  const isProtected =
    pathWithoutLocale.startsWith("/dashboard") ||
    pathWithoutLocale.startsWith("/profile") ||
    pathWithoutLocale === "/onboarding";

  if (isProtected && !session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (pathWithoutLocale === "/login" && session) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
