import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin: optimistic cookie check; every page/action re-validates on the server.
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Turkish and French are served from /tr and /fr as-is.
  if (pathname === "/tr" || pathname.startsWith("/tr/")) return NextResponse.next();
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return NextResponse.next();

  // English is the default and canonical at the root: /en/... → /...
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Everything except API, Next internals, media/uploads and files with an extension.
    "/((?!api|_next|media|uploads|favicon.ico|sitemap.xml|robots.txt|.*\\.[\\w]+$).*)",
  ],
};
