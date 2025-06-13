import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, sourceUrl, sourceType } = body;

    if (!projectId || !sourceUrl || !sourceType) {
      return NextResponse.json(
        { error: "ProjectId, sourceUrl, and sourceType are required" },
        { status: 400 }
      );
    }

    // Check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create the screen
    const screen = await prisma.screen.create({
      data: {
        projectId,
        sourceUrl,
        sourceType,
      },
    });

    return NextResponse.json({ screen }, { status: 201 });
  } catch (error) {
    console.error("Error creating screen:", error);
    return NextResponse.json({ error: "Failed to create screen" }, { status: 500 });
  }
}
