import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const designMasters = await prisma.designMaster.findMany({
      include: {
        talks: {
          select: {
            id: true,
            title: true,
            content: true,
          },
        },
        blogs: {
          select: {
            id: true,
            title: true,
            content: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({
      designMasters,
    })
  } catch (error) {
    console.error("Error fetching design masters:", error)
    return NextResponse.json({ error: "Failed to fetch design masters" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, philosophy, methodology, signatureGestures, fitSummary, avatarUrl, talks, blogs } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const designMaster = await prisma.designMaster.create({
      data: {
        name,
        philosophy,
        methodology: methodology || [],
        signatureGestures: signatureGestures || [],
        fitSummary,
        avatarUrl,
        talks: {
          create: talks || [],
        },
        blogs: {
          create: blogs || [],
        },
      },
      include: {
        talks: true,
        blogs: true,
      },
    })

    return NextResponse.json({ designMaster }, { status: 201 })
  } catch (error) {
    console.error("Error creating design master:", error)
    return NextResponse.json({ error: "Failed to create design master" }, { status: 500 })
  }
}
