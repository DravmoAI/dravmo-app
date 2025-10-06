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
        planPrice: {
          include: {
            plan: true,
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
      planId: subscription.planPrice.plan.id,
      planName: subscription.planPrice.plan.name || "Unnamed Plan",
      price: subscription.planPrice.amount / 100, // Convert cents to dollars
      status: subscription.status as "active" | "canceled" | "past_due",
      autoRenew: subscription.autoRenew,
      currentPeriodStart: subscription.createdAt.toISOString(),
      currentPeriodEnd: subscription.updatedAt.toISOString(),
      maxProjects: subscription.planPrice.plan.maxProjects,
      maxQueries: subscription.planPrice.plan.maxQueries,
      usedProjects: 0, // TODO: Calculate actual usage
      usedQueries: 0, // TODO: Calculate actual usage
      features: {
        figmaIntegration: subscription.planPrice.plan.figmaIntegration,
        masterMode: subscription.planPrice.plan.masterMode,
        prioritySupport: subscription.planPrice.plan.prioritySupport,
        advancedAnalytics: subscription.planPrice.plan.advancedAnalytics,
        customBranding: subscription.planPrice.plan.customBranding,
        exportToPDF: subscription.planPrice.plan.exportToPDF,
        premiumAnalyzers: subscription.planPrice.plan.premiumAnalyzers,
      },
    }));

    return NextResponse.json({ subscriptions: transformedSubscriptions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}
