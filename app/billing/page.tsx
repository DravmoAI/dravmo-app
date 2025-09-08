"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreditCard, Download, Star, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { StripeCheckoutModal } from "@/components/stripe-checkout-modal";

interface Subscription {
  id: string;
  planId: string;
  planName: string;
  price: number;
  status: "active" | "canceled" | "past_due";
  autoRenew: boolean;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  maxProjects: number;
  maxQueries: number;
  usedProjects: number;
  usedQueries: number;
}

interface PlanFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  maxProjects: number;
  maxQueries: number;
  aiModel?: string;
  stripePriceId?: string;
  features: PlanFeature[];
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const supabase = getSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch plans from API
        const plansResponse = await fetch("/api/plans");
        if (plansResponse.ok) {
          const plansData = await plansResponse.json();
          setPlans(plansData.plans);
        }

        // Fetch user's subscription with real usage data
        const subscriptionResponse = await fetch(`/api/user-subscription?userId=${user.id}`);
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          setSubscription(subscriptionData.subscription);
        }

        // Fetch user's transaction history
        const transactionsResponse = await fetch(`/api/transactions?userId=${user.id}`);
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          setBillingHistory(transactionsData.transactions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Stripe checkout success/cancel redirects
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const canceled = urlParams.get("canceled");
    const sessionId = urlParams.get("session_id");

    if (success === "true" && sessionId) {
      // Subscription was successful, refresh data
      const refreshData = async () => {
        try {
          const supabase = getSupabaseClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            // Refresh subscription data
            const subscriptionResponse = await fetch(`/api/user-subscription?userId=${user.id}`);
            if (subscriptionResponse.ok) {
              const subscriptionData = await subscriptionResponse.json();
              setSubscription(subscriptionData.subscription);
            }

            // Refresh transaction history
            const transactionsResponse = await fetch(`/api/transactions?userId=${user.id}`);
            if (transactionsResponse.ok) {
              const transactionsData = await transactionsResponse.json();
              setBillingHistory(transactionsData.transactions);
            }
          }
        } catch (error) {
          console.error("Error refreshing data after subscription:", error);
        }
      };

      refreshData();

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled === "true") {
      // User canceled the subscription
      console.log("Subscription checkout was canceled");

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleUpgradePlan = (plan: Plan) => {
    // Don't allow upgrading to the same plan
    if (subscription?.planId === plan.id) {
      return;
    }

    // Don't allow upgrading to free plan
    if (plan.price === 0) {
      return;
    }

    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh subscription and transaction data after successful payment
    const fetchData = async () => {
      try {
        const supabase = getSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Refresh subscription data
          const subscriptionResponse = await fetch(`/api/user-subscription?userId=${user.id}`);
          if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json();
            setSubscription(subscriptionData.subscription);
          }

          // Refresh transaction history
          const transactionsResponse = await fetch(`/api/transactions?userId=${user.id}`);
          if (transactionsResponse.ok) {
            const transactionsData = await transactionsResponse.json();
            setBillingHistory(transactionsData.transactions);
          }
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    };

    fetchData();
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  const handleCancelSubscription = async (immediate: boolean = false) => {
    if (!subscription) return;

    setCancelLoading(true);
    try {
      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in to cancel your subscription.");
        return;
      }

      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          immediate,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);

        // Refresh subscription and billing data
        const fetchData = async () => {
          try {
            // Refresh subscription data
            const subscriptionResponse = await fetch(`/api/user-subscription?userId=${user.id}`);
            if (subscriptionResponse.ok) {
              const subscriptionData = await subscriptionResponse.json();
              setSubscription(subscriptionData.subscription);
            } else {
              // If no subscription found, set to null (user is now on free plan)
              setSubscription(null);
            }

            // Refresh transaction history
            const transactionsResponse = await fetch(`/api/transactions?userId=${user.id}`);
            if (transactionsResponse.ok) {
              const transactionsData = await transactionsResponse.json();
              setBillingHistory(transactionsData.transactions);
            }
          } catch (error) {
            console.error("Error refreshing data:", error);
          }
        };

        await fetchData();
        setShowCancelDialog(false);
      } else {
        const error = await response.json();
        alert(`Error canceling subscription: ${error.error}`);
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert("An error occurred while canceling your subscription. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleUpdatePaymentMethod = () => {
    // In a real app, this would redirect to Stripe customer portal
    alert("Redirecting to payment method update...");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "canceled":
        return "destructive";
      case "past_due":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const formatPlanFeatures = (plan: Plan) => {
    const features = [];

    // Add basic plan limits
    if (plan.maxProjects === -1) {
      features.push("Unlimited projects");
    } else {
      features.push(`Up to ${plan.maxProjects} projects`);
    }

    if (plan.maxQueries === -1) {
      features.push("Unlimited feedback queries");
    } else {
      features.push(`${plan.maxQueries} feedback queries per month`);
    }

    // Add AI model info if available
    if (plan.aiModel) {
      features.push(`${plan.aiModel} AI model`);
    }

    // Add features from database
    plan.features.forEach((feature) => {
      features.push(feature.name);
    });

    return features;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold font-krona-one">Billing & Subscription</h2>
          <p className="text-muted-foreground">Manage your subscription and billing information</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between ">
              <CardTitle>Current Plan</CardTitle>
              {subscription && (
                <Badge variant={getStatusColor(subscription.status)} className="capitalize">
                  {subscription.status}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold capitalize">{subscription.planName} Plan</h3>
                    <p className="text-muted-foreground">
                      ${subscription.price}/month
                      {/* Next billing: {formatDate(subscription.currentPeriodEnd)} */}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Auto-renewal</div>
                    <div className="font-medium">
                      {subscription.autoRenew ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Projects Used</span>
                      <span className="text-sm text-muted-foreground">
                        {subscription.usedProjects}/
                        {subscription.maxProjects === -1 ? "∞" : subscription.maxProjects}
                      </span>
                    </div>
                    <Progress
                      value={
                        subscription.maxProjects === -1
                          ? 0
                          : (subscription.usedProjects / subscription.maxProjects) * 100
                      }
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Queries Used</span>
                      <span className="text-sm text-muted-foreground">
                        {subscription.usedQueries}/
                        {subscription.maxQueries === -1 ? "∞" : subscription.maxQueries}
                      </span>
                    </div>
                    <Progress
                      value={
                        subscription.maxQueries === -1
                          ? 0
                          : (subscription.usedQueries / subscription.maxQueries) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      // Find the next available paid plan
                      const paidPlans = plans.filter(
                        (p) => p.price > 0 && p.id !== subscription?.planId
                      );
                      if (paidPlans.length > 0) {
                        handleUpgradePlan(paidPlans[0]);
                      }
                    }}
                  >
                    Upgrade Plan
                  </Button>

                  <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Cancel Subscription</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="!min-w-[550px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>

                        <AlertDialogDescription className="text-left">
                          Are you sure you want to cancel your subscription? You have two options:
                          <br />
                          <br />
                          <strong>Cancel at period end:</strong> You'll continue to have access to
                          paid features until the end of your current billing period, then be
                          automatically downgraded to the free plan.
                          <br />
                          <br />
                          <strong>Cancel immediately:</strong> Your subscription will be canceled
                          right away and you'll be downgraded to the free plan immediately.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter className="!justify-start">
                        <AlertDialogCancel disabled={cancelLoading}>
                          Keep Subscription
                        </AlertDialogCancel>
                        <Button
                          variant="outline"
                          onClick={() => handleCancelSubscription(false)}
                          disabled={cancelLoading}
                        >
                          {cancelLoading ? "Canceling..." : "Cancel at Period End"}
                        </Button>

                        <AlertDialogAction
                          onClick={() => handleCancelSubscription(true)}
                          disabled={cancelLoading}
                          className="bg-destructive hover:bg-destructive/90 text-white"
                        >
                          {cancelLoading ? "Canceling..." : "Cancel Immediately"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            ) : (
              // Free plan user or no subscription
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                <p className="text-muted-foreground mb-4">
                  You're currently on the free plan. Upgrade to a paid plan to unlock more features
                  and higher limits.
                </p>
                <Button
                  onClick={() => {
                    // Find the first paid plan
                    const paidPlans = plans.filter((p) => p.price > 0);
                    if (paidPlans.length > 0) {
                      handleUpgradePlan(paidPlans[0]);
                    }
                  }}
                >
                  Upgrade Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-muted-foreground">Loading plans...</div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan, index) => {
                  const isPopular = index === 1; // Make the middle plan popular
                  const planFeatures = formatPlanFeatures(plan);

                  return (
                    <Card key={plan.id} className={`relative ${isPopular ? "border-primary" : ""}`}>
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Most Popular
                          </div>
                        </div>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl capitalize">{plan.name}</CardTitle>
                        <div className="text-2xl font-bold">
                          ${plan.price}
                          <span className="text-sm font-normal text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {planFeatures.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          className="w-full"
                          variant={
                            subscription?.planId === plan.id
                              ? "outline"
                              : isPopular
                              ? "default"
                              : "outline"
                          }
                          disabled={subscription?.planId === plan.id || plan.price === 0}
                          onClick={(e) => {
                            e.preventDefault();
                            handleUpgradePlan(plan);
                          }}
                        >
                          {subscription?.planId === plan.id
                            ? "Current Plan"
                            : plan.price === 0
                            ? "Free Plan"
                            : "Select Plan"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {billingHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No transactions yet</div>
            ) : (
              <div className="space-y-4">
                {billingHistory.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">${transaction.amount}</div>
                        <Badge
                          variant={transaction.status === "succeeded" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stripe Checkout Modal */}
        <StripeCheckoutModal
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </DashboardLayout>
  );
}
