import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, immediate = false } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }

    console.log(`Testing cancellation of Stripe subscription: ${subscriptionId}`);

    // First, get the subscription from Stripe to see its current state
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log(`Current Stripe subscription status: ${stripeSubscription.status}`);
    console.log(`Cancel at period end: ${stripeSubscription.cancel_at_period_end}`);

    // Get the subscription from our database
    const dbSubscription = await prisma.subscription.findFirst({
      where: { stripeSubId: subscriptionId },
      include: {
        planPrice: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!dbSubscription) {
      return NextResponse.json({ error: "Subscription not found in database" }, { status: 404 });
    }

    console.log(`Database subscription status: ${dbSubscription.status}`);
    console.log(`Database subscription autoRenew: ${dbSubscription.autoRenew}`);

    // Now try to cancel the subscription
    let result;
    if (immediate) {
      result = await stripe.subscriptions.cancel(subscriptionId);
      console.log(`Subscription canceled immediately. New status: ${result.status}`);
    } else {
      result = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      console.log(
        `Subscription set to cancel at period end. Status: ${result.status}, Cancel at period end: ${result.cancel_at_period_end}`
      );
    }

    return NextResponse.json({
      success: true,
      stripeSubscription: {
        id: result.id,
        status: result.status,
        cancel_at_period_end: result.cancel_at_period_end,
        current_period_end: result.current_period_end,
      },
      dbSubscription: {
        id: dbSubscription.id,
        status: dbSubscription.status,
        autoRenew: dbSubscription.autoRenew,
        planName: dbSubscription.planPrice.plan.name,
      },
    });
  } catch (error) {
    console.error("Error testing subscription cancellation:", error);
    return NextResponse.json(
      {
        error: "Failed to test subscription cancellation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
