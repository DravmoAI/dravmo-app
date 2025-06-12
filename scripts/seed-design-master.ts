import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    // Create a mock design master for feedback
    const designMaster = await prisma.designMaster.upsert({
      where: { id: "mock-design-master" },
      update: {},
      create: {
        id: "mock-design-master",
        name: "AI Design Assistant",
        description: "AI-powered design feedback system",
        version: "1.0",
      },
    })

    console.log("Design master created:", designMaster)
  } catch (error) {
    console.error("Error seeding design master:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
