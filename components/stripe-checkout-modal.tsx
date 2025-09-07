"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StripeProvider } from "@/components/stripe-provider";
import { StripePaymentForm } from "@/components/stripe-payment-form";
import { LoadingSpinner } from "@/components/loading-spinner";
import { getSupabaseClient } from "@/lib/supabase";

interface Plan {
  id: string;
  name: string;
  price: number;
  stripePriceId?: string;
}

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onSuccess?: () => void;
}

export function StripeCheckoutModal({
  isOpen,
  onClose,
  plan,
  onSuccess,
}: StripeCheckoutModalProps) {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && plan) {
      createSubscription();
    }
  }, [isOpen, plan]);

  const createSubscription = async () => {
    if (!plan) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get user's auth token
      const supabase = getSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          planId: plan.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subscription");
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error creating subscription:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCheckoutUrl(null);
    setError(null);
    onClose();
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to {plan.name} Plan</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
            <span className="ml-2">Redirecting to checkout...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
            <button onClick={createSubscription} className="mt-4 text-primary hover:underline">
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              You will be redirected to Stripe Checkout to complete your subscription.
            </p>
            <div className="space-y-2">
              <p className="font-medium">{plan.name} Plan</p>
              <p className="text-2xl font-bold">${plan.price}/month</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
