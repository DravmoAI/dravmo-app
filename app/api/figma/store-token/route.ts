import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { tempToken } = await request.json();

    if (!tempToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // Decode the temporary token
    const accessToken = Buffer.from(tempToken, "base64").toString("utf-8");

    // Get the user from the session using request headers
    const supabase = getSupabaseClient();
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Store the token in the database
    await prisma.profile.update({
      where: { id: user.id },
      data: { figmaToken: accessToken },
    });

    return NextResponse.json({ success: true, message: "Figma token stored successfully" });
  } catch (error) {
    console.error("Error storing Figma token:", error);
    return NextResponse.json({ error: "Failed to store token" }, { status: 500 });
  }
}
