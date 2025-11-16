"use client"

import type React from "react"

import { useState } from "react"

export default function SecuritySection() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle2FA = () => {
    setTwoFAEnabled(!twoFAEnabled)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Current Password</label>
        <input
          type="password"
          name="current"
          value={passwords.current}
          onChange={handlePasswordChange}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400/60 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
        <input
          type="password"
          name="new"
          value={passwords.new}
          onChange={handlePasswordChange}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400/60 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
        <input
          type="password"
          name="confirm"
          value={passwords.confirm}
          onChange={handlePasswordChange}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400/60 transition-colors"
        />
      </div>
      <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105">
        Update Password
      </button>

      {/* Two-Factor Authentication Toggle */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-white">Two-Factor Authentication</h4>
            <p className="text-xs text-white/60 mt-1">Add an extra layer of security</p>
          </div>
          <button
            onClick={handleToggle2FA}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${
              twoFAEnabled ? "bg-purple-500" : "bg-white/20"
            } relative`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-200 ${
                twoFAEnabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
