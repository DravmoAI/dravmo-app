import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  console.log("code", code);

  try {
    const formData = new URLSearchParams({
      client_id: process.env.FIGMA_CLIENT_ID!,
      client_secret: process.env.FIGMA_CLIENT_SECRET!,
      redirect_uri: process.env.REDIRECT_URI!,
      code: code as string,
      grant_type: "authorization_code",
    });

    const tokenRes = await fetch("https://api.figma.com/v1/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    console.log("accessToken", accessToken);

    // Get the user from cookies (OAuth callbacks don't have session headers)
    const supabase = getSupabaseClient();

    // Try to get session from cookies
    const refreshToken = request.cookies.get("sb-access-token")?.value;
    const accessTokenCookie = request.cookies.get("sb-refresh-token")?.value;

    console.log("refreshToken", refreshToken);
    console.log("accessTokenCookie", accessTokenCookie);

    // For OAuth callbacks, we need to use a different approach
    // Let's store the token temporarily and redirect to a page that can handle it
    const tempToken = Buffer.from(accessToken).toString("base64");

    const response = NextResponse.redirect(
      new URL(`/upload?figma_token=${tempToken}`, request.url)
    );

    // Set a temporary cookie with the token
    response.cookies.set("temp_figma_token", tempToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 300, // 5 minutes
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("OAuth error:", err);
    return NextResponse.redirect(new URL("/upload?error=auth_failed", request.url));
  }
}
