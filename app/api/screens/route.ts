import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { projectId, sourceUrl, sourceType } = body

    if (!projectId || !sourceUrl || !sourceType) {
      return NextResponse.json({ error: "ProjectId, sourceUrl, and sourceType are required" }, { status: 400 })
    }

    const screen = await prisma.screen.create({
      data: {
        projectId,
        sourceUrl,
        sourceType,
      },
    })

    // Create a mock feedback query and result for the new screen
    const mockFeedbackQuery = await prisma.feedbackQuery.create({
      data: {
        screenId: screen.id,
        designMasterId: "mock-master-id", // We'll need to create a mock design master
        industry: "Technology",
        productType: "Mobile App",
        purpose: "User Interface",
        audience: "General Users",
        ageGroup: "18-35",
        brandPersonality: "Modern",
        platform: "Mobile",
      },
    })

    const mockFeedbackResult = await prisma.feedbackResult.create({
      data: {
        queryId: mockFeedbackQuery.id,
        feedbackSummary:
          "This design shows strong visual hierarchy and clean typography. The color palette is well-balanced and creates good contrast for readability. Consider improving the spacing between elements for better visual breathing room. The interactive elements are clearly defined and follow modern UI patterns. Overall, this is a solid design foundation with room for minor refinements.",
        version: "1.0",
      },
    })

    return NextResponse.json({ screen }, { status: 201 })
  } catch (error) {
    console.error("Error creating screen:", error)
    return NextResponse.json({ error: "Failed to create screen" }, { status: 500 })
  }
}
