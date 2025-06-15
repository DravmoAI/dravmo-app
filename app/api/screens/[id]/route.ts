import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const screen = await prisma.screen.findUnique({
      where: {
        id: params.id,
      },
      include: {
        project: true,
      },
    })

    if (!screen) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 })
    }

    return NextResponse.json({ screen }, { status: 200 })
  } catch (error) {
    console.error("Error fetching screen:", error)
    return NextResponse.json({ error: "Failed to fetch screen" }, { status: 500 })
  }
}
