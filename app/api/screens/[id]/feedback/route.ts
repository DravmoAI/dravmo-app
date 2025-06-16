import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const screenId = params.id

    if (!screenId) {
      return NextResponse.json({ error: "Screen ID is required" }, { status: 400 })
    }

    // Fetch all feedback results for this screen
    const feedbackResults = await prisma.feedbackResult.findMany({
      where: {
        feedbackQuery: {
          screenId: screenId,
        },
      },
      include: {
        feedbackQuery: {
          include: {
            designMaster: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ feedbackResults }, { status: 200 })
  } catch (error) {
    console.error("Error fetching feedback results:", error)
    return NextResponse.json({ error: "Failed to fetch feedback results" }, { status: 500 })
  }
}
