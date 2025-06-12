import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedDesignMaster() {
  try {
    // Create a mock design master if it doesn't exist
    const existingMaster = await prisma.designMaster.findFirst({
      where: { id: "mock-master-id" },
    })

    if (!existingMaster) {
      await prisma.designMaster.create({
        data: {
          id: "mock-master-id",
          name: "AI Design Assistant",
          styleSummary:
            "Modern, clean, and user-focused design principles with emphasis on usability and accessibility.",
          userfulFor: "General UI/UX feedback and design improvements",
          bio: "An AI-powered design assistant that provides comprehensive feedback on user interface designs, focusing on modern design principles, usability, and accessibility standards.",
          avatarUrl: "/placeholder-user.jpg",
        },
      })
      console.log("Mock design master created successfully")
    } else {
      console.log("Mock design master already exists")
    }
  } catch (error) {
    console.error("Error seeding design master:", error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDesignMaster()
