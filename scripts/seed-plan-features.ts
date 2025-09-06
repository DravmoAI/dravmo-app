import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const litePlan = await prisma.plan.findFirst({ where: { name: "lite" } });
  const proPlan = await prisma.plan.findFirst({ where: { name: "pro" } });
  const freePlan = await prisma.plan.findFirst({ where: { name: "free" } });

  // Query features
  const features = await prisma.feature.findMany();

  // Helper
  const findFeature = (slug: string) => features.find((f: any) => f.slug === slug)!;

  // Free plan features
  if (freePlan) {
    await prisma.planFeature.createMany({
      data: [
        { planId: freePlan.id, featureId: findFeature("typography").id, category: "ai" },
        { planId: freePlan.id, featureId: findFeature("design-persona").id, category: "ai" },
        { planId: freePlan.id, featureId: findFeature("three-projects").id, category: "core" },
        { planId: freePlan.id, featureId: findFeature("twenty-reviews").id, category: "core" },
        { planId: freePlan.id, featureId: findFeature("layout-structure").id, category: "ai" },
        { planId: freePlan.id, featureId: findFeature("color-visual-design").id, category: "ai" },
      ],
      skipDuplicates: true,
    });
  }

  // Lite plan features
  if (litePlan) {
    await prisma.planFeature.createMany({
      data: [
        { planId: litePlan.id, featureId: findFeature("sixty-reviews").id, category: "core" },
        { planId: litePlan.id, featureId: findFeature("unlimited-projects").id, category: "core" },

        { planId: litePlan.id, featureId: findFeature("master-mode").id, category: "ai" },
        { planId: litePlan.id, featureId: findFeature("typography").id, category: "ai" },
        { planId: litePlan.id, featureId: findFeature("imagery-media").id, category: "ai" },
        { planId: litePlan.id, featureId: findFeature("design-persona").id, category: "ai" },
        { planId: litePlan.id, featureId: findFeature("layout-structure").id, category: "ai" },
        { planId: litePlan.id, featureId: findFeature("data-visualization").id, category: "ai" },
        { planId: litePlan.id, featureId: findFeature("color-visual-design").id, category: "ai" },
        {
          planId: litePlan.id,
          featureId: findFeature("accessibility-usability").id,
          category: "ai",
        },
        {
          planId: litePlan.id,
          featureId: findFeature("interactive-components").id,
          category: "ai",
        },
        {
          planId: litePlan.id,
          featureId: findFeature("micro-interactions-animations").id,
          category: "ai",
        },
      ],
      skipDuplicates: true,
    });
  }

  // Pro plan features
  if (proPlan) {
    await prisma.planFeature.createMany({
      data: [
        { planId: proPlan.id, featureId: findFeature("unlimited-projects").id, category: "core" },
        { planId: proPlan.id, featureId: findFeature("two-hundred-reviews").id, category: "core" },

        { planId: proPlan.id, featureId: findFeature("master-mode").id, category: "ai" },
        { planId: proPlan.id, featureId: findFeature("typography").id, category: "ai" },
        { planId: proPlan.id, featureId: findFeature("imagery-media").id, category: "ai" },
        { planId: proPlan.id, featureId: findFeature("design-persona").id, category: "ai" },
        { planId: proPlan.id, featureId: findFeature("layout-structure").id, category: "ai" },
        { planId: proPlan.id, featureId: findFeature("data-visualization").id, category: "ai" },
        { planId: proPlan.id, featureId: findFeature("color-visual-design").id, category: "ai" },
        {
          planId: proPlan.id,
          featureId: findFeature("accessibility-usability").id,
          category: "ai",
        },
        {
          planId: proPlan.id,
          featureId: findFeature("interactive-components").id,
          category: "ai",
        },
        {
          planId: proPlan.id,
          featureId: findFeature("micro-interactions-animations").id,
          category: "ai",
        },
      ],
      skipDuplicates: true,
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
// To run: npx ts-node scripts/seed-plan-features.ts
