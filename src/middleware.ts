import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const hasSession = request.cookies.has("admin_session");

  if (pathname.startsWith("/controlpanel") && !pathname.startsWith("/controlpanel/login")) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/controlpanel/login", request.url));
    }
  }

  if (pathname.startsWith("/controlpanel/login") && hasSession) {
    return NextResponse.redirect(new URL("/controlpanel", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/controlpanel/:path*"],
};