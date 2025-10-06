import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PlanRestrictionsService } from "@/lib/services/plan-restrictions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log(`Fetching analyzer topics for user: ${userId}`);

    // Get available analyzers for user
    const availableAnalyzers = await PlanRestrictionsService.getAvailableAnalyzers(userId);

    // Fetch all analyzer topics from database
    const allTopics = await prisma.analyzerTopic.findMany({
      include: {
        analyzerSubtopics: {
          include: {
            analyzerPoints: true,
          },
        },
      },
    });

    // Filter topics based on user's plan
    const filteredTopics = allTopics.filter((topic) => availableAnalyzers.includes(topic.name));

    return NextResponse.json({ topics: filteredTopics }, { status: 200 });
  } catch (error) {
    console.error("Error fetching analyzer topics:", error);
    return NextResponse.json({ error: "Failed to fetch analyzer topics" }, { status: 500 });
  }
}
