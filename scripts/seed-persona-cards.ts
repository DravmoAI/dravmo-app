import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Delete existing persona cards
  await prisma.personaCard.deleteMany()

  // Create persona cards
  const personaCards = [
    {
      id: "minimalist",
      personaCardName: "Minimalist Maverick",
      personaPhilosophy: "Whitespace is my superpower.",
      personaMeaning: "You crave clean layouts, subtle details and maximum impact with minimal fuss.",
    },
    {
      id: "color",
      personaCardName: "Color Rebel",
      personaPhilosophy: "Neon, please. And make it bold.",
      personaMeaning: "You live for vibrant palettes, unexpected combos, and color-driven storytelling.",
    },
    {
      id: "layout",
      personaCardName: "Layout Architect",
      personaPhilosophy: "Grids are my blueprints.",
      personaMeaning: "You map every pixel to a system—precision, consistency, and modularity rule.",
    },
    {
      id: "motion",
      personaCardName: "Motion Maestro",
      personaPhilosophy: "If it doesn't move, is it even alive?",
      personaMeaning: "You bring interfaces to life with micro-interactions, transitions, and delight.",
    },
    {
      id: "accessibility",
      personaCardName: "Accessibility Advocate",
      personaPhilosophy: "Design for everyone, always.",
      personaMeaning: "You prioritize contrast, legibility, and inclusive UX above all else.",
    },
  ]

  for (const card of personaCards) {
    await prisma.personaCard.create({
      data: card,
    })
  }

  console.log(`Created ${personaCards.length} persona cards`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
