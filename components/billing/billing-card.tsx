"use client"

import { ChevronRight } from "lucide-react"

interface BillingCardProps {
  billing: {
    id: number
    invoiceNumber: string
    date: string
    amount: string
    status: string
    description: string
  }
  onClick: () => void
}

export default function BillingCard({ billing, onClick }: BillingCardProps) {
  const statusColor = {
    Paid: "text-green-400 bg-green-400/10",
    Pending: "text-amber-400 bg-amber-400/10",
    Overdue: "text-red-400 bg-red-400/10",
  }

  return (
    <button onClick={onClick} className="w-full group">
      <div className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 hover:bg-card/80 transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-left">
            <div className="flex items-center gap-4 mb-3">
              <div>
                <p className="text-sm text-muted-foreground">{billing.invoiceNumber}</p>
                <h3 className="text-lg font-semibold text-foreground">{billing.description}</h3>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">{billing.date}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColor[billing.status] || "text-gray-400 bg-gray-400/10"
                }`}
              >
                {billing.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{billing.amount}</p>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors duration-300 transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </button>
  )
}
