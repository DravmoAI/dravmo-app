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

    // Calculate the correct next billing date based on billing interval
    const calculateNextBillingDate = (createdAt: Date, billingInterval: string) => {
      const nextBilling = new Date(createdAt);
      if (billingInterval === "year") {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
      } else {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
      }
      return nextBilling;
    };

    const nextBillingDate = calculateNextBillingDate(
      subscription.createdAt,
      subscription.planPrice.billingInterval
    );

    // Transform the data to match the frontend interface
    const transformedSubscription = {
      id: subscription.id,
      planId: subscription.planPrice.plan.id,
      planName: subscription.planPrice.plan.name || "Unnamed Plan",
      price: subscription.planPrice.amount / 100, // Convert cents to dollars
      billingInterval: subscription.planPrice.billingInterval, // Add billing interval
      status: subscription.status as "active" | "canceled" | "past_due",
      autoRenew: subscription.autoRenew,
      currentPeriodStart: subscription.createdAt.toISOString(),
      currentPeriodEnd: nextBillingDate.toISOString(),
      maxProjects: subscription.planPrice.plan.maxProjects,
      maxQueries: subscription.planPrice.plan.maxQueries,
      usedProjects: projectCount,
      usedQueries: queryCount,
      features: {
        figmaIntegration: subscription.planPrice.plan.figmaIntegration,
        masterMode: subscription.planPrice.plan.masterMode,
        prioritySupport: subscription.planPrice.plan.prioritySupport,
        advancedAnalytics: subscription.planPrice.plan.advancedAnalytics,
        customBranding: subscription.planPrice.plan.customBranding,
        exportToPDF: subscription.planPrice.plan.exportToPDF,
        premiumAnalyzers: subscription.planPrice.plan.premiumAnalyzers,
      },
    };

    return NextResponse.json({ subscription: transformedSubscription }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
}
