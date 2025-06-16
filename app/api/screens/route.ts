import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const userId = searchParams.get("userId")

    if (!projectId && !userId) {
      return NextResponse.json({ error: "Project ID or User ID is required" }, { status: 400 })
    }

    const whereClause: any = {}

    if (projectId) {
      whereClause.projectId = projectId
    }

    if (userId) {
      whereClause.project = {
        userId: userId,
      }
    }

    const screens = await prisma.screen.findMany({
      where: whereClause,
      include: {
        project: true,
        feedbackQueries: {
          include: {
            feedbackResults: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json({ screens }, { status: 200 })
  } catch (error) {
    console.error("Error fetching screens:", error)
    return NextResponse.json({ error: "Failed to fetch screens" }, { status: 500 })
  }
}
