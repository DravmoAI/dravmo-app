import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface SelectedAnalyzer {
  topicId: string
  subtopicId: string
  pointId: string
}

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
      selectedAnalyzers,
    } = body

    if (!screenId) {
      return NextResponse.json({ error: "ScreenId is required" }, { status: 400 })
    }

    if (!selectedAnalyzers || selectedAnalyzers.length === 0) {
      return NextResponse.json({ error: "At least one analyzer must be selected" }, { status: 400 })
    }

    // First, verify the screen exists
    const screen = await prisma.screen.findUnique({
      where: { id: screenId },
    })

    if (!screen) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 })
    }

    // Create the feedback query with proper relations
    const feedbackQuery = await prisma.feedbackQuery.create({
      data: {
        screen: {
          connect: { id: screenId },
        },
        ...(designMasterId && {
          designMaster: {
            connect: { id: designMasterId },
          },
        }),
        industry,
        productType,
        purpose,
        audience,
        ageGroup,
        brandPersonality,
        platform: platform || "Web",
      },
    })

    // Create the select analyzers - each point gets its own record with all three IDs
    const analyzerData = selectedAnalyzers.map((analyzer: SelectedAnalyzer) => ({
      feedbackQueryId: feedbackQuery.id,
      topicId: analyzer.topicId,
      subtopicId: analyzer.subtopicId,
      pointId: analyzer.pointId,
    }))

    await prisma.selectAnalyzer.createMany({
      data: analyzerData,
    })

    // Create a mock feedback result
    const feedbackResult = await prisma.feedbackResult.create({
      data: {
        feedbackQuery: {
          connect: { id: feedbackQuery.id },
        },
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
