import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting to seed analyzer data...")

  // Create design masters
  const designMasters = [
    {
      name: "Dieter Rams",
      styleSummary: "Less, but better. Focuses on minimalism and functionality.",
      userfulFor: "Product design, minimalist interfaces, functional design",
      bio: "German industrial designer closely associated with Braun and functionalist design. Known for his 'less but better' approach.",
      avatarUrl: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Paul Rand",
      styleSummary: "Iconic simplicity with a focus on memorable visual elements.",
      userfulFor: "Logo design, branding, visual identity",
      bio: "American art director and graphic designer, best known for corporate logo designs including IBM, UPS, and ABC.",
      avatarUrl: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Susan Kare",
      styleSummary: "Pixel-perfect iconography with human-centered design.",
      userfulFor: "Icon design, user interface, visual communication",
      bio: "American artist and graphic designer who created many of the interface elements for the original Apple Macintosh in the 1980s.",
      avatarUrl: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Massimo Vignelli",
      styleSummary: "Timeless grid systems and typographic clarity.",
      userfulFor: "Typography, layout design, information design",
      bio: "Italian designer who worked in a number of areas ranging from package design to furniture design to public signage.",
      avatarUrl: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Jony Ive",
      styleSummary: "Refined minimalism with attention to materials and details.",
      userfulFor: "Product design, hardware interfaces, industrial design",
      bio: "British-American industrial and product designer who was the Chief Design Officer of Apple Inc.",
      avatarUrl: "/placeholder.svg?height=200&width=200",
    },
  ]

  for (const master of designMasters) {
    await prisma.designMaster.upsert({
      where: { name: master.name },
      update: master,
      create: master,
    })
  }

  console.log("Design masters seeded successfully!")

  // Create analyzer topics, subtopics, and points
  const layoutTopic = await prisma.analyzerTopic.upsert({
    where: { id: "layout-topic" },
    update: {
      name: "Layout & Structure",
      description: "Analysis of the overall layout, grid system, and structural organization of the design.",
    },
    create: {
      id: "layout-topic",
      name: "Layout & Structure",
      description: "Analysis of the overall layout, grid system, and structural organization of the design.",
    },
  })

  const typographyTopic = await prisma.analyzerTopic.upsert({
    where: { id: "typography-topic" },
    update: {
      name: "Typography & Readability",
      description: "Evaluation of font choices, text hierarchy, and overall readability of the content.",
    },
    create: {
      id: "typography-topic",
      name: "Typography & Readability",
      description: "Evaluation of font choices, text hierarchy, and overall readability of the content.",
    },
  })

  const colorTopic = await prisma.analyzerTopic.upsert({
    where: { id: "color-topic" },
    update: {
      name: "Color & Visual Rhythm",
      description: "Assessment of color palette, contrast, and visual flow throughout the design.",
    },
    create: {
      id: "color-topic",
      name: "Color & Visual Rhythm",
      description: "Assessment of color palette, contrast, and visual flow throughout the design.",
    },
  })

  // Create layout subtopics
  const gridSubtopic = await prisma.analyzerSubtopic.upsert({
    where: { id: "grid-subtopic" },
    update: {
      topicId: layoutTopic.id,
      name: "Grid System",
      description: "Analysis of the underlying grid structure and alignment principles.",
    },
    create: {
      id: "grid-subtopic",
      topicId: layoutTopic.id,
      name: "Grid System",
      description: "Analysis of the underlying grid structure and alignment principles.",
    },
  })

  const spacingSubtopic = await prisma.analyzerSubtopic.upsert({
    where: { id: "spacing-subtopic" },
    update: {
      topicId: layoutTopic.id,
      name: "Spacing & Whitespace",
      description: "Evaluation of the use of whitespace, margins, and padding throughout the design.",
    },
    create: {
      id: "spacing-subtopic",
      topicId: layoutTopic.id,
      name: "Spacing & Whitespace",
      description: "Evaluation of the use of whitespace, margins, and padding throughout the design.",
    },
  })

  // Create typography subtopics
  const fontSubtopic = await prisma.analyzerSubtopic.upsert({
    where: { id: "font-subtopic" },
    update: {
      topicId: typographyTopic.id,
      name: "Font Selection",
      description: "Analysis of typeface choices and their appropriateness for the content and brand.",
    },
    create: {
      id: "font-subtopic",
      topicId: typographyTopic.id,
      name: "Font Selection",
      description: "Analysis of typeface choices and their appropriateness for the content and brand.",
    },
  })

  const textHierarchySubtopic = await prisma.analyzerSubtopic.upsert({
    where: { id: "text-hierarchy-subtopic" },
    update: {
      topicId: typographyTopic.id,
      name: "Text Hierarchy",
      description: "Evaluation of heading, subheading, and body text relationships and visual hierarchy.",
    },
    create: {
      id: "text-hierarchy-subtopic",
      topicId: typographyTopic.id,
      name: "Text Hierarchy",
      description: "Evaluation of heading, subheading, and body text relationships and visual hierarchy.",
    },
  })

  // Create color subtopics
  const paletteSubtopic = await prisma.analyzerSubtopic.upsert({
    where: { id: "palette-subtopic" },
    update: {
      topicId: colorTopic.id,
      name: "Color Palette",
      description: "Analysis of the color scheme and its alignment with brand identity and user expectations.",
    },
    create: {
      id: "palette-subtopic",
      topicId: colorTopic.id,
      name: "Color Palette",
      description: "Analysis of the color scheme and its alignment with brand identity and user expectations.",
    },
  })

  const contrastSubtopic = await prisma.analyzerSubtopic.upsert({
    where: { id: "contrast-subtopic" },
    update: {
      topicId: colorTopic.id,
      name: "Contrast & Accessibility",
      description: "Evaluation of color contrast for readability and accessibility compliance.",
    },
    create: {
      id: "contrast-subtopic",
      topicId: colorTopic.id,
      name: "Contrast & Accessibility",
      description: "Evaluation of color contrast for readability and accessibility compliance.",
    },
  })

  // Create grid points
  await prisma.analyzerPoint.upsert({
    where: { id: "grid-alignment-point" },
    update: {
      subtopicId: gridSubtopic.id,
      name: "Element Alignment",
      description: "Assessment of how well elements align to the grid system.",
    },
    create: {
      id: "grid-alignment-point",
      subtopicId: gridSubtopic.id,
      name: "Element Alignment",
      description: "Assessment of how well elements align to the grid system.",
    },
  })

  await prisma.analyzerPoint.upsert({
    where: { id: "grid-consistency-point" },
    update: {
      subtopicId: gridSubtopic.id,
      name: "Grid Consistency",
      description: "Evaluation of grid consistency across different sections and components.",
    },
    create: {
      id: "grid-consistency-point",
      subtopicId: gridSubtopic.id,
      name: "Grid Consistency",
      description: "Evaluation of grid consistency across different sections and components.",
    },
  })

  // Create spacing points
  await prisma.analyzerPoint.upsert({
    where: { id: "whitespace-usage-point" },
    update: {
      subtopicId: spacingSubtopic.id,
      name: "Whitespace Usage",
      description: "Analysis of how whitespace is used to create visual breathing room and focus.",
    },
    create: {
      id: "whitespace-usage-point",
      subtopicId: spacingSubtopic.id,
      name: "Whitespace Usage",
      description: "Analysis of how whitespace is used to create visual breathing room and focus.",
    },
  })

  await prisma.analyzerPoint.upsert({
    where: { id: "spacing-rhythm-point" },
    update: {
      subtopicId: spacingSubtopic.id,
      name: "Spacing Rhythm",
      description: "Evaluation of the rhythm and consistency of spacing throughout the design.",
    },
    create: {
      id: "spacing-rhythm-point",
      subtopicId: spacingSubtopic.id,
      name: "Spacing Rhythm",
      description: "Evaluation of the rhythm and consistency of spacing throughout the design.",
    },
  })

  // Create font points
  await prisma.analyzerPoint.upsert({
    where: { id: "typeface-appropriateness-point" },
    update: {
      subtopicId: fontSubtopic.id,
      name: "Typeface Appropriateness",
      description: "Assessment of how well the chosen typefaces match the brand personality and content.",
    },
    create: {
      id: "typeface-appropriateness-point",
      subtopicId: fontSubtopic.id,
      name: "Typeface Appropriateness",
      description: "Assessment of how well the chosen typefaces match the brand personality and content.",
    },
  })

  await prisma.analyzerPoint.upsert({
    where: { id: "font-pairing-point" },
    update: {
      subtopicId: fontSubtopic.id,
      name: "Font Pairing",
      description: "Evaluation of how well different fonts work together in the design.",
    },
    create: {
      id: "font-pairing-point",
      subtopicId: fontSubtopic.id,
      name: "Font Pairing",
      description: "Evaluation of how well different fonts work together in the design.",
    },
  })

  // Create text hierarchy points
  await prisma.analyzerPoint.upsert({
    where: { id: "heading-hierarchy-point" },
    update: {
      subtopicId: textHierarchySubtopic.id,
      name: "Heading Hierarchy",
      description: "Analysis of the visual distinction between different heading levels.",
    },
    create: {
      id: "heading-hierarchy-point",
      subtopicId: textHierarchySubtopic.id,
      name: "Heading Hierarchy",
      description: "Analysis of the visual distinction between different heading levels.",
    },
  })

  await prisma.analyzerPoint.upsert({
    where: { id: "text-emphasis-point" },
    update: {
      subtopicId: textHierarchySubtopic.id,
      name: "Text Emphasis",
      description: "Evaluation of how emphasis is applied to important text elements.",
    },
    create: {
      id: "text-emphasis-point",
      subtopicId: textHierarchySubtopic.id,
      name: "Text Emphasis",
      description: "Evaluation of how emphasis is applied to important text elements.",
    },
  })

  // Create color palette points
  await prisma.analyzerPoint.upsert({
    where: { id: "color-harmony-point" },
    update: {
      subtopicId: paletteSubtopic.id,
      name: "Color Harmony",
      description: "Assessment of how well colors work together to create a harmonious palette.",
    },
    create: {
      id: "color-harmony-point",
      subtopicId: paletteSubtopic.id,
      name: "Color Harmony",
      description: "Assessment of how well colors work together to create a harmonious palette.",
    },
  })

  await prisma.analyzerPoint.upsert({
    where: { id: "brand-alignment-point" },
    update: {
      subtopicId: paletteSubtopic.id,
      name: "Brand Alignment",
      description: "Evaluation of how well the color palette aligns with the brand identity.",
    },
    create: {
      id: "brand-alignment-point",
      subtopicId: paletteSubtopic.id,
      name: "Brand Alignment",
      description: "Evaluation of how well the color palette aligns with the brand identity.",
    },
  })

  // Create contrast points
  await prisma.analyzerPoint.upsert({
    where: { id: "text-contrast-point" },
    update: {
      subtopicId: contrastSubtopic.id,
      name: "Text Contrast",
      description: "Analysis of text-to-background contrast for readability.",
    },
    create: {
      id: "text-contrast-point",
      subtopicId: contrastSubtopic.id,
      name: "Text Contrast",
      description: "Analysis of text-to-background contrast for readability.",
    },
  })

  await prisma.analyzerPoint.upsert({
    where: { id: "wcag-compliance-point" },
    update: {
      subtopicId: contrastSubtopic.id,
      name: "WCAG Compliance",
      description: "Evaluation of color contrast compliance with accessibility standards.",
    },
    create: {
      id: "wcag-compliance-point",
      subtopicId: contrastSubtopic.id,
      name: "WCAG Compliance",
      description: "Evaluation of color contrast compliance with accessibility standards.",
    },
  })

  console.log("Analyzer topics, subtopics, and points seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
