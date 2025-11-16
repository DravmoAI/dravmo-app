"use client"

import { useState, useEffect, useTransition } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"
import SectionCardDrawer from "@/components/billing/section-card-drawer"
import { StripeCheckoutModal } from "@/components/stripe-checkout-modal"
import { LoadingProgressBar } from "@/components/loading-progress-bar"

interface Subscription {
  id: string
  planId: string
  planName: string
  price: number
  billingInterval: "month" | "year"
  status: "active" | "canceled" | "past_due"
  autoRenew: boolean
  currentPeriodStart: string
  currentPeriodEnd: string
  maxProjects: number
  maxQueries: number
  usedProjects: number
  usedQueries: number
}

interface PlanPrice {
  id: string
  billingInterval: "month" | "year"
  amount: number
  currency: string
  stripePriceId: string
}

interface Plan {
  id: string
  name: string
  price: number
  maxProjects: number
  maxQueries: number
  aiModel?: string
  stripeProductId?: string
  prices: PlanPrice[]
  features: {
    figmaIntegration: boolean
    masterMode: boolean
    prioritySupport: boolean
    advancedAnalytics: boolean
    customBranding: boolean
    exportToPDF: boolean
    premiumAnalyzers: string[]
  }
  figmaIntegration: boolean
  masterMode: boolean
  prioritySupport: boolean
  advancedAnalytics: boolean
  customBranding: boolean
  exportToPDF: boolean
  premiumAnalyzers: string[]
}

interface Transaction {
  id: string
  description: string
  date: string
  amount: number
  status: "succeeded" | "failed" | "pending"
}

export default function BillingPage() {
  const [isPending, startTransition] = useTransition()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const [selectedSection, setSelectedSection] = useState<{
    type: "current-plan" | "available-plans" | "transactions"
    data: any
  } | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        const [plansResponse, subscriptionResponse, transactionsResponse] = await Promise.all([
          fetch("/api/plans"),
          fetch(`/api/user-subscription?userId=${user.id}`),
          fetch(`/api/transactions?userId=${user.id}`),
        ])

        if (plansResponse.ok) {
          const plansData = await plansResponse.json()
          setPlans(plansData.plans)
        }

        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json()
          setSubscription(subscriptionData.subscription)
        }

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json()
          setTransactions(transactionsData.transactions)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSectionClick = (type: "current-plan" | "available-plans" | "transactions", data: any) => {
    setSelectedSection({ type, data })
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedSection(null), 300)
  }

  const handleUpgradePlan = (plan: Plan, selectedPrice?: PlanPrice) => {
    if (subscription?.planId === plan.id) {
      return
    }

    if (!selectedPrice || selectedPrice.amount === 0) {
      return
    }

    const planWithPrice = {
      ...plan,
      price: selectedPrice.amount,
      stripePriceId: selectedPrice.stripePriceId,
      billingInterval: selectedPrice.billingInterval,
    }

    setSelectedPlan(planWithPrice)
    setShowCheckout(true)
  }

  const handlePaymentSuccess = () => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const [subscriptionResponse, transactionsResponse] = await Promise.all([
            fetch(`/api/user-subscription?userId=${user.id}`),
            fetch(`/api/transactions?userId=${user.id}`),
          ])

          if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json()
            setSubscription(subscriptionData.subscription)
          }

          if (transactionsResponse.ok) {
            const transactionsData = await transactionsResponse.json()
            setTransactions(transactionsData.transactions)
          }
        }
      } catch (error) {
        console.error("Error refreshing data:", error)
      }
    }

    fetchData()
    setShowCheckout(false)
    setSelectedPlan(null)
  }

  return (
    <main className="min-h-screen relative">
      <LoadingProgressBar isPending={isPending} />
      
      {/* Header - now with glass effect */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-40 relative">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Billing & Subscription</h1>
            <p className="text-sm text-muted-foreground mt-2">Manage your subscription and billing information</p>
          </div>
        </div>
      </header>
      {/* Main Content - Vertical Stack */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6 relative z-10">
        {/* Current Plan Card */}
        <button
          onClick={() => handleSectionClick("current-plan", { subscription, plans })}
          className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-card/20 backdrop-blur-lg hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-8 md:p-12 flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Current Plan</p>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
                {subscription?.planName || "Free"} Plan
              </h3>

              {subscription ? (
                <div className="space-y-4">
                  <div className="text-lg text-muted-foreground">
                    <span className="text-2xl text-foreground font-bold">${subscription.price}</span>
                    <span className="ml-1">/{subscription.billingInterval}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 border-primary/20 text-primary capitalize px-3 py-1"
                    >
                      {subscription.status}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-lg text-muted-foreground">
                  You are on the free plan. Upgrade to unlock more features.
                </div>
              )}
            </div>

            <div className="ml-6 flex-shrink-0">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300" />
                <div className="absolute inset-2 border-2 border-primary/30 rounded-full group-hover:border-primary/50 transition-all duration-300" />
                <div className="absolute inset-4 border border-primary/20 rounded-full group-hover:border-primary/40 transition-all duration-300 group-hover:scale-110 transition-transform" />
                <ArrowUpRight className="w-8 h-8 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </button>

        {/* Available Plans Card */}
        <button
          onClick={() => handleSectionClick("available-plans", { plans, subscription })}
          className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-card/20 backdrop-blur-lg hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-8 md:p-12 flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Available Plans</p>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">{plans.length} Options</h3>

              <div className="space-y-3">
                {plans.map((plan) => (
                  <div key={plan.id} className="text-muted-foreground text-lg">
                    <span className="font-semibold text-foreground">{plan.name}</span> — from ${plan.price}
                  </div>
                ))}
              </div>
            </div>

            <div className="ml-6 flex-shrink-0">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300" />
                <div className="absolute inset-2 border-2 border-primary/30 rounded-full group-hover:border-primary/50 transition-all duration-300" />
                <div className="absolute inset-4 border border-primary/20 rounded-full group-hover:border-primary/40 transition-all duration-300 group-hover:scale-110 transition-transform" />
                <ArrowUpRight className="w-8 h-8 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </button>

        {/* Transaction History Card */}
        <button
          onClick={() => handleSectionClick("transactions", transactions)}
          className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-card/20 backdrop-blur-lg hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-8 md:p-12 flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Transactions</p>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">{transactions.length} Recent</h3>

              <div className="space-y-3">
                {transactions.slice(0, 3).map((txn) => (
                  <div key={txn.id} className="text-muted-foreground text-lg">
                    <span className="font-semibold text-foreground">${txn.amount}</span> — {txn.description}
                  </div>
                ))}
              </div>
            </div>

            <div className="ml-6 flex-shrink-0">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300" />
                <div className="absolute inset-2 border-2 border-primary/30 rounded-full group-hover:border-primary/50 transition-all duration-300" />
                <div className="absolute inset-4 border border-primary/20 rounded-full group-hover:border-primary/40 transition-all duration-300 group-hover:scale-110 transition-transform" />
                <ArrowUpRight className="w-8 h-8 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Section Detail Drawer */}
      <SectionCardDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        section={selectedSection}
        onUpgrade={handleUpgradePlan}
        onSuccess={handlePaymentSuccess}
      />

      {/* Stripe Checkout Modal */}
      <StripeCheckoutModal
        isOpen={showCheckout}
        onClose={() => {
          setShowCheckout(false)
          setSelectedPlan(null)
        }}
        plan={selectedPlan}
        onSuccess={handlePaymentSuccess}
      />
    </main>
  )
}
