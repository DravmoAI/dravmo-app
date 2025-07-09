"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AlertCircle, CheckCircle } from "lucide-react"

// Make sure to replace this with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_...")

interface PaymentFormProps {
  clientSecret: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

function PaymentForm({ clientSecret, onSuccess, onError }: PaymentFormProps) {
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
        onError?.(submitError.message || "An error occurred")
        setIsLoading(false)
        return
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/billing?success=true`,
        },
        redirect: "if_required",
      })

      if (confirmError) {
        setError(confirmError.message || "Payment failed")
        onError?.(confirmError.message || "Payment failed")
      } else {
        setSuccess(true)
        onSuccess?.()
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred"
      setError(errorMessage)
      onError?.(errorMessage)
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
                Your payment has been processed successfully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
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
              paymentMethodOrder: ["card", "apple_pay", "google_pay"],
            }}
          />

          <Button
            type="submit"
            disabled={!stripe || !elements || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              "Pay Now"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

interface SimpleStripeFormProps {
  planId?: string
  amount?: number
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function SimpleStripeForm({ 
  planId = "pro", 
  amount = 2900, // $29.00 in cents
  onSuccess, 
  onError 
}: SimpleStripeFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    createPaymentIntent()
  }, [planId, amount])

  const createPaymentIntent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Creating payment intent with:", { planId, amount })
      
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          amount,
        }),
      })

      const data = await response.json()
      console.log("Payment intent response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent")
      }

      if (!data.clientSecret) {
        throw new Error("No client secret received")
      }

      setClientSecret(data.clientSecret)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      onError?.(errorMessage)
      console.error("Error creating payment intent:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const options = {
    clientSecret: clientSecret || "",
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
            <span className="ml-2">Setting up payment...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={createPaymentIntent} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Initializing payment...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm 
        clientSecret={clientSecret} 
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}
