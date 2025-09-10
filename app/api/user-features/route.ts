
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { UserFeatureService } from "@/lib/services/user-features";

export async function GET(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid authentication" }, { status: 401 });
    }

    // Get user features
    const features = await UserFeatureService.getUserFeatures(user.id);

    return NextResponse.json({ features }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user features:", error);
    return NextResponse.json({ error: "Failed to fetch user features" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid authentication" }, { status: 401 });
    }

    const { feature, value, reason, expiresAt } = await request.json();

    if (!feature || value === undefined) {
      return NextResponse.json({ error: "Feature and value are required" }, { status: 400 });
    }

    // Grant feature override
    const override = await UserFeatureService.grantFeatureOverride(
      user.id,
      feature,
      value,
      reason,
      expiresAt ? new Date(expiresAt) : undefined
    );

    return NextResponse.json({ override }, { status: 201 });
  } catch (error) {
    console.error("Error granting feature override:", error);
    return NextResponse.json({ error: "Failed to grant feature override" }, { status: 500 });
  }
}
