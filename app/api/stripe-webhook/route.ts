import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Received webhook event:", event.type);

    // Handle successful payment
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      console.log("Payment succeeded:", paymentIntent.id);
      console.log("Metadata:", paymentIntent.metadata);

      const { planId, userId } = paymentIntent.metadata;

      if (!planId || !userId) {
        console.error("Missing planId or userId in payment metadata");
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      // Update user's subscription in database
      const subscription = await updateUserSubscription(userId, planId, paymentIntent.id);

      // Create transaction record
      await createTransactionRecord({
        userId,
        subscriptionId: subscription.id,
        stripePaymentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from cents to dollars
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        description: `Payment for plan ${planId}`,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

async function updateUserSubscription(
  userId: string,
  planId: string,
  stripePaymentIntentId: string
) {
  try {
    console.log(`Updating subscription for user ${userId} to plan ${planId}`);

    // Get the plan details
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: {
        planFeatures: {
          include: {
            feature: true,
          },
        },
      },
    });

    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    // Update subscription in a transaction
    const newSubscription = await prisma.$transaction(async (tx) => {
      // Deactivate current subscription
      await tx.subscription.updateMany({
        where: {
          userId,
          status: "active",
        },
        data: {
          status: "canceled",
        },
      });

      // Create new subscription
      const newSubscription = await tx.subscription.create({
        data: {
          planId: plan.id,
          userId,
          stripeSubId: stripePaymentIntentId, // Use payment intent ID as subscription ID
          autoRenew: true, // Paid plans auto-renew
          status: "active",
        },
      });

      // Remove old subscription features
      await tx.subscriptionFeature.deleteMany({
        where: {
          subscription: {
            userId,
          },
        },
      });

      // Add new subscription features
      if (plan.planFeatures.length > 0) {
        await tx.subscriptionFeature.createMany({
          data: plan.planFeatures.map((planFeature) => ({
            subscriptionId: newSubscription.id,
            featureId: planFeature.featureId,
            isEnabled: true, // All features enabled for paid plans
          })),
        });
      }

      console.log(`Successfully updated subscription for user ${userId}`);
      console.log(`New subscription ID: ${newSubscription.id}`);
      console.log(`Added ${plan.planFeatures.length} features`);

      return newSubscription;
    });

    return newSubscription;
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error;
  }
}

async function createTransactionRecord({
  userId,
  subscriptionId,
  stripePaymentId,
  stripeInvoiceId,
  amount,
  currency,
  status,
  description,
}: {
  userId: string;
  subscriptionId?: string;
  stripePaymentId?: string;
  stripeInvoiceId?: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
}) {
  try {
    console.log(`Creating transaction record for user ${userId}`);

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        subscriptionId,
        stripePaymentId,
        stripeInvoiceId,
        amount,
        currency,
        status,
        description,
      },
    });

    console.log(`Transaction record created: ${transaction.id}`);
    console.log(`Amount: ${amount} ${currency}`);
    console.log(`Status: ${status}`);

    return transaction;
  } catch (error) {
    console.error("Error creating transaction record:", error);
    throw error;
  }
}
