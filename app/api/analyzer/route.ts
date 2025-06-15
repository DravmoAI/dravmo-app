import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const topics = await prisma.analyzerTopic.findMany({
      include: {
        analyzerSubtopics: {
          include: {
            analyzerPoints: true,
          },
        },
      },
    })

    return NextResponse.json({ topics }, { status: 200 })
  } catch (error) {
    console.error("Error fetching analyzer topics:", error)
    return NextResponse.json({ error: "Failed to fetch analyzer topics" }, { status: 500 })
  }
}
