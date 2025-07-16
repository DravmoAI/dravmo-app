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
      imageData,
    } = body

    if (!screenId) {
      return NextResponse.json({ error: "ScreenId is required" }, { status: 400 })
    }

    if (!selectedAnalyzers || selectedAnalyzers.length === 0) {
      return NextResponse.json({ error: "At least one analyzer must be selected" }, { status: 400 })
    }

    if (!imageData) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 })
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

    // Get the count of existing feedback results for this screen to determine version number
    const existingFeedbackCount = await prisma.feedbackResult.count({
      where: {
        feedbackQuery: {
          screenId: screenId,
        },
      },
    })

    // Generate version number (v1, v2, v3, etc.)
    const versionNumber = existingFeedbackCount + 1
    const version = `v${versionNumber}`

    // Fetch analyzer topics to build criterias
    const analyzerTopics = await prisma.analyzerTopic.findMany({
      include: {
        analyzerSubtopics: {
          include: {
            analyzerPoints: true,
          },
        },
      },
    })

    // Build criterias object based on selected analyzers
    const criterias: any = {}

    selectedAnalyzers.forEach((selectedAnalyzer: SelectedAnalyzer) => {
      const topic = analyzerTopics.find((t) => t.id === selectedAnalyzer.topicId)
      const subtopic = topic?.analyzerSubtopics.find((s) => s.id === selectedAnalyzer.subtopicId)
      const point = subtopic?.analyzerPoints.find((p) => p.id === selectedAnalyzer.pointId)

      if (topic && subtopic && point) {
        if (!criterias[topic.name]) {
          criterias[topic.name] = {}
        }
        if (!criterias[topic.name][subtopic.name]) {
          criterias[topic.name][subtopic.name] = []
        }
        if (!criterias[topic.name][subtopic.name].includes(point.name)) {
          criterias[topic.name][subtopic.name].push(point.name)
        }
      }
    })

    // Generate review using AI backend
    const reviewResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/general-review`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            industry,
            productType,
            brandPersonality,
            ageGroup,
            platform,
          },
          criterias,
          imageData,
        }),
      },
    )

    if (!reviewResponse.ok) {
      throw new Error("Failed to generate AI review")
    }

    const reviewResult = await reviewResponse.json()

    // Create a feedback result with AI-generated content
    const feedbackResult = await prisma.feedbackResult.create({
      data: {
        feedbackQuery: {
          connect: { id: feedbackQuery.id },
        },
        feedbackSummary: JSON.stringify(reviewResult.data), // Store the full AI response
        version: version,
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
