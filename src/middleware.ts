import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Check for the token cookie instead of using auth()
  const token = request.cookies.get("token")?.value;

  // Protected routes that require authentication
  const protectedPaths = ["/dashboard"];

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // If the path is protected and the user is not authenticated, redirect to sign-in
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // If the user is authenticated and trying to access auth pages, redirect to dashboard
  if (token && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};

