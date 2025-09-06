import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
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

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    // Count user's projects
    const projectCount = await prisma.project.count({
      where: {
        userId,
      },
    });

    // Count user's feedback queries by backtracking: feedback_queries <- screens <- projects <- user
    const queryCount = await prisma.feedbackQuery.count({
      where: {
        screen: {
          project: {
            userId,
          },
        },
      },
    });

    // Transform the data to match the frontend interface
    const transformedSubscription = {
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
      usedProjects: projectCount,
      usedQueries: queryCount,
      features: subscription.plan.planFeatures.map((planFeature) => ({
        id: planFeature.feature.id,
        name: planFeature.feature.name,
        description: planFeature.feature.description,
        category: planFeature.category,
        slug: planFeature.feature.slug,
      })),
    };

    return NextResponse.json({ subscription: transformedSubscription }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
}
