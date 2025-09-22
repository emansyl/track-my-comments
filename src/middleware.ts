// middleware.ts
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = new Set([
  "/", // keep your landing page public
  "/signin", // login route
  "/signup", // signup route (optional)
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.has(pathname) || pathname.startsWith("/public");

  // For public paths, just let them through
  if (isPublic) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  // If session cookie exists and user hits auth pages, send them to app home
  if (sessionCookie && (pathname === "/signin" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // For protected pages, let the page handle auth validation and redirect
  // This avoids expensive session validation in middleware
  return NextResponse.next();
}

// Exclude API, Next assets, and the favicon from the middleware
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
