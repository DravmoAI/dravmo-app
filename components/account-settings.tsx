"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { User, Lock, Zap, CreditCard, History, Palette, X, Menu } from "lucide-react"
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

export function AccountSettings() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [profileImage, setProfileImage] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")
  const [profileAnimationComplete, setProfileAnimationComplete] = useState(true)

  const calculatePosition = (index: number) => {
    const angle = (index * 360) / MENU_ITEMS.length - 90
    const radius = 150
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
    <div className="relative inline-flex items-center justify-center p-6">
      <div className="relative">
        {/* Central profile picture and circular menu */}
        <div className="relative w-[400px] h-[400px] flex flex-col items-center justify-center">
          {/* Menu items - circular arrangement */}
          <AnimatePresence>
            {isMenuOpen &&
              MENU_ITEMS.map((item, index) => {
                const pos = calculatePosition(index)
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    animate={{ x: pos.x, y: pos.y, opacity: 1, scale: 1 }}
                    exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: index * 0.05,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow group cursor-pointer font-quantico"
                    title={item.label}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="mt-1 text-xs">{item.label}</span>
                  </motion.button>
                )
              })}
          </AnimatePresence>

          {/* Central content: Profile/Close button and Menu button */}
          <div className="absolute flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {!isMenuOpen ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onAnimationComplete={() => setProfileAnimationComplete(true)} // Show menu button after this completes
                  transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.2 }}
                  className="w-32 h-32 rounded-full overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl relative"
                >
                  <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute -inset-1 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-500"
                  />
                </motion.div>
              ) : (
                <motion.button
                  key="close"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setProfileAnimationComplete(false) // Hide menu button until profile animates in
                  }}
                  initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg"
                >
                  <X className="w-8 h-8" />
                </motion.button>
              )}
            </AnimatePresence>

            {!isMenuOpen && profileAnimationComplete && (
              <motion.button
                onClick={() => setIsMenuOpen(true)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                className="mt-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white flex items-center gap-2 shadow-lg hover:bg-white/20 transition-colors font-quantico"
              >
                <Menu className="w-4 h-4" />
                <span>Menu</span>
              </motion.button>
            )}
          </div>

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
                  className="absolute z-50 w-[450px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl font-quantico"
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
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="text-white">{renderContent()}</div>
                  </ScrollArea>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}