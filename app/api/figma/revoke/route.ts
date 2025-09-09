import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
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

    // Remove the Figma token from the database
    await prisma.profile.update({
      where: { id: user.id },
      data: { figmaToken: null },
    });

    return NextResponse.json({ success: true, message: "Figma authorization revoked" });
  } catch (error) {
    console.error("Error revoking Figma authorization:", error);
    return NextResponse.json({ error: "Failed to revoke authorization" }, { status: 500 });
  }
}
