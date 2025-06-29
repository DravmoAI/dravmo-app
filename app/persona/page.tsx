"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { getSupabaseClient } from "@/lib/supabase"
import { uploadFile, STORAGE_BUCKETS } from "@/lib/supabase-storage"
import { AlertCircle, Loader2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface PersonaCard {
  id: string
  personaCardName: string
  personaPhilosophy: string
  personaMeaning: string
}

interface PersonaFormData {
  personaCardId: string
  colorBoldness: number
  typeTemperament: number
  spacingAiriness: number
  motionDrama: number
  keywords: string[]
  moodboardFiles: File[]
}

// Define the slider options for each category
const sliderOptions = {
  colorBoldness: {
    0: "Monochrome Zen",
    50: "Balanced Pop",
    100: "Full-blast Neon",
  },
  typeTemperament: {
    0: "Ultra-clean Sans-serif",
    50: "Humanist Hybrid",
    100: "Experimental Decorative",
  },
  spacingAiriness: {
    0: "Compact & Dense",
    50: "Balanced Breathing",
    100: "Cloud-like Levity",
  },
  motionDrama: {
    0: "Static & Direct",
    50: "Subtle Animation",
    100: "Cinematic Spectacle",
  },
}

export default function PersonaPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [personaCards, setPersonaCards] = useState<PersonaCard[]>([])
  const [existingPersona, setExistingPersona] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<PersonaFormData>({
    personaCardId: "",
    colorBoldness: 50,
    typeTemperament: 50,
    spacingAiriness: 50,
    motionDrama: 50,
    keywords: [],
    moodboardFiles: [],
  })
  const [uploadedImages, setUploadedImages] = useState<Array<{ file: File; preview: string }>>([])
  const router = useRouter()
  const supabase = getSupabaseClient()

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)

        // Fetch persona cards
        const cardsResponse = await fetch("/api/persona-cards")
        if (cardsResponse.ok) {
          const { personaCards } = await cardsResponse.json()
          setPersonaCards(personaCards)

          // Set default persona card if available
          if (personaCards.length > 0 && !formData.personaCardId) {
            setFormData((prev) => ({ ...prev, personaCardId: personaCards[0].id }))
          }
        }

        // Fetch user profile with persona
        const profileResponse = await fetch(`/api/profile/${user.id}`)
        if (profileResponse.ok) {
          const { profile } = await profileResponse.json()
          setProfile(profile)

          // Check if user already has a persona
          if (profile?.persona) {
            setExistingPersona(profile.persona)
            setIsEditing(true)

            // Populate form with existing data
            const persona = profile.persona
            const vibe = persona.personaVibes[0] || {}
            const keywords = persona.personaKeywords.map((k: any) => k.keyword)

            setFormData({
              personaCardId: persona.personaCardId,
              colorBoldness: vibe.colorBoldness || 50,
              typeTemperament: vibe.typeTemperament || 50,
              spacingAiriness: vibe.spacingAiriness || 50,
              motionDrama: vibe.motionDrama || 50,
              keywords: keywords,
              moodboardFiles: [],
            })

            // Load existing moodboard images
            if (persona.personaMoodboards && persona.personaMoodboards.length > 0) {
              const moodboardPreviews = persona.personaMoodboards.map((m: any) => ({
                file: null,
                preview: m.snapshotUrl,
                existing: true,
              }))
              setUploadedImages(moodboardPreviews)
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please refresh the page.")
      }
    }

    fetchData()
  }, [router])

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

        // Add to form data
        setFormData((prev) => ({
          ...prev,
          moodboardFiles: [...prev.moodboardFiles, file],
        }))
      }
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      moodboardFiles: prev.moodboardFiles.filter((_, i) => i !== index),
    }))
  }

  const handleKeywordToggle = (keyword: string) => {
    setFormData((prev) => {
      const keywords = [...prev.keywords]
      if (keywords.includes(keyword)) {
        return { ...prev, keywords: keywords.filter((k) => k !== keyword) }
      }
      if (keywords.length >= 3) {
        return { ...prev, keywords: [...keywords.slice(1), keyword] }
      }
      return { ...prev, keywords: [...keywords, keyword] }
    })
  }

  const handleSliderChange = (name: keyof typeof formData, value: number[]) => {
    // Snap to nearest step (0, 50, or 100)
    let snappedValue = value[0]
    if (snappedValue < 25) snappedValue = 0
    else if (snappedValue < 75) snappedValue = 50
    else snappedValue = 100

    setFormData((prev) => ({
      ...prev,
      [name]: snappedValue,
    }))
  }

  const getSliderLabel = (category: keyof typeof sliderOptions, value: number) => {
    return sliderOptions[category][value as keyof (typeof sliderOptions)[typeof category]]
  }

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in to continue")
      return
    }

    if (!formData.personaCardId) {
      setError("Please select a persona card")
      return
    }

    if (formData.keywords.length !== 3) {
      setError("Please select exactly 3 keywords")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Upload moodboard images to Supabase Storage
      const moodboardUrls = []

      for (const file of formData.moodboardFiles) {
        const fileName = `${user.id}/${uuidv4()}-${file.name.replace(/\s+/g, "-")}`
        const { url, error } = await uploadFile(STORAGE_BUCKETS.MOODBOARDS, fileName, file)

        if (error) throw error
        if (url) moodboardUrls.push(url)
      }

      // Add existing moodboard URLs if editing
      if (isEditing && existingPersona?.personaMoodboards) {
        existingPersona.personaMoodboards.forEach((m: any) => {
          if (m.snapshotUrl) moodboardUrls.push(m.snapshotUrl)
        })
      }

      const personaData = {
        userId: user.id,
        personaCardId: formData.personaCardId,
        colorBoldness: formData.colorBoldness,
        typeTemperament: formData.typeTemperament,
        spacingAiriness: formData.spacingAiriness,
        motionDrama: formData.motionDrama,
        keywords: formData.keywords,
        moodboardUrls,
      }

      let response

      if (isEditing && existingPersona) {
        // Update existing persona
        response = await fetch(`/api/persona`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: existingPersona.id,
            ...personaData,
          }),
        })
      } else {
        // Create new persona
        response = await fetch(`/api/persona`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(personaData),
        })
      }

      if (!response.ok) {
        throw new Error("Failed to save persona")
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error("Error saving persona:", err)
      setError("Failed to save persona. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-normal mb-2 font-krona-one">
          {isEditing ? "Update Your Design Persona" : "Set Up Your Design Persona"}
        </h2>
        <p className="text-muted-foreground mb-8">Your design preferences helps me tailor the feedback to your style</p>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="space-y-8">
          <div>
            <h3 className="font-krona-one text-xl font-bold">Step 1: Choose Your Persona Card</h3>
            <p className="text-primary font-quantico mb-4">Who are you in the design dojo?</p>
            <div className="grid md:grid-cols-2 gap-4 place-content-center place-items-center">
              {personaCards.map((persona, index) => (
                <Card
                  key={persona.id}
                  className={`${
                    index === 4 ? "col-span-2 max-w-[374px]" : ""
                  } cursor-pointer transition-all bg-[linear-gradient(156deg,_#91BBF2_-81.94%,_rgba(13,13,13,0.04)_112.13%)] shadow-[4px_3px_18px_-5px_rgba(91,213,175,0.14)] ${
                    formData.personaCardId === persona.id ? "border-primary" : "hover:border-primary/50"
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, personaCardId: persona.id }))}
                >
                  <CardContent className="p-4">
                    <h4 className="font-bold">{persona.personaCardName}</h4>
                    <p className="text-sm italic text-primary mb-2">"{persona.personaPhilosophy}"</p>
                    <p className="text-sm text-white/90">{persona.personaMeaning}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <hr className="border-t border-primary my-8" />

          <div>
            <h3 className="font-krona-one text-xl font-bold">Step 2: Dial In Your Core Vibes</h3>
            <p className="text-primary font-quantico mb-4">Slider controls for your soul.</p>
            <div className="space-y-8">
              {/* Color Boldness */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="colorBoldness" className="text-lg font-medium">
                    Color Boldness
                  </Label>
                </div>
                <div className="space-y-3">
                  <Slider
                    id="colorBoldness"
                    min={0}
                    max={100}
                    step={50}
                    value={[formData.colorBoldness]}
                    onValueChange={(value) => handleSliderChange("colorBoldness", value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${formData.colorBoldness === 0 ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      Monochrome Zen
                    </span>
                    <span
                      className={`${formData.colorBoldness === 50 ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      Balanced Pop
                    </span>
                    <span
                      className={`${formData.colorBoldness === 100 ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      Full-blast Neon
                    </span>
                  </div>
                </div>
              </div>

              {/* Typeface Temperament */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="typeTemperament" className="text-lg font-medium">
                    Typeface Temperament
                  </Label>
                </div>
                <div className="space-y-3">
                  <Slider
                    id="typeTemperament"
                    min={0}
                    max={100}
                    step={50}
                    value={[formData.typeTemperament]}
                    onValueChange={(value) => handleSliderChange("typeTemperament", value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${formData.typeTemperament === 0 ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      Ultra-clean Sans-serif
                    </span>
                    <span
                      className={`${formData.typeTemperament === 50 ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      Humanist Hybrid
                    </span>
                    <span
                      className={`${formData.typeTemperament === 100 ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      Experimental Decorative
                    </span>
                  </div>
                </div>
              </div>

              {/* Spacing Airiness */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="spacingAiriness" className="text-lg font-medium">
                    Spacing Airiness
                  </Label>
                </div>
                <div className="space-y-3">
                  <Slider
                    id="spacingAiriness"
                    min={0}
                    max={100}
                    step={50}
                    value={[formData.spacingAiriness]}
                    onValueChange={(value) => handleSliderChange("spacingAiriness", value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${formData.spacingAiriness === 0 ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      Compact & Dense
                    </span>
                    <span
                      className={`${formData.spacingAiriness === 50 ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      Balanced Breathing
                    </span>
                    <span
                      className={`${formData.spacingAiriness === 100 ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      Cloud-like Levity
                    </span>
                  </div>
                </div>
              </div>

              {/* Motion Drama */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="motionDrama" className="text-lg font-medium">
                    Motion Drama
                  </Label>
                </div>
                <div className="space-y-3">
                  <Slider
                    id="motionDrama"
                    min={0}
                    max={100}
                    step={50}
                    value={[formData.motionDrama]}
                    onValueChange={(value) => handleSliderChange("motionDrama", value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${formData.motionDrama === 0 ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      Static & Direct
                    </span>
                    <span
                      className={`${formData.motionDrama === 50 ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      Subtle Animation
                    </span>
                    <span
                      className={`${formData.motionDrama === 100 ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      Cinematic Spectacle
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-t border-primary my-8" />

            <div>
              <h3 className="font-krona-one text-xl font-bold">Step 3: Pick Your 3 Style Keywords</h3>
              <p className="text-primary font-quantico mb-4">Words that spark your creative engine.</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {styleKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => handleKeywordToggle(keyword)}
                    className={`px-6 py-3 rounded-full text-sm transition-colors ${
                      formData.keywords.includes(keyword)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Selected: {formData.keywords.length}/3</p>
            </div>

            <hr className="border-t border-primary my-8" />

            <div>
              <h3 className="font-krona-one text-xl font-bold">Step 4: Moodboard Snapshot (Optional)</h3>
              <p className="text-primary font-quantico mb-4">Show, don't just tell.</p>
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

            <div className="flex justify-end mt-8">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !formData.personaCardId || formData.keywords.length !== 3}
                className="px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Saving..."}
                  </>
                ) : isEditing ? (
                  "Update Persona"
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
