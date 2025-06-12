import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const personaCards = await prisma.personaCard.findMany()
    return NextResponse.json({ personaCards }, { status: 200 })
  } catch (error) {
    console.error("Error fetching persona cards:", error)
    return NextResponse.json({ error: "Failed to fetch persona cards" }, { status: 500 })
  }
}
