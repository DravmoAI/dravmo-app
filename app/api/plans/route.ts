import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      include: {
        prices: {
          where: { isActive: true },
          orderBy: { billingInterval: "asc" },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Transform the data to match the frontend interface
    const transformedPlans = plans.map((plan) => {
      // Get monthly price as default (for backward compatibility)
      const monthlyPrice = plan.prices.find((p) => p.billingInterval === "month");
      const yearlyPrice = plan.prices.find((p) => p.billingInterval === "year");

      return {
        id: plan.id,
        name: plan.name || "Unnamed Plan",
        price: monthlyPrice ? monthlyPrice.amount / 100 : 0, // Convert cents to dollars
        maxProjects: plan.maxProjects,
        maxQueries: plan.maxQueries,
        aiModel: plan.aiModel,
        stripeProductId: plan.stripeProductId,
        prices: plan.prices.map((price) => ({
          id: price.id,
          billingInterval: price.billingInterval,
          amount: price.amount / 100, // Convert cents to dollars
          currency: price.currency,
          stripePriceId: price.stripePriceId,
        })),
        features: {
          figmaIntegration: plan.figmaIntegration,
          masterMode: plan.masterMode,
          prioritySupport: plan.prioritySupport,
          advancedAnalytics: plan.advancedAnalytics,
          customBranding: plan.customBranding,
          exportToPDF: plan.exportToPDF,
          premiumAnalyzers: plan.premiumAnalyzers,
        },
        figmaIntegration: plan.figmaIntegration,
        masterMode: plan.masterMode,
        prioritySupport: plan.prioritySupport,
        advancedAnalytics: plan.advancedAnalytics,
        customBranding: plan.customBranding,
        exportToPDF: plan.exportToPDF,
        premiumAnalyzers: plan.premiumAnalyzers,
      };
    });

    return NextResponse.json({ plans: transformedPlans }, { status: 200 });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}
