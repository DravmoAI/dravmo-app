"use client"

import { ChevronRight } from "lucide-react"

interface Transaction {
  id: string
  description: string
  date: string
  amount: number
  status: "succeeded" | "failed" | "pending"
}

interface SubscriptionCardProps {
  transaction: Transaction
  onClick: () => void
}

export default function SubscriptionCard({ transaction, onClick }: SubscriptionCardProps) {
  const statusColor = {
    succeeded: "text-green-400 bg-green-400/10",
    pending: "text-amber-400 bg-amber-400/10",
    failed: "text-red-400 bg-red-400/10",
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <button onClick={onClick} className="w-full group">
      <div className="bg-card border border-border rounded-lg p-4 hover:border-accent/50 hover:bg-card/80 transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-foreground">{transaction.description}</h3>
            <p className="text-sm text-muted-foreground mt-1">{formatDate(transaction.date)}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-foreground">${transaction.amount.toFixed(2)}</p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColor[transaction.status] || "text-gray-400 bg-gray-400/10"
                }`}
              >
                {transaction.status}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300 transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </button>
  )
}
