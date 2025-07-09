"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { ReactNode } from "react"

// Make sure to replace this with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_...")

interface StripeProviderProps {
  children: ReactNode
  clientSecret?: string
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "hsl(var(--primary))",
        colorBackground: "hsl(var(--background))",
        colorText: "hsl(var(--foreground))",
        colorDanger: "hsl(var(--destructive))",
        fontFamily: "system-ui, sans-serif",
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={clientSecret ? options : undefined}>
      {children}
    </Elements>
  )
}
