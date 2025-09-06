import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
      },
      include: {
        plan: {
          include: {
            planFeatures: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match the frontend interface
    const transformedSubscriptions = subscriptions.map((subscription) => ({
      id: subscription.id,
      planId: subscription.planId,
      planName: subscription.plan.name || "Unnamed Plan",
      price: Number(subscription.plan.price),
      status: subscription.status as "active" | "canceled" | "past_due",
      autoRenew: subscription.autoRenew,
      currentPeriodStart: subscription.createdAt.toISOString(),
      currentPeriodEnd: subscription.updatedAt.toISOString(),
      maxProjects: subscription.plan.maxProjects,
      maxQueries: subscription.plan.maxQueries,
      usedProjects: 0, // TODO: Calculate actual usage
      usedQueries: 0, // TODO: Calculate actual usage
      features: subscription.plan.planFeatures.map((planFeature) => ({
        id: planFeature.feature.id,
        name: planFeature.feature.name,
        description: planFeature.feature.description,
        category: planFeature.category,
        slug: planFeature.feature.slug,
      })),
    }));

    return NextResponse.json({ subscriptions: transformedSubscriptions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}
