import { NextRequest, NextResponse } from "next/server";
import { PlanRestrictionsService } from "@/lib/services/plan-restrictions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const planInfo = await PlanRestrictionsService.getUserPlanInfo(userId);

    return NextResponse.json(planInfo, { status: 200 });
  } catch (error) {
    console.error("Error fetching user plan info:", error);
    return NextResponse.json({ error: "Failed to fetch plan info" }, { status: 500 });
  }
}
