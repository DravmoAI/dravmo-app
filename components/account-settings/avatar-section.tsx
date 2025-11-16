"use client"

import { useState } from "react"

const AVATAR_SEEDS = ["Felix", "Bella", "Leo", "Sophia", "Oliver", "Emma", "Noah", "Ava"]

export default function AvatarSection({ onAvatarSelect }: { onAvatarSelect: (url: string) => void }) {
  const [selectedAvatar, setSelectedAvatar] = useState("Felix")

  const handleAvatarSelect = (seed: string) => {
    setSelectedAvatar(seed)
    onAvatarSelect(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/80">Choose your profile avatar:</p>
      <div className="grid grid-cols-4 gap-3">
        {AVATAR_SEEDS.map((seed) => (
          <button
            key={seed}
            onClick={() => handleAvatarSelect(seed)}
            className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-200 ${
              selectedAvatar === seed
                ? "border-cyan-400 shadow-lg shadow-cyan-500/50 scale-110"
                : "border-white/20 hover:border-white/40"
            }`}
          >
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
              alt={seed}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105">
        Save Avatar
      </button>
    </div>
  )
}
