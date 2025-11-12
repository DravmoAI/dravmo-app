"use client"

import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface Transaction {
  id: string
  description: string
  date: string
  amount: number
  status: "succeeded" | "failed" | "pending"
}

interface SubscriptionDrawerProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
}

export default function SubscriptionDrawer({ isOpen, onClose, transaction }: SubscriptionDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "backdrop-enter" : "backdrop-exit"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full md:w-96 bg-card/20 backdrop-blur-lg border-l border-white/10 shadow-lg z-50 transition-all duration-500 ${
          isOpen ? "drawer-enter" : "drawer-exit"
        }`}
      >
        {transaction && (
          <div className="h-full overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="content-stagger content-stagger-delay-1 border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-card/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-foreground">Transaction Details</h2>
              <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors duration-200">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-6 space-y-6">
              {/* Description Section */}
              <div className="content-stagger content-stagger-delay-2 space-y-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-lg font-semibold text-foreground">{transaction.description}</p>
              </div>

              {/* Amount Section */}
              <div className="content-stagger content-stagger-delay-3 space-y-2">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-3xl font-bold text-foreground">${transaction.amount.toFixed(2)}</p>
              </div>

              {/* Date Section */}
              <div className="content-stagger content-stagger-delay-4 space-y-2">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-base text-foreground">{formatDate(transaction.date)}</p>
              </div>

              {/* Status Section */}
              <div className="content-stagger content-stagger-delay-5 space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="inline-block">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      transaction.status === "succeeded"
                        ? "text-green-400 bg-green-400/10"
                        : transaction.status === "pending"
                          ? "text-amber-400 bg-amber-400/10"
                          : "text-red-400 bg-red-400/10"
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border px-6 py-4 bg-card/50 sticky bottom-0 space-y-2">
              <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4" />
                Download Receipt
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
