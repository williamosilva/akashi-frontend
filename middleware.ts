import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_ROUTES = ["/", "/form", "/success"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isValidRoute = VALID_ROUTES.some((route) => pathname.startsWith(route));

  if (!isValidRoute) {
    return new NextResponse(null, { status: 404 });
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
