import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // This should contain user session info

  console.log("code", code);
  console.log("state", state);

  // Parse state if it exists
  let stateData = null;
  if (state && state !== "figma_auth") {
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
      console.log("parsed state data:", stateData);
    } catch (e) {
      console.log("Failed to parse state:", e);
    }
  }

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

    // For OAuth callbacks, we can't reliably get the session from cookies
    // because the user is being redirected from Figma. Instead, we'll use
    // the temporary token approach and let the frontend handle the storage.
    
    console.log("OAuth callback - using temporary token approach");
    
    // Encode the access token for safe URL transmission
    const tempToken = Buffer.from(accessToken).toString("base64");
    
    // Redirect to upload page with the token
    // The frontend will handle storing the token using the user's session
    return NextResponse.redirect(
      new URL(`/upload?figma_token=${tempToken}`, request.url)
    );

  } catch (err) {
    console.error("OAuth error:", err);
    return NextResponse.redirect(new URL("/upload?error=auth_failed", request.url));
  }
}
