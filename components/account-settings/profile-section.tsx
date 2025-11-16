"use client"

import type React from "react"

import { useState } from "react"

export default function ProfileSection() {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Passionate about technology and design",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Handle save logic
    console.log("Saving profile:", formData)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/60 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/60 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/60 transition-colors resize-none"
        />
      </div>
      <button
        onClick={handleSave}
        className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105"
      >
        Save Profile
      </button>
    </div>
  )
}
