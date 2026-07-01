import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const hasSession = request.cookies.has("admin_session");

  if (pathname.startsWith("/control-panel") && !pathname.startsWith("/control-panel/login")) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/control-panel/login", request.url));
    }
  }

  if (pathname.startsWith("/control-panel/login") && hasSession) {
    return NextResponse.redirect(new URL("/control-panel", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/control-panel/:path*"],
};