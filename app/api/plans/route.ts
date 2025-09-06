import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      include: {
        planFeatures: {
          include: {
            feature: true,
          },
        },
      },
      orderBy: {
        price: "asc",
      },
    });

    // Transform the data to match the frontend interface
    const transformedPlans = plans.map((plan) => ({
      id: plan.id,
      name: plan.name || "Unnamed Plan",
      price: Number(plan.price),
      maxProjects: plan.maxProjects,
      maxQueries: plan.maxQueries,
      aiModel: plan.aiModel,
      stripePriceId: plan.stripePriceId,
      features: plan.planFeatures.map((planFeature) => ({
        id: planFeature.feature.id,
        name: planFeature.feature.name,
        description: planFeature.feature.description,
        category: planFeature.category,
        slug: planFeature.feature.slug,
      })),
    }));

    return NextResponse.json({ plans: transformedPlans }, { status: 200 });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}
