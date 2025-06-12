"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Download, Star, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface Subscription {
  id: string
  planId: string
  planName: string
  price: number
  status: "active" | "canceled" | "past_due"
  autoRenew: boolean
  currentPeriodStart: string
  currentPeriodEnd: string
  maxProjects: number
  maxQueries: number
  usedProjects: number
  usedQueries: number
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [billingHistory, setBillingHistory] = useState<any[]>([])

  useEffect(() => {
    // Mock subscription data
    const mockSubscription: Subscription = {
      id: "sub_1234567890",
      planId: "pro",
      planName: "Pro",
      price: 29,
      status: "active",
      autoRenew: true,
      currentPeriodStart: "2024-01-01",
      currentPeriodEnd: "2024-02-01",
      maxProjects: 50,
      maxQueries: 500,
      usedProjects: 12,
      usedQueries: 156,
    }

    const mockBillingHistory = [
      {
        id: "inv_001",
        date: "2024-01-01",
        amount: 29,
        status: "paid",
        description: "Pro Plan - Monthly",
      },
      {
        id: "inv_002",
        date: "2023-12-01",
        amount: 29,
        status: "paid",
        description: "Pro Plan - Monthly",
      },
      {
        id: "inv_003",
        date: "2023-11-01",
        amount: 29,
        status: "paid",
        description: "Pro Plan - Monthly",
      },
    ]

    setSubscription(mockSubscription)
    setBillingHistory(mockBillingHistory)
  }, [])

  const handleUpgradePlan = () => {
    // In a real app, this would redirect to Stripe checkout
    alert("Redirecting to Stripe checkout...")
  }

  const handleCancelSubscription = () => {
    // In a real app, this would call your API to cancel the subscription
    if (confirm("Are you sure you want to cancel your subscription?")) {
      alert("Subscription canceled. You'll continue to have access until the end of your billing period.")
    }
  }

  const handleUpdatePaymentMethod = () => {
    // In a real app, this would redirect to Stripe customer portal
    alert("Redirecting to payment method update...")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "canceled":
        return "destructive"
      case "past_due":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      maxProjects: 3,
      maxQueries: 10,
      features: ["Up to 3 projects", "10 feedback queries per month", "Basic analysis topics"],
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      maxProjects: 50,
      maxQueries: 500,
      features: [
        "Up to 50 projects",
        "500 feedback queries per month",
        "All analysis topics",
        "Masters Mode access",
        "Priority support",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99,
      maxProjects: -1,
      maxQueries: -1,
      features: [
        "Unlimited projects",
        "Unlimited feedback queries",
        "All analysis topics",
        "Masters Mode access",
        "Custom design masters",
        "Team collaboration",
        "API access",
      ],
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Billing & Subscription</h2>
          <p className="text-muted-foreground">Manage your subscription and billing information</p>
        </div>

        {subscription && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Plan</CardTitle>
                <Badge variant={getStatusColor(subscription.status)}>{subscription.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{subscription.planName} Plan</h3>
                  <p className="text-muted-foreground">
                    ${subscription.price}/month • Next billing: {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Auto-renewal</div>
                  <div className="font-medium">{subscription.autoRenew ? "Enabled" : "Disabled"}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Projects Used</span>
                    <span className="text-sm text-muted-foreground">
                      {subscription.usedProjects}/{subscription.maxProjects === -1 ? "∞" : subscription.maxProjects}
                    </span>
                  </div>
                  <Progress
                    value={
                      subscription.maxProjects === -1 ? 0 : (subscription.usedProjects / subscription.maxProjects) * 100
                    }
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Queries Used</span>
                    <span className="text-sm text-muted-foreground">
                      {subscription.usedQueries}/{subscription.maxQueries === -1 ? "∞" : subscription.maxQueries}
                    </span>
                  </div>
                  <Progress
                    value={
                      subscription.maxQueries === -1 ? 0 : (subscription.usedQueries / subscription.maxQueries) * 100
                    }
                    className="h-2"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpgradePlan}>Upgrade Plan</Button>
                <Button variant="outline" onClick={handleUpdatePaymentMethod} className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Update Payment Method
                </Button>
                <Button variant="outline" onClick={handleCancelSubscription}>
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.popular ? "border-primary" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-2xl font-bold">
                      ${plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full"
                      variant={subscription?.planId === plan.id ? "outline" : plan.popular ? "default" : "outline"}
                      disabled={subscription?.planId === plan.id}
                      onClick={handleUpgradePlan}
                    >
                      {subscription?.planId === plan.id ? "Current Plan" : "Select Plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {billingHistory.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{invoice.description}</div>
                    <div className="text-sm text-muted-foreground">{formatDate(invoice.date)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">${invoice.amount}</div>
                      <Badge variant={invoice.status === "paid" ? "default" : "destructive"} className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
