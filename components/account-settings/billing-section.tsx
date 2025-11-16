"use client"

export default function BillingSection() {
  const invoices = [
    { id: "INV-001", date: "Nov 1, 2024", amount: "$29.99", status: "Paid" },
    { id: "INV-002", date: "Oct 1, 2024", amount: "$29.99", status: "Paid" },
    { id: "INV-003", date: "Sep 1, 2024", amount: "$29.99", status: "Paid" },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <h4 className="text-sm font-medium text-white mb-1">Current Plan</h4>
        <p className="text-lg font-bold text-emerald-400">Pro Plan - $29.99/month</p>
        <p className="text-xs text-white/60 mt-2">Next billing date: Dec 1, 2024</p>
      </div>

      <div className="pt-4">
        <h4 className="text-sm font-medium text-white mb-3">Recent Invoices</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
              <div>
                <p className="text-sm font-medium text-white">{invoice.id}</p>
                <p className="text-xs text-white/60">{invoice.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{invoice.amount}</p>
                <p className={`text-xs ${invoice.status === "Paid" ? "text-emerald-400" : "text-yellow-400"}`}>
                  {invoice.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105">
        Upgrade Plan
      </button>
    </div>
  )
}
