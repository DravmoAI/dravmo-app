"use client"

export default function TransactionsSection() {
  const transactions = [
    { id: 1, description: "Monthly Subscription", amount: "-$29.99", date: "Nov 1, 2024", type: "charge" },
    { id: 2, description: "Pro Plan Upgrade", amount: "-$9.99", date: "Oct 15, 2024", type: "charge" },
    { id: 3, description: "Refund - Plan Change", amount: "+$5.00", date: "Oct 14, 2024", type: "refund" },
    { id: 4, description: "Monthly Subscription", amount: "-$29.99", date: "Oct 1, 2024", type: "charge" },
    { id: 5, description: "Storage Addon", amount: "-$4.99", date: "Sep 20, 2024", type: "charge" },
  ]

  return (
    <div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{transaction.description}</p>
              <p className="text-xs text-white/60">{transaction.date}</p>
            </div>
            <div
              className={`text-sm font-semibold ${
                transaction.type === "charge" ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {transaction.amount}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all duration-200">
        Download Statement
      </button>
    </div>
  )
}
