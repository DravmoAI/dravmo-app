import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const feedbackId = params.id

    if (!feedbackId) {
      return NextResponse.json({ error: "Feedback ID is required" }, { status: 400 })
    }

    // Fetch the feedback result with all related data
    const feedbackResult = await prisma.feedbackResult.findUnique({
      where: { id: feedbackId },
      include: {
        feedbackQuery: {
          include: {
            designMaster: true,
            screen: {
              include: {
                project: true,
              },
            },
          },
        },
        analyzerResults: {
          include: {
            analyzerPoint: {
              include: {
                analyzerSubtopic: {
                  include: {
                    analyzerTopic: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!feedbackResult) {
      return NextResponse.json({ error: "Feedback result not found" }, { status: 404 })
    }

    return NextResponse.json({ feedbackResult }, { status: 200 })
  } catch (error) {
    console.error("Error fetching feedback result:", error)
    return NextResponse.json({ error: "Failed to fetch feedback result" }, { status: 500 })
  }
}
