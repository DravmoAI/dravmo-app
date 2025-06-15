import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      screenId,
      designMasterId,
      industry,
      productType,
      purpose,
      audience,
      ageGroup,
      brandPersonality,
      platform,
      selectedTopics,
      selectedSubtopics,
      selectedPoints,
    } = body

    if (!screenId) {
      return NextResponse.json({ error: "ScreenId is required" }, { status: 400 })
    }

    // Create the feedback query
    const feedbackQuery = await prisma.feedbackQuery.create({
      data: {
        screenId,
        designMasterId: designMasterId || null, // Make designMasterId optional
        industry,
        productType,
        purpose,
        audience,
        ageGroup,
        brandPersonality,
        platform: platform || "Web", // Default to Web if not provided
      },
    })

    // Create the select analyzers for topics, subtopics, and points
    if (selectedTopics && selectedTopics.length > 0) {
      await prisma.selectAnalyzer.createMany({
        data: selectedTopics.map((topicId: string) => ({
          feedbackQueryId: feedbackQuery.id,
          topicId,
          subtopicId: null,
          pointId: null,
        })),
      })
    }

    if (selectedSubtopics && selectedSubtopics.length > 0) {
      await prisma.selectAnalyzer.createMany({
        data: selectedSubtopics.map((subtopicId: string) => ({
          feedbackQueryId: feedbackQuery.id,
          topicId: null,
          subtopicId,
          pointId: null,
        })),
      })
    }

    if (selectedPoints && selectedPoints.length > 0) {
      await prisma.selectAnalyzer.createMany({
        data: selectedPoints.map((pointId: string) => ({
          feedbackQueryId: feedbackQuery.id,
          topicId: null,
          subtopicId: null,
          pointId,
        })),
      })
    }

    // Create a mock feedback result
    const feedbackResult = await prisma.feedbackResult.create({
      data: {
        queryId: feedbackQuery.id,
        feedbackSummary:
          "This design shows strong visual hierarchy and clean typography. The color palette is well-balanced and creates good contrast for readability. Consider improving the spacing between elements for better visual breathing room. The interactive elements are clearly defined and follow modern UI patterns. Overall, this is a solid design foundation with room for minor refinements.",
        version: "1.0",
      },
    })

    return NextResponse.json(
      {
        feedbackQuery,
        feedbackResult,
        redirectUrl: `/projects/${body.projectId}/screens/${screenId}/feedback/${feedbackResult.id}`,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating feedback query:", error)
    return NextResponse.json({ error: "Failed to create feedback query" }, { status: 500 })
  }
}
