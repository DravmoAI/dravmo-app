import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const features = [
    {
      name: "Three projects",
      slug: "three-projects",
      category: "core",
      description: "Up to 3 projects",
    },
    {
      name: "Unlimited projects",
      slug: "unlimited-projects",
      category: "core",
      description: "No project limit",
    },
    {
      name: "20 reviews/month",
      slug: "twenty-reviews",
      category: "core",
      description: "Up to 20 reviews per month",
    },
    {
      name: "60 reviews/month",
      slug: "sixty-reviews",
      category: "core",
      description: "Up to 60 reviews per month",
    },
    {
      name: "200 reviews/month",
      slug: "two-hundred-reviews",
      category: "core",
      description: "Up to 200 reviews per month",
    },
    {
      name: "Design persona setup",
      slug: "design-persona",
      category: "ai",
      description: "Set up design personas",
    },
    {
      name: "Layout & Structure",
      slug: "layout-structure",
      category: "ai",
      description: "Analyze layouts and structures automatically",
    },
    {
      name: "Typography",
      slug: "typography",
      category: "ai",
      description: "Review typography usage",
    },
    {
      name: "Color & Visual Design",
      slug: "color-visual-design",
      category: "ai",
      description: "Get color & visual design feedback",
    },
    {
      name: "Interactive Components",
      slug: "interactive-components",
      category: "ai",
      description: "Check interactions and components",
    },
    {
      name: "Imagery & Media",
      slug: "imagery-media",
      category: "ai",
      description: "Analyze images and media",
    },
    {
      name: "Accessibility & Usability",
      slug: "accessibility-usability",
      category: "ai",
      description: "Evaluate accessibility and usability",
    },
    {
      name: "Micro-Interactions & Animations",
      slug: "micro-interactions-animations",
      category: "ai",
      description: "Evaluate micro-interactions and animations",
    },
    {
      name: "Data Visualization",
      slug: "data-visualization",
      category: "ai",
      description: "Improve data visualization",
    },
    {
      name: "Master Mode",
      slug: "master-mode",
      category: "ai",
      description: "Advanced expert-level feedback",
    },
    {
      name: "Figma Integration",
      slug: "figma",
      category: "integration",
      description: "Connect with Figma",
    },
  ];

  // Upsert features (so you can re-run seeds safely)
  for (const f of features) {
    await prisma.feature.upsert({
      where: { slug: f.slug },
      update: {},
      create: f,
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
