import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" || path === "/register" || path === "/forgot-password";

  // Get the token from the cookies
  const token = request.cookies.get("auth_token")?.value || "";

  // Redirect logic for authentication
  if (!isPublicPath && !token) {
    // Redirect to login if trying to access a protected route without a token
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicPath && token) {
    // Redirect to home if trying to access login/register with a token
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Continue with the request if no redirects are needed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
