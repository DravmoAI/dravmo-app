import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const designMasters = await prisma.designMaster.findMany()
    return NextResponse.json({ designMasters }, { status: 200 })
  } catch (error) {
    console.error("Error fetching design masters:", error)
    return NextResponse.json({ error: "Failed to fetch design masters" }, { status: 500 })
  }
}
