"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, Star } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SectionCardDrawerProps {
  isOpen: boolean
  onClose: () => void
  section: {
    type: "current-plan" | "available-plans" | "transactions"
    data: any
  } | null
  onUpgrade: (plan: any, price: any) => void
  onSuccess: () => void
}

export default function SectionCardDrawer({ isOpen, onClose, section, onUpgrade, onSuccess }: SectionCardDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [isYearly, setIsYearly] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  if (!section) return null

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />}

      <div
        className={`fixed right-0 top-0 h-full w-full md:w-auto md:max-w-[600px] bg-card/20 backdrop-blur-lg border-l border-white/10 z-50 overflow-y-auto transition-all duration-300 ${
          isOpen ? "animate-slide-in-right" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 border-b border-border bg-card/50 backdrop-blur-sm p-6 md:p-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {section.type === "current-plan" && "Plan Details"}
            {section.type === "available-plans" && "Available Plans"}
            {section.type === "transactions" && "Transaction History"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-border rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 animate-scale-in">
          {section.type === "current-plan" && (
            <CurrentPlanDetails
              subscription={section.data.subscription}
              plans={section.data.plans}
              onUpgrade={onUpgrade}
              onSuccess={onSuccess}
            />
          )}
          {section.type === "available-plans" && (
            <AvailablePlansDetails
              plans={section.data.plans}
              subscription={section.data.subscription}
              isYearly={isYearly}
              setIsYearly={setIsYearly}
              onUpgrade={onUpgrade}
            />
          )}
          {section.type === "transactions" && <TransactionHistoryDetails transactions={section.data} />}
        </div>
      </div>
    </>
  )
}

function CurrentPlanDetails({ subscription, plans, onUpgrade, onSuccess }: any) {
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)
  const [cancelImmediate, setCancelImmediate] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  if (!subscription) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
        <p className="text-muted-foreground mb-4">
          You're currently on the free plan. Upgrade to a paid plan to unlock more features and higher limits.
        </p>
        <Button
          onClick={() => {
            const paidPlans = plans.filter((p: any) => p.price > 0)
            if (paidPlans.length > 0) {
              const plan = paidPlans[0]
              const monthlyPrice = plan.prices.find((p: any) => p.billingInterval === "month")
              onUpgrade(plan, monthlyPrice)
            }
          }}
        >
          Upgrade Now
        </Button>
      </div>
    )
  }

  const handleCancelSubscription = async (immediate: boolean = false) => {
    if (!subscription) return

    setCancelLoading(true)
    setCancelImmediate(immediate)
    try {
      const supabase = getSupabaseClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert("You must be logged in to cancel your subscription.")
        setCancelLoading(false)
        return
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
      })

      if (response.ok) {
        setCancelSuccess(true)
        setCancelLoading(false)
        setCancelError(null)
        onSuccess()
      } else {
        const error = await response.json()
        setCancelError(error.error || "Failed to cancel subscription. Please try again.")
        setCancelLoading(false)
      }
    } catch (error) {
      console.error("Error canceling subscription:", error)
      setCancelError("An error occurred while canceling your subscription. Please try again.")
      setCancelLoading(false)
    }
  }

  const handleCloseCancelDialog = () => {
    setShowCancelDialog(false)
    setCancelSuccess(false)
    setCancelLoading(false)
    setCancelError(null)
  }

  const handleRetryCancel = () => {
    setCancelError(null)
    setCancelLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">{subscription.planName} Plan</h3>
          <Badge className="bg-primary text-primary-foreground capitalize">{subscription.status}</Badge>
        </div>
        <p className="text-muted-foreground">
          ${subscription.price}/{subscription.billingInterval}
        </p>
      </div>

      <div>
        <h4 className="text-foreground font-semibold mb-4">Usage</h4>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Queries Used</span>
              <span className="text-foreground font-medium">
                {subscription.usedQueries}/{subscription.maxQueries === -1 ? "∞" : subscription.maxQueries}
              </span>
            </div>
            <Progress
              value={subscription.maxQueries === -1 ? 0 : (subscription.usedQueries / subscription.maxQueries) * 100}
              className="h-2"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-foreground font-semibold mb-4">Billing Info</h4>
        <div className="bg-border/30 rounded-lg p-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Period Start</span>
            <span className="text-foreground">{new Date(subscription.currentPeriodStart).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Period End</span>
            <span className="text-foreground">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Auto-Renewal</span>
            <span className="text-foreground">{subscription.autoRenew ? "Enabled" : "Disabled"}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-col">
        {subscription.planName !== "Pro" && (
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => {
              const paidPlans = plans.filter((p: any) => p.price > 0 && p.id !== subscription?.planId)
              if (paidPlans.length > 0) {
                const plan = paidPlans[0]
                const monthlyPrice = plan.prices.find((p: any) => p.billingInterval === "month")
                onUpgrade(plan, monthlyPrice)
              }
            }}
          >
            Upgrade Plan
          </Button>
        )}
        {subscription.price > 0 && (
          <AlertDialog open={showCancelDialog} onOpenChange={handleCloseCancelDialog}>
            <Button
              className="w-full bg-transparent"
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
            >
              Cancel Subscription
            </Button>
            <AlertDialogContent className="!min-w-[550px]">
              {cancelSuccess ? (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Subscription Canceled Successfully
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                      {cancelImmediate
                        ? "Your subscription has been canceled immediately and you've been downgraded to the free plan."
                        : "Your subscription has been scheduled for cancellation at the end of your current billing period. You'll continue to have access to paid features until then."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="!justify-start gap-2">
                    <Button variant="outline" onClick={handleCloseCancelDialog}>
                      Close
                    </Button>
                  </AlertDialogFooter>
                </>
              ) : cancelError ? (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                      <X className="w-5 h-5" />
                      Failed to Cancel Subscription
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">{cancelError}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="!justify-start gap-2">
                    <Button variant="outline" onClick={handleCloseCancelDialog}>
                      Close
                    </Button>
                    <Button onClick={handleRetryCancel} className="bg-primary hover:bg-primary/90">
                      Try Again
                    </Button>
                  </AlertDialogFooter>
                </>
              ) : (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {cancelLoading ? "Canceling Subscription..." : "Cancel Subscription"}
                    </AlertDialogTitle>
                    {cancelLoading ? (
                      <AlertDialogDescription className="text-left">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          Please wait while we process your cancellation...
                        </div>
                      </AlertDialogDescription>
                    ) : (
                      <AlertDialogDescription className="text-left">
                        Are you sure you want to cancel your subscription? You have two options:
                        <br />
                        <br />
                        <strong>Cancel at period end:</strong> You'll continue to have access to paid features until the
                        end of your current billing period, then be automatically downgraded to the free plan.
                        <br />
                        <br />
                        <strong>Cancel immediately:</strong> Your subscription will be canceled right away and you'll be
                        downgraded to the free plan immediately.
                      </AlertDialogDescription>
                    )}
                  </AlertDialogHeader>
                  <AlertDialogFooter className="!justify-start">
                    {cancelLoading ? null : (
                      <>
                        <AlertDialogCancel disabled={cancelLoading}>Keep Subscription</AlertDialogCancel>
                        {subscription.autoRenew && (
                          <Button
                            variant="outline"
                            onClick={() => handleCancelSubscription(false)}
                            disabled={cancelLoading}
                          >
                            Cancel at Period End
                          </Button>
                        )}
                        <Button
                          onClick={() => handleCancelSubscription(true)}
                          disabled={cancelLoading}
                          className="bg-destructive hover:bg-destructive/90 text-white"
                        >
                          Cancel Immediately
                        </Button>
                      </>
                    )}
                  </AlertDialogFooter>
                </>
              )}
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}

function AvailablePlansDetails({ plans, subscription, isYearly, setIsYearly, onUpgrade }: any) {
  const formatPlanFeatures = (plan: any) => {
    const features = []
    if (plan.maxProjects === -1) {
      features.push("Unlimited projects")
    } else {
      features.push(`Up to ${plan.maxProjects} projects`)
    }
    if (plan.maxQueries === -1) {
      features.push("Unlimited queries")
    } else {
      features.push(`${plan.maxQueries} queries/month`)
    }
    if (plan.aiModel) features.push(`${plan.aiModel} AI`)
    if (plan.figmaIntegration) features.push("Figma integration")
    if (plan.masterMode) features.push("Master mode")
    if (plan.prioritySupport) features.push("Priority support")
    if (plan.customBranding) features.push("Custom branding")
    if (plan.exportToPDF) features.push("Export to PDF")
    return features
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-4 bg-border/20 rounded-lg p-4">
        <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
          Monthly
        </span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>Yearly</span>
      </div>

      {plans.map((plan: any, index: number) => {
        const isPopular = index === 1
        const selectedPrice = plan.prices.find((p: any) => p.billingInterval === (isYearly ? "year" : "month"))
        const displayPrice = selectedPrice ? selectedPrice.amount : plan.price
        const features = formatPlanFeatures(plan)

        const monthlyPrice = plan.prices.find((p: any) => p.billingInterval === "month")
        const yearlyPrice = plan.prices.find((p: any) => p.billingInterval === "year")
        const yearlySavings =
          monthlyPrice && yearlyPrice
            ? Math.round(((monthlyPrice.amount * 12 - yearlyPrice.amount) / (monthlyPrice.amount * 12)) * 100)
            : 0

        return (
          <Card key={plan.id} className={`bg-card/20 backdrop-blur-lg border-white/10 relative ${isPopular ? "border-primary" : ""}`}>
            {isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Most Popular
                </div>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">{plan.name}</CardTitle>
                <span className="text-2xl font-bold text-primary">
                  ${displayPrice}
                  <span className="text-sm text-muted-foreground font-normal">/{isYearly ? "yr" : "mo"}</span>
                </span>
              </div>
              {isYearly && yearlySavings > 0 && (
                <div className="text-sm text-green-600 font-medium">Save {yearlySavings}% annually</div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-4"
                variant={subscription?.planId === plan.id ? "outline" : isPopular ? "default" : "outline"}
                disabled={subscription?.planId === plan.id || displayPrice === 0}
                onClick={(e) => {
                  e.preventDefault()
                  onUpgrade(plan, selectedPrice)
                }}
              >
                {subscription?.planId === plan.id ? "Current Plan" : displayPrice === 0 ? "Free Plan" : "Select Plan"}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function TransactionHistoryDetails({ transactions }: any) {
  return (
    <div className="space-y-3">
      {transactions.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No transactions yet</p>
      ) : (
        transactions.map((txn: any) => ( // Added type for txn
          <Card key={txn.id} className="bg-card/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{txn.description}</h4>
                <span className="font-bold text-foreground">${txn.amount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{new Date(txn.date).toLocaleDateString()}</span>
                <Badge variant={txn.status === "succeeded" ? "default" : "destructive"} className="capitalize">
                  {txn.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
