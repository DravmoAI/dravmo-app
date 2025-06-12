import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  try {
    // Get the auth token from cookies
    const cookieHeader = request.headers.get("cookie") || ""
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => {
        const [name, value] = cookie.split("=")
        return [name, value]
      }),
    )

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the session from the cookie
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ projects: [] }, { status: 200 })
    }

    const userId = session.user.id

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
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Get the auth token from cookies
    const cookieHeader = request.headers.get("cookie") || ""
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => {
        const [name, value] = cookie.split("=")
        return [name, value]
      }),
    )

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the session from the cookie
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

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
