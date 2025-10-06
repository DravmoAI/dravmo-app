"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AlertCircle, CheckCircle } from "lucide-react"

interface StripePaymentFormProps {
  planName: string
  price: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function StripePaymentForm({ planName, price, onSuccess, onCancel }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || "An error occurred")
        setIsLoading(false)
        return
      }

      // Confirm the payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/billing?success=true`,
        },
        redirect: "if_required",
      })

      if (confirmError) {
        setError(confirmError.message || "Payment failed")
      } else {
        setSuccess(true)
        onSuccess?.()
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Payment error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Payment Successful!</h3>
              <p className="text-muted-foreground">
                Your subscription to {planName} has been activated.
              </p>
            </div>
            <Button onClick={onSuccess}>Continue</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <div className="text-sm text-muted-foreground">
          {planName} - ${price}/month
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          <PaymentElement 
            options={{
              layout: "tabs",
              paymentMethodOrder: ["card"],
            }}
          />

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={!stripe || !elements || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Processing...
                </>
              ) : (
                `Pay $${price}/month`
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </>
  )
}
