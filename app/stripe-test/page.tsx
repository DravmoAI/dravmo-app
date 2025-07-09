"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StripeCheckoutModal } from "@/components/stripe-checkout-modal"

const mockPlan = {
  id: "pro",
  name: "Pro",
  price: 29,
  stripePriceId: "price_pro_monthly",
}

export default function StripeTestPage() {
  const [showCheckout, setShowCheckout] = useState(false)

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Stripe Integration Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Click the button below to test the Stripe embedded payment form.
          </p>
          <Button onClick={() => setShowCheckout(true)} className="w-full">
            Test Stripe Payment
          </Button>
        </CardContent>
      </Card>

      <StripeCheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        plan={mockPlan}
        onSuccess={() => alert("Payment successful!")}
      />
    </div>
  )
}
