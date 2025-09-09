import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get the user from the session using request headers
    const supabase = getSupabaseClient();
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Check if user has a Figma token in the database
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { figmaToken: true },
    });

    if (profile?.figmaToken) {
      return NextResponse.json({ authenticated: true });
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error("Error checking Figma auth:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
