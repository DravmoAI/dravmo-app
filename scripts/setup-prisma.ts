import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Setting up Prisma with Supabase...")

  try {
    // Check if we can connect to the database
    await prisma.$connect()
    console.log("Successfully connected to the database")

    // Check if we can query the database
    const profileCount = await prisma.profile.count()
    console.log(`Found ${profileCount} profiles in the database`)

    console.log("Prisma setup complete!")
  } catch (error) {
    console.error("Error setting up Prisma:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
