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

    console.log("=== WEBHOOK EVENT RECEIVED ===");
    console.log("Event type:", event.type);
    console.log("Event ID:", event.id);
    console.log("Event data:", JSON.stringify(event.data.object, null, 2));

    // Handle subscription creation
    if (event.type === "checkout.session.completed") {
      console.log("Processing checkout.session.completed event");
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Session mode:", session.mode);
      console.log("Session metadata:", session.metadata);

      if (session.mode === "subscription") {
        console.log("Retrieving subscription:", session.subscription);
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        console.log("Subscription retrieved:", subscription.id);

        try {
          await handleSubscriptionCreated(subscription, session.metadata);
          console.log("Subscription created successfully");
        } catch (error) {
          console.error("Error creating subscription:", error);
        }

        // Also try to create transaction record immediately if invoice is available
        try {
          await handleInitialPaymentTransaction(subscription, session.metadata);
          console.log("Initial payment transaction handled");
        } catch (error) {
          console.error("Error handling initial payment transaction:", error);
        }
      } else {
        console.log("Session mode is not subscription, skipping");
      }
    }

    // Handle subscription renewals and initial payments
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;

      if ((invoice as any).subscription) {
        await handleSubscriptionRenewal(invoice);
      }
    }

    // Handle failed payments
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;

      if ((invoice as any).subscription) {
        await handlePaymentFailed(invoice);
      }
    }

    // Handle subscription updates
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
    }

    // Handle subscription cancellations (both immediate and at period end)
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCanceled(subscription);
    }

    // Keep the old payment_intent.succeeded handler for backward compatibility
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      console.log("Payment succeeded:", paymentIntent.id);
      console.log("Metadata:", paymentIntent.metadata);

      const { planPriceId, userId } = paymentIntent.metadata;

      if (!planPriceId || !userId) {
        console.error("Missing planPriceId or userId in payment metadata");
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      // Update user's subscription in database
      const subscription = await updateUserSubscription(userId, planPriceId, paymentIntent.id);

      // Create transaction record
      await createTransactionRecord({
        userId,
        subscriptionId: subscription.id,
        stripePaymentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from cents to dollars
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        description: `Payment for plan price ${planPriceId}`,
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
  planPriceId: string,
  stripePaymentIntentId: string
) {
  try {
    console.log(`Updating subscription for user ${userId} to plan price ${planPriceId}`);

    // Get the plan price details
    const planPrice = await prisma.planPrice.findUnique({
      where: { id: planPriceId },
      include: {
        plan: true,
      },
    });

    if (!planPrice) {
      throw new Error(`Plan price ${planPriceId} not found`);
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
          planPriceId: planPrice.id,
          userId,
          stripeSubId: stripePaymentIntentId, // Use payment intent ID as subscription ID
          autoRenew: true, // Paid plans auto-renew
          status: "active",
        },
      });

      console.log(`Successfully updated subscription for user ${userId}`);
      console.log(`New subscription ID: ${newSubscription.id}`);
      console.log(`Plan: ${planPrice.plan.name} (${planPrice.billingInterval})`);

      return newSubscription;
    });

    return newSubscription;
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, metadata: any) {
  try {
    console.log("=== HANDLING SUBSCRIPTION CREATION ===");
    console.log("Stripe subscription ID:", subscription.id);
    console.log("Metadata received:", metadata);

    const { userId, planPriceId } = metadata;

    if (!userId) {
      throw new Error("Missing userId in metadata");
    }

    if (!planPriceId) {
      throw new Error("Missing planPriceId in metadata");
    }

    console.log(`Creating subscription for user ${userId} with plan price ${planPriceId}`);

    // Get the plan price details
    const planPrice = await prisma.planPrice.findUnique({
      where: { id: planPriceId },
      include: {
        plan: true,
      },
    });

    if (!planPrice) {
      throw new Error(`Plan price ${planPriceId} not found`);
    }

    // Create subscription in database
    const newSubscription = await prisma.$transaction(async (tx) => {
      // Deactivate any existing subscriptions
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
          planPriceId: planPrice.id,
          userId,
          stripeSubId: subscription.id,
          autoRenew: true,
          status: "active",
        },
      });

      return newSubscription;
    });

    // Create transaction record for the initial subscription payment as backup
    try {
      console.log("Creating transaction record for initial payment");
      // Get the latest invoice for this subscription to get payment details
      const invoices = await stripe.invoices.list({
        subscription: subscription.id,
        limit: 1,
      });

      console.log(`Found ${invoices.data.length} invoices for subscription ${subscription.id}`);

      if (invoices.data.length > 0) {
        const invoice = invoices.data[0];

        // Check if transaction already exists (in case invoice.payment_succeeded already fired)
        const existingTransaction = await prisma.transaction.findFirst({
          where: {
            subscriptionId: newSubscription.id,
            stripeInvoiceId: invoice.id,
          },
        });

        if (!existingTransaction) {
          await prisma.transaction.create({
            data: {
              userId,
              subscriptionId: newSubscription.id,
              stripeInvoiceId: invoice.id,
              amount: invoice.amount_paid / 100, // Convert from cents to dollars
              currency: invoice.currency,
              status: "succeeded",
              description: `Initial payment for ${planPrice.plan.name} subscription`,
            },
          });

          console.log(`Transaction record created for initial subscription payment: ${invoice.id}`);
        } else {
          console.log(`Transaction already exists for invoice ${invoice.id}`);
        }
      } else {
        console.log(`No invoice found for subscription ${subscription.id}`);
      }
    } catch (error) {
      console.error("Error creating transaction record for initial payment:", error);
      // Don't throw here as the subscription was already created successfully
    }

    console.log(`Subscription created: ${newSubscription.id}`);
    return newSubscription;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

async function handleInitialPaymentTransaction(subscription: Stripe.Subscription, metadata: any) {
  try {
    const { userId, planPriceId } = metadata;

    console.log(`Handling initial payment transaction for subscription ${subscription.id}`);

    // Get the subscription from our database
    const dbSubscription = await prisma.subscription.findFirst({
      where: { stripeSubId: subscription.id },
    });

    if (!dbSubscription) {
      console.error(`Subscription not found in database for ${subscription.id}`);
      return;
    }

    // Get the latest invoice for this subscription
    const invoices = await stripe.invoices.list({
      subscription: subscription.id,
      limit: 1,
    });

    if (invoices.data.length > 0) {
      const invoice = invoices.data[0];

      // Check if transaction already exists
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          subscriptionId: dbSubscription.id,
          stripeInvoiceId: invoice.id,
        },
      });

      if (!existingTransaction && invoice.amount_paid > 0) {
        await prisma.transaction.create({
          data: {
            userId,
            subscriptionId: dbSubscription.id,
            stripeInvoiceId: invoice.id,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency,
            status: "succeeded",
            description: `Initial payment for subscription - ${subscription.id}`,
          },
        });

        console.log(`Initial payment transaction created for subscription ${subscription.id}`);
      } else if (existingTransaction) {
        console.log(`Transaction already exists for invoice ${invoice.id}`);
      } else {
        console.log(
          `No payment found for invoice ${invoice.id} (amount_paid: ${invoice.amount_paid})`
        );
      }
    } else {
      console.log(`No invoices found for subscription ${subscription.id}`);
    }
  } catch (error) {
    console.error("Error handling initial payment transaction:", error);
    // Don't throw here as this is a backup mechanism
  }
}

async function handleSubscriptionRenewal(invoice: Stripe.Invoice) {
  try {
    console.log(`Handling subscription payment for invoice ${invoice.id}`);
    console.log(`Invoice billing_reason: ${invoice.billing_reason}`);
    console.log(`Invoice amount_paid: ${invoice.amount_paid}`);
    console.log(`Invoice subscription: ${(invoice as any).subscription}`);

    // Get subscription ID from invoice
    const subscriptionId = (invoice as any).subscription;

    if (!subscriptionId) {
      console.error(`No subscription ID found for invoice ${invoice.id}`);
      return;
    }

    // Get the subscription
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubId: subscriptionId },
    });

    if (!subscription) {
      console.error(`Subscription not found for Stripe subscription ${subscriptionId}`);
      return;
    }

    // Check if this is an initial payment or renewal
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        subscriptionId: subscription.id,
        stripeInvoiceId: invoice.id,
      },
    });

    if (existingTransaction) {
      console.log(`Transaction already exists for invoice ${invoice.id}`);
      return;
    }

    // Determine if this is an initial payment or renewal
    const isInitialPayment = invoice.billing_reason === "subscription_create";
    const description = isInitialPayment
      ? `Initial payment for subscription - ${subscriptionId}`
      : `Subscription renewal - ${subscriptionId}`;

    // Create transaction record for successful payment
    await prisma.transaction.create({
      data: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: "succeeded",
        description,
      },
    });

    console.log(
      `${isInitialPayment ? "Initial payment" : "Renewal"} transaction created for user ${
        subscription.userId
      }`
    );
  } catch (error) {
    console.error("Error handling subscription payment:", error);
    throw error;
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log(`Handling payment failure for invoice ${invoice.id}`);

    // Get subscription ID from invoice
    const subscriptionId = (invoice as any).subscription;

    if (!subscriptionId) {
      console.error(`No subscription ID found for invoice ${invoice.id}`);
      return;
    }

    // Update subscription status to past_due
    await prisma.subscription.updateMany({
      where: { stripeSubId: subscriptionId },
      data: { status: "past_due" },
    });

    console.log(`Subscription marked as past_due for ${subscriptionId}`);
  } catch (error) {
    console.error("Error handling payment failure:", error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log(`Handling subscription update for ${subscription.id}`);
    console.log(`Stripe subscription status: ${subscription.status}`);
    console.log(`Cancel at period end: ${subscription.cancel_at_period_end}`);
    console.log(`Current period end: ${new Date((subscription as any).current_period_end * 1000)}`);

    // Update subscription status based on Stripe status
    let status = "active";
    if (subscription.status === "canceled") {
      status = "canceled";
    } else if (subscription.status === "past_due") {
      status = "past_due";
    } else if (subscription.status === "unpaid") {
      status = "past_due";
    }

    const updateResult = await prisma.subscription.updateMany({
      where: { stripeSubId: subscription.id },
      data: {
        status,
        autoRenew: !subscription.cancel_at_period_end,
      },
    });

    console.log(
      `Subscription updated: ${
        subscription.id
      } -> ${status}, autoRenew: ${!subscription.cancel_at_period_end}`
    );
    console.log(`Database update result: ${updateResult.count} records updated`);
  } catch (error) {
    console.error("Error handling subscription update:", error);
    throw error;
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  try {
    console.log(`Handling subscription cancellation for ${subscription.id}`);

    // Get the current subscription from our database
    const currentSubscription = await prisma.subscription.findFirst({
      where: { stripeSubId: subscription.id },
      include: {
        planPrice: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!currentSubscription) {
      console.error(
        `Subscription not found in database for Stripe subscription ${subscription.id}`
      );
      return;
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
      console.error("Free plan not found");
      return;
    }

    // Update subscription and downgrade to free plan
    await prisma.$transaction(async (tx) => {
      // Update current subscription to canceled
      await tx.subscription.update({
        where: { id: currentSubscription.id },
        data: {
          status: "canceled",
          autoRenew: false,
        },
      });

      // Get the free plan's monthly price
      const freePlanPrice = freePlan.prices.find((p) => p.billingInterval === "month");
      if (!freePlanPrice) {
        throw new Error("Free plan monthly price not found");
      }

      // Create new free subscription
      const newSubscription = await tx.subscription.create({
        data: {
          planPriceId: freePlanPrice.id,
          userId: currentSubscription.userId,
          stripeSubId: null,
          autoRenew: false,
          status: "active",
        },
      });

      // No need to manage features as they are now part of the plan directly

      console.log(
        `User ${currentSubscription.userId} downgraded to free plan after subscription cancellation`
      );
    });

    console.log(`Subscription canceled and user downgraded to free plan: ${subscription.id}`);
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
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
