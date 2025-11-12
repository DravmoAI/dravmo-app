"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Lock, Zap, CreditCard, History, Palette, X } from "lucide-react"
import ProfileSection from "@/components/account-settings/profile-section"
import SecuritySection from "@/components/account-settings/security-section"
import UsageSection from "@/components/account-settings/usage-section"
import BillingSection from "@/components/account-settings/billing-section"
import TransactionsSection from "@/components/account-settings/transactions-section"
import AvatarSection from "@/components/account-settings/avatar-section"

const MENU_ITEMS = [
{ id: "profile", label: "Profile", icon: User, color: "from-cyan-500 to-teal-600" },
{ id: "security", label: "Security", icon: Lock, color: "from-emerald-600 to-green-800" },
{ id: "usage", label: "Usage", icon: Zap, color: "from-blue-400 to-cyan-500" },
{ id: "billing", label: "Billing", icon: CreditCard, color: "from-teal-500 to-emerald-700" },
{ id: "transactions", label: "Transactions", icon: History, color: "from-cyan-600 to-blue-700" },
{ id: "avatar", label: "Avatar", icon: Palette, color: "from-green-500 to-emerald-600" },
]

export default function AccountSettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")

  const calculatePosition = (index: number) => {
    const angle = (index * 360) / MENU_ITEMS.length - 90
    const radius = 200
    const x = radius * Math.cos((angle * Math.PI) / 180)
    const y = radius * Math.sin((angle * Math.PI) / 180)
    return { x, y }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />
      case "security":
        return <SecuritySection />
      case "usage":
        return <UsageSection />
      case "billing":
        return <BillingSection />
      case "transactions":
        return <TransactionsSection />
      case "avatar":
        return <AvatarSection onAvatarSelect={setProfileImage} />
      default:
        return null
    }
  }

  const activeItem = MENU_ITEMS.find((item) => item.id === activeSection)

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Central profile picture and circular menu */}
        <div className="relative w-[576px] h-[576px] flex items-center justify-center">
          {/* Menu items - circular arrangement */}
          {MENU_ITEMS.map((item, index) => {
            const pos = calculatePosition(index)
            const Icon = item.icon
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{ x: pos.x, y: pos.y, opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: index * 0.08,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute w-20 h-20 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow group cursor-pointer`}
                title={item.label}
              >
                <Icon className="w-8 h-8" />
                <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {item.label}
                </div>
              </motion.button>
            )
          })}

          {/* Central profile picture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
            className="w-48 h-48 rounded-full overflow-hidden border-4 border-cyan-500 shadow-2xl relative"
          >
            {/* Glowing ring effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            {/* Animated ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute -inset-1 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-500"
            />
          </motion.div>

          {/* --- Modal placed relative to the circular menu --- */}
          <AnimatePresence mode="wait">
            {activeSection && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => setActiveSection(null)}
                  className="fixed inset-0 z-40 bg-black/40"
                />

                {/* Modal centered on top of the circular menu */}
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, scale: 0.9, y: -150 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -150 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute z-50 w-[500px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                >
                  {/* Close button */}
                  <motion.button
                    onClick={() => setActiveSection(null)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>

                  {/* Section title */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">{activeItem?.label}</h2>
                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${activeItem?.color}`}></div>
                  </div>

                  {/* Content */}
                  <div className="text-white">{renderContent()}</div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
