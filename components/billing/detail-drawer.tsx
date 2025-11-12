"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface DetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  billing: any
}

export default function DetailDrawer({ isOpen, onClose, billing }: DetailDrawerProps) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  const handleClose = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setIsAnimatingOut(false)
      onClose()
    }, 400)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    };
  }, [isOpen])

  if (!billing) return null

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 ${
          isAnimatingOut ? "backdrop-exit" : isOpen ? "backdrop-enter" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-card/20 backdrop-blur-lg border-l border-white/10 shadow-2xl z-50 flex flex-col ${
          isAnimatingOut ? "drawer-exit" : isOpen ? "drawer-enter" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-sm ${isOpen && !isAnimatingOut ? "content-stagger content-stagger-delay-1" : ""}`}
        >
          <h2 className="text-xl font-bold text-foreground">Invoice Details</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Invoice Number & Status */}
          <div className={isOpen && !isAnimatingOut ? "content-stagger content-stagger-delay-1" : ""}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Invoice Number</p>
            <p className="text-lg font-semibold text-foreground">{billing.invoiceNumber}</p>
          </div>

          {/* Amount */}
          <div
            className={`bg-muted/30 rounded-lg p-4 border border-border/50 ${isOpen && !isAnimatingOut ? "content-stagger content-stagger-delay-2" : ""}`}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Amount Due</p>
            <p className="text-3xl font-bold text-foreground">{billing.amount}</p>
            <p
              className={`text-sm mt-3 font-medium ${billing.status === "Paid" ? "text-green-400" : "text-amber-400"}`}
            >
              {billing.status}
            </p>
          </div>

          {/* Dates */}
          <div
            className={`grid grid-cols-2 gap-4 ${isOpen && !isAnimatingOut ? "content-stagger content-stagger-delay-3" : ""}`}
          >
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Issue Date</p>
              <p className="text-sm font-medium text-foreground">{billing.date}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Due Date</p>
              <p className="text-sm font-medium text-foreground">{billing.dueDate}</p>
            </div>
          </div>

          {/* Description */}
          <div className={isOpen && !isAnimatingOut ? "content-stagger content-stagger-delay-3" : ""}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-foreground">{billing.description}</p>
          </div>

          {/* Line Items */}
          <div className={isOpen && !isAnimatingOut ? "content-stagger content-stagger-delay-4" : ""}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Line Items</p>
            <div className="space-y-2">
              {billing.items &&
                billing.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center pb-2 border-b border-border/30">
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="text-sm font-medium text-foreground">{item.unitPrice}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className={isOpen && !isAnimatingOut ? "content-stagger content-stagger-delay-4" : ""}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Payment Method</p>
            <p className="text-sm text-foreground">{billing.paymentMethod}</p>
          </div>

          {/* Notes */}
          {billing.notes && (
            <div
              className={`bg-muted/30 rounded-lg p-4 border border-border/50 ${isOpen && !isAnimatingOut ? "content-stagger content-stagger-delay-5" : ""}`}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Notes</p>
              <p className="text-sm text-foreground">{billing.notes}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className={`border-t border-border p-6 space-y-3 ${isOpen && !isAnimatingOut ? "content-stagger content-stagger-delay-5" : ""}`}
        >
          <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
            Download PDF
          </button>
          <button className="w-full px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium">
            Send Email
          </button>
        </div>
      </div>
    </>
  )
}
