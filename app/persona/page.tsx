"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PersonaPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedPersona, setSelectedPersona] = useState<string | null>("minimalist")
  const [sliders, setSliders] = useState({
    colorBoldness: 50,
    typefaceTemperament: 50,
    spacingAiriness: 50,
    motionDrama: 50,
  })
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const router = useRouter()
  const [uploadedImages, setUploadedImages] = useState<Array<{ file: File; preview: string }>>([])

  const handleMoodboardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      if (uploadedImages.length < 3 && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setUploadedImages((prev) => [
            ...prev,
            {
              file,
              preview: event.target?.result as string,
            },
          ])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load existing persona data if it exists
    const personaData = localStorage.getItem("userPersona")
    if (personaData) {
      const parsed = JSON.parse(personaData)
      setSelectedPersona(parsed.selectedPersona)
      setSliders(parsed.sliders)
      setSelectedKeywords(parsed.selectedKeywords)
    }
  }, [])

  const personas = [
    {
      id: "minimalist",
      name: "Minimalist Maverick",
      philosophy: "Whitespace is my superpower.",
      description: "You crave clean layouts, subtle details and maximum impact with minimal fuss.",
    },
    {
      id: "color",
      name: "Color Rebel",
      philosophy: "Neon, please. And make it bold.",
      description: "You live for vibrant palettes, unexpected combos, and color-driven storytelling.",
    },
    {
      id: "layout",
      name: "Layout Architect",
      philosophy: "Grids are my blueprints.",
      description: "You map every pixel to a system—precision, consistency, and modularity rule.",
    },
    {
      id: "motion",
      name: "Motion Maestro",
      philosophy: "If it doesn't move, is it even alive?",
      description: "You bring interfaces to life with micro-interactions, transitions, and delight.",
    },
    {
      id: "accessibility",
      name: "Accessibility Advocate",
      philosophy: "Design for everyone, always.",
      description: "You prioritize contrast, legibility, and inclusive UX above all else.",
    },
  ]

  const styleKeywords = [
    "brutal",
    "geometric",
    "vibrant",
    "ethereal",
    "tactile",
    "gridlocked",
    "fluid",
    "monoline",
    "retro-futuristic",
    "organic",
  ]

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords((prev) => {
      if (prev.includes(keyword)) {
        return prev.filter((k) => k !== keyword)
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), keyword]
      }
      return [...prev, keyword]
    })
  }

  const handleSliderChange = (name: keyof typeof sliders, value: number[]) => {
    setSliders((prev) => ({
      ...prev,
      [name]: value[0],
    }))
  }

  const handleContinue = () => {
    // Save persona data to localStorage
    const personaData = {
      selectedPersona,
      sliders,
      selectedKeywords,
      completedAt: new Date().toISOString(),
    }

    localStorage.setItem("userPersona", JSON.stringify(personaData))

    // Update user to mark persona as completed
    if (user) {
      const updatedUser = { ...user, hasCompletedPersona: true }
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }

    router.push("/dashboard")
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">
          {user ? `Welcome ${user.firstName || user.name}!` : "Set Up Your Design Persona"}
        </h2>
        <p className="text-muted-foreground mb-8">
          Tell us about your design preferences so we can tailor our feedback to your style.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Step 1: Choose Your Persona Card</h3>
            <p className="text-muted-foreground mb-4">Who are you in the design dojo?</p>
            <div className="grid md:grid-cols-2 gap-4">
              {personas.map((persona) => (
                <Card
                  key={persona.id}
                  className={`cursor-pointer transition-all ${
                    selectedPersona === persona.id ? "border-primary" : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPersona(persona.id)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-bold">{persona.name}</h4>
                    <p className="text-sm italic text-muted-foreground mb-2">"{persona.philosophy}"</p>
                    <p className="text-sm text-muted-foreground">{persona.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Step 2: Dial In Your Core Vibes</h3>
            <p className="text-muted-foreground mb-4">Slider controls for your soul.</p>
            <div className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="color-boldness">Color Boldness</Label>
                    <span className="text-muted-foreground text-sm">{sliders.colorBoldness}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">Monochrome Zen</span>
                    <input
                      type="range"
                      id="color-boldness"
                      min="0"
                      max="100"
                      value={sliders.colorBoldness}
                      onChange={(e) => handleSliderChange("colorBoldness", [Number.parseInt(e.target.value)])}
                      className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground">Full-blast Neon</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="typeface-temperament">Typeface Temperament</Label>
                    <span className="text-muted-foreground text-sm">{sliders.typefaceTemperament}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">Ultra-clean Sans-serif</span>
                    <input
                      type="range"
                      id="typeface-temperament"
                      min="0"
                      max="100"
                      value={sliders.typefaceTemperament}
                      onChange={(e) => handleSliderChange("typefaceTemperament", [Number.parseInt(e.target.value)])}
                      className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground">Experimental Decorative</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="spacing-airiness">Spacing Airiness</Label>
                    <span className="text-muted-foreground text-sm">{sliders.spacingAiriness}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">Compact & Dense</span>
                    <input
                      type="range"
                      id="spacing-airiness"
                      min="0"
                      max="100"
                      value={sliders.spacingAiriness}
                      onChange={(e) => handleSliderChange("spacingAiriness", [Number.parseInt(e.target.value)])}
                      className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground">Cloud-like Levity</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="motion-drama">Motion Drama</Label>
                    <span className="text-muted-foreground text-sm">{sliders.motionDrama}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">Static & Direct</span>
                    <input
                      type="range"
                      id="motion-drama"
                      min="0"
                      max="100"
                      value={sliders.motionDrama}
                      onChange={(e) => handleSliderChange("motionDrama", [Number.parseInt(e.target.value)])}
                      className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground">Cinematic Spectacle</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Step 3: Pick Your 3 Style Keywords</h3>
              <p className="text-muted-foreground mb-4">Words that spark your creative engine.</p>
              <div className="flex flex-wrap gap-2">
                {styleKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => handleKeywordToggle(keyword)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedKeywords.includes(keyword)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Selected: {selectedKeywords.length}/3</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Step 4: Moodboard Snapshot (Optional)</h3>
              <p className="text-muted-foreground mb-4">Show, don't just tell.</p>
              <Card className="border-2 border-dashed border-border">
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground mb-4">
                    Upload up to 3 images (screenshots, photos, sketches)
                  </div>
                  <input
                    type="file"
                    id="moodboard-upload"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleMoodboardUpload}
                  />
                  <Button variant="outline" onClick={() => document.getElementById("moodboard-upload")?.click()}>
                    Browse Files
                  </Button>
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.preview || "/placeholder.svg"}
                            alt={`Moodboard ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleContinue}
                disabled={!selectedPersona || selectedKeywords.length !== 3}
                className="px-8"
              >
                Complete Setup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
