import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, email, firstName, lastName, fullName, hasCompletedPersona } = body

    // Create or update profile
    const profile = await prisma.profile.upsert({
      where: { id },
      update: {
        firstName,
        lastName,
        fullName,
        hasCompletedPersona,
      },
      create: {
        id,
        email,
        firstName,
        lastName,
        fullName,
        hasCompletedPersona: hasCompletedPersona || false,
        designFocus: [],
      },
    })

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error) {
    console.error("Error creating/updating profile:", error)
    return NextResponse.json({ error: "Failed to create/update profile" }, { status: 500 })
  }
}
