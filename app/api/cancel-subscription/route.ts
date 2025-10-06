import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { userId, immediate = false } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get user's current active subscription
    const currentSubscription = await prisma.subscription.findFirst({
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
    });

    if (!currentSubscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    // Don't allow canceling free plans
    if (currentSubscription.planPrice.amount === 0) {
      return NextResponse.json({ error: "Cannot cancel free plan" }, { status: 400 });
    }

    // Get the free plan
    const freePlan = await prisma.plan.findFirst({
      where: {
        name: "Free",
      },
      include: {
        prices: {
          where: { billingInterval: "month" },
        },
      },
    });

    if (!freePlan) {
      return NextResponse.json({ error: "Free plan not found" }, { status: 500 });
    }

    // If the user has a Stripe subscription, cancel it
    if (currentSubscription.stripeSubId) {
      try {
        console.log(`Attempting to cancel Stripe subscription: ${currentSubscription.stripeSubId}`);

        if (immediate) {
          // Cancel immediately
          const canceledSubscription = await stripe.subscriptions.cancel(
            currentSubscription.stripeSubId
          );
          console.log(
            `Stripe subscription ${currentSubscription.stripeSubId} canceled immediately. Status: ${canceledSubscription.status}`
          );
        } else {
          // Cancel at period end (default behavior)
          const updatedSubscription = await stripe.subscriptions.update(
            currentSubscription.stripeSubId,
            {
              cancel_at_period_end: true,
            }
          );
          console.log(
            `Stripe subscription ${currentSubscription.stripeSubId} set to cancel at period end. Status: ${updatedSubscription.status}, Cancel at period end: ${updatedSubscription.cancel_at_period_end}`
          );
        }
      } catch (stripeError) {
        console.error("Error canceling Stripe subscription:", stripeError);
        console.error("Stripe error details:", JSON.stringify(stripeError, null, 2));

        // Return error instead of continuing
        return NextResponse.json(
          {
            error: "Failed to cancel subscription in Stripe",
            details: stripeError instanceof Error ? stripeError.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    } else {
      console.log(`No Stripe subscription ID found for subscription ${currentSubscription.id}`);
    }

    // Update the subscription in the database
    const result = await prisma.$transaction(async (tx) => {
      if (immediate) {
        // Cancel immediately - downgrade to free plan right away

        // Update current subscription to canceled
        await tx.subscription.update({
          where: { id: currentSubscription.id },
          data: {
            status: "canceled",
            autoRenew: false,
          },
        });

        // Get the free plan's monthly price
        const freePlanPrice = freePlan.prices[0];
        if (!freePlanPrice) {
          throw new Error("Free plan price not found");
        }

        // Create new free subscription
        const newSubscription = await tx.subscription.create({
          data: {
            planPriceId: freePlanPrice.id,
            userId,
            stripeSubId: null,
            autoRenew: false,
            status: "active",
          },
        });

        // No need to manage features as they are now part of the plan directly

        return {
          message:
            "Subscription canceled immediately. You have been downgraded to the free plan and will lose access to paid features.",
          newSubscription,
        };
      } else {
        // Cancel at period end - just disable auto-renewal
        await tx.subscription.update({
          where: { id: currentSubscription.id },
          data: {
            autoRenew: false,
          },
        });

        return {
          message:
            "Subscription will be canceled at the end of your current billing period. You'll continue to have access to paid features until then, then be automatically downgraded to the free plan.",
          currentSubscription,
        };
      }
    });

    console.log(`Subscription canceled for user ${userId}. Immediate: ${immediate}`);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
