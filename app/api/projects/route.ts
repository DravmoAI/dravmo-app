import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    // Get the authenticated user from Supabase
    const supabase = getSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
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
    // Get the authenticated user from Supabase
    const supabase = getSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        userId: user.id, // Use the authenticated user's ID from Supabase
      },
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
