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
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && plan) {
      createPaymentIntent();
    }
  }, [isOpen, plan]);

  const createPaymentIntent = async () => {
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
          amount: Math.round(plan.price * 100), // Convert to cents
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent");
      }

      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error creating payment intent:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    setClientSecret(null);
    onSuccess?.();
    onClose();
  };

  const handleClose = () => {
    setClientSecret(null);
    setError(null);
    onClose();
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to Dravmo</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
            <span className="ml-2">Setting up payment...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
            <button onClick={createPaymentIntent} className="mt-4 text-primary hover:underline">
              Try again
            </button>
          </div>
        )}

        {clientSecret && (
          <StripeProvider clientSecret={clientSecret}>
            <StripePaymentForm
              planName={plan.name}
              price={plan.price}
              onSuccess={handleSuccess}
              onCancel={handleClose}
            />
          </StripeProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
