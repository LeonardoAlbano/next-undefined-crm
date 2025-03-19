import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { signInWithGoogle } from "@/http/sign-in-with-google";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/sign-in?error=missing_token", request.url));
  }

  try {
    const { token: accessToken } = await signInWithGoogle({ token });

    const cookieStore = await cookies();
    cookieStore.set("token", accessToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.redirect(new URL("/dashboard/home", request.url));
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.redirect(new URL("/auth/sign-in?error=auth_failed", request.url));
  }
}

