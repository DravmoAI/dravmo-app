import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, email, fullName } = body

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        id,
        email,
        fullName,
      },
    })

    return NextResponse.json({ profile }, { status: 201 })
  } catch (error) {
    console.error("Error creating profile:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, fullName, avatarUrl } = body

    // Update profile
    const profile = await prisma.profile.update({
      where: { id },
      data: {
        fullName,
        avatarUrl,
      },
    })

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
