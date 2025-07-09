import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
})

export async function POST(request: NextRequest) {
  try {
    const { planId, amount } = await request.json()

    console.log("Payment intent request:", { planId, amount })

    // Validate input
    if (!planId || !amount || amount < 50) { // Stripe minimum is $0.50
      return NextResponse.json(
        { error: "Invalid plan or amount" },
        { status: 400 }
      )
    }

    // Check if Stripe secret key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY environment variable is not set")
      return NextResponse.json(
        { error: "Stripe configuration error" },
        { status: 500 }
      )
    }

    // TODO: Add authentication to get the actual user ID
    // For now, we'll use a placeholder
    // const userId = await getUserFromSession(request)

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        planId: planId,
        // userId: userId, // Add this when you have user authentication
      },
    })

    console.log("Payment intent created:", paymentIntent.id)
    console.log("Client secret:", paymentIntent.client_secret?.substring(0, 20) + "...")

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    )
  }
}
