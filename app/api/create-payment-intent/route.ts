import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { planId, billingInterval = "month" } = await request.json();

    console.log("Subscription creation request:", { planId, billingInterval });

    // Validate input
    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }

    // Check if Stripe secret key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY environment variable is not set");
      return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 });
    }

    // Get user from Supabase auth
    const supabase = getSupabaseClient();
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid authentication" }, { status: 401 });
    }

    // Get the plan details with the specific price for the billing interval
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: {
        prices: {
          where: {
            billingInterval: billingInterval,
            isActive: true,
          },
        },
      },
    });

    console.log("Plan details:", plan);

    if (!plan || !plan.prices.length) {
      return NextResponse.json(
        { error: "Plan not found or not configured for this billing interval" },
        { status: 404 }
      );
    }

    const planPrice = plan.prices[0];
    if (!planPrice.stripePriceId) {
      return NextResponse.json({ error: "Plan price not configured in Stripe" }, { status: 404 });
    }

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
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

    // If user has an active subscription, check if it's a free plan
    if (existingSubscription) {
      const existingPlanPrice = existingSubscription.planPrice.amount;
      const newPlanPrice = planPrice.amount;

      // Allow upgrade from free plan to paid plan
      if (existingPlanPrice === 0 && newPlanPrice > 0) {
        console.log(`User ${user.id} upgrading from free plan to paid plan ${plan.id}`);
      } else if (existingSubscription.planPrice.plan.id === plan.id) {
        return NextResponse.json(
          {
            error: "You are already subscribed to this plan",
          },
          { status: 400 }
        );
      } else if (existingPlanPrice > 0 && newPlanPrice > 0) {
        return NextResponse.json(
          {
            error:
              "You already have an active paid subscription. Please cancel your current subscription first.",
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            error: "You already have an active subscription",
          },
          { status: 400 }
        );
      }
    }

    // Create or retrieve Stripe customer
    let customer;
    try {
      // Try to find existing customer by email
      const customers = await stripe.customers.list({
        email: user.email!,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: user.email!,
          metadata: {
            userId: user.id,
          },
        });
      }
    } catch (error) {
      console.error("Error creating/finding customer:", error);
      return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
    }

    // Create Stripe checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: planPrice.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: {
        userId: user.id,
        planId: planId,
        planPriceId: planPrice.id,
        billingInterval: billingInterval,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planId: planId,
          planPriceId: planPrice.id,
          billingInterval: billingInterval,
        },
      },
    });

    console.log("Checkout session created:", session.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
