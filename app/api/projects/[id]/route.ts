import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
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
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Transform screens data
    const transformedScreens = project.screens.map((screen) => ({
      id: screen.id,
      projectId: screen.projectId,
      sourceUrl: screen.sourceUrl,
      sourceType: screen.sourceType as "upload" | "figma",
      createdAt: screen.createdAt.toISOString(),
      updatedAt: screen.updatedAt.toISOString(),
      feedbackCount: screen.feedbackQueries.length,
      lastFeedback:
        screen.feedbackQueries.length > 0
          ? screen.feedbackQueries
              .flatMap((query) => query.feedbackResults)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
              ?.createdAt.toISOString()
          : undefined,
    }))

    const transformedProject = {
      id: project.id,
      name: project.name,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      status: "active" as const,
    }

    return NextResponse.json(
      {
        project: transformedProject,
        screens: transformedScreens,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name } = body

    const project = await prisma.project.update({
      where: {
        id: params.id,
      },
      data: {
        name,
      },
    })

    return NextResponse.json({ project }, { status: 200 })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.project.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
