import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Handle auth callback
  if (path === "/auth/callback") {
    try {
      // For auth callback, just continue to the page
      // The actual auth handling will be done in the callback page component
      return NextResponse.next();
    } catch (error) {
      console.error("Auth callback middleware error:", error);
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // Handle OAuth callback on home page (when code is in query params)
  if (path === "/" && request.nextUrl.searchParams.get("code")) {
    // Let the home page handle the OAuth callback
    return NextResponse.next();
  }

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password" ||
    path === "/auth" ||
    path === "/";

  // Get the token from the cookies
  const token = request.cookies.get("auth_token")?.value || "";

  // Redirect logic for authentication
  // if (!isPublicPath && !token) {
  //   // Redirect to login if trying to access a protected route without a token
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  if ((path === "/login" || path === "/register") && token) {
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
