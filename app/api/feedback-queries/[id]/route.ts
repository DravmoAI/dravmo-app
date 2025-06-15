import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const feedbackQuery = await prisma.feedbackQuery.findUnique({
      where: {
        id: params.id,
      },
      include: {
        screen: {
          include: {
            project: true,
          },
        },
        designMaster: true,
        feedbackResults: {
          orderBy: {
            createdAt: "desc",
          },
        },
        selectAnalyzers: {
          include: {
            analyzerTopic: true,
            analyzerSubtopic: true,
            analyzerPoint: true,
          },
        },
      },
    })

    if (!feedbackQuery) {
      return NextResponse.json({ error: "Feedback query not found" }, { status: 404 })
    }

    return NextResponse.json({ feedbackQuery }, { status: 200 })
  } catch (error) {
    console.error("Error fetching feedback query:", error)
    return NextResponse.json({ error: "Failed to fetch feedback query" }, { status: 500 })
  }
}
