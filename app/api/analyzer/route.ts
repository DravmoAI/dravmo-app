import { NextResponse } from "next/server";
import { getAvailableAnalyzerTopics } from "@/lib/plan-restrictions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log(`Fetching analyzer topics for user: ${userId}`);

    const topics = await getAvailableAnalyzerTopics(userId);

    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    console.error("Error fetching analyzer topics:", error);
    return NextResponse.json({ error: "Failed to fetch analyzer topics" }, { status: 500 });
  }
}
