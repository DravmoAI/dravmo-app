import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      include: {
        screens: {
          include: {
            feedbackQueries: {
              include: {
                feedbackResults: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Transform the data to match the frontend interface
    const transformedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      screenCount: project.screens.length,
      lastFeedback:
        project.screens.length > 0
          ? project.screens
              .flatMap((screen) => screen.feedbackQueries)
              .flatMap((query) => query.feedbackResults)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
              ?.createdAt.toISOString() || project.updatedAt.toISOString()
          : project.updatedAt.toISOString(),
      status: "active" as const,
    }))

    return NextResponse.json({ projects: transformedProjects }, { status: 200 })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, userId } = body

    if (!name || !userId) {
      return NextResponse.json({ error: "Name and userId are required" }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        userId,
      },
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
