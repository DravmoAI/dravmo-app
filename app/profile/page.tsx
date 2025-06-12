"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Camera, Eye, EyeOff, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase"
import { uploadFile, STORAGE_BUCKETS } from "@/lib/supabase-storage"
import { v4 as uuidv4 } from "uuid"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [persona, setPersona] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          return
        }
        setUser(user)

        // Fetch user profile with persona
        const response = await fetch(`/api/profile/${user.id}`)
        if (response.ok) {
          const { profile } = await response.json()
          setProfile(profile)
          setPersona(profile?.persona)

          setFormData({
            fullName: profile?.fullName || "",
            email: user.email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          })
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load profile data")
      }
    }

    fetchUserData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async () => {
    if (!user || !profile) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          fullName: formData.fullName,
          avatarUrl: profile.avatarUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const { profile: updatedProfile } = await response.json()
      setProfile(updatedProfile)
      setIsEditing(false)
      setSuccess("Profile updated successfully")
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!user) return

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      })

      if (error) {
        throw error
      }

      setSuccess("Password updated successfully")
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (err: any) {
      console.error("Error updating password:", err)
      setError(err.message || "Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsLoading(true)
    setError("")

    try {
      const fileName = `${user.id}/${uuidv4()}-${file.name.replace(/\s+/g, "-")}`
      const { url, error } = await uploadFile(STORAGE_BUCKETS.AVATARS, fileName, file)

      if (error) throw error
      if (!url) throw new Error("Failed to upload image")

      // Update profile with new avatar URL
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          fullName: profile.fullName,
          avatarUrl: url,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const { profile: updatedProfile } = await response.json()
      setProfile(updatedProfile)
      setSuccess("Profile image updated successfully")
    } catch (err) {
      console.error("Error uploading profile image:", err)
      setError("Failed to upload profile image")
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getPersonaName = (personaId: string) => {
    if (!persona?.personaCard) return personaId
    return persona.personaCard.personaCardName
  }

  if (!user) {
    return <DashboardLayout>Loading...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Profile Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="h-4 w-4" />
            {success}
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="persona">Design Persona</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={profile?.avatarUrl || "/placeholder-user.jpg"}
                        alt={profile?.fullName || "User"}
                      />
                      <AvatarFallback className="text-lg">
                        {profile?.fullName ? getInitials(profile.fullName) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="profile-image"
                      className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90"
                    >
                      <Camera className="h-3 w-3" />
                    </label>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleProfileImageUpload}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{profile?.fullName || "User"}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    {profile?.createdAt && (
                      <p className="text-sm text-muted-foreground">
                        Member since {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing || isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled={true} // Email cannot be changed
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveProfile} className="gap-2" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          setFormData((prev) => ({
                            ...prev,
                            fullName: profile?.fullName || "",
                          }))
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="persona">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Design Persona</CardTitle>
                  <Link href="/persona">
                    <Button variant="outline" size="sm">
                      {persona ? "Update Persona" : "Create Persona"}
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {persona ? (
                  <>
                    <div>
                      <h3 className="font-bold mb-2">Selected Persona</h3>
                      <Badge variant="secondary" className="text-sm">
                        {persona.personaCard?.personaCardName || "Custom Persona"}
                      </Badge>
                    </div>

                    {persona.personaVibes && persona.personaVibes.length > 0 && (
                      <div>
                        <h3 className="font-bold mb-4">Design Preferences</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Color Boldness</Label>
                            <div className="text-sm text-muted-foreground">
                              {persona.personaVibes[0].colorBoldness}%
                            </div>
                          </div>
                          <div>
                            <Label>Typeface Temperament</Label>
                            <div className="text-sm text-muted-foreground">
                              {persona.personaVibes[0].typeTemperament}%
                            </div>
                          </div>
                          <div>
                            <Label>Spacing Airiness</Label>
                            <div className="text-sm text-muted-foreground">
                              {persona.personaVibes[0].spacingAiriness}%
                            </div>
                          </div>
                          <div>
                            <Label>Motion Drama</Label>
                            <div className="text-sm text-muted-foreground">{persona.personaVibes[0].motionDrama}%</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {persona.personaKeywords && persona.personaKeywords.length > 0 && (
                      <div>
                        <h3 className="font-bold mb-2">Style Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {persona.personaKeywords.map((keyword: any) => (
                            <Badge key={keyword.id} variant="outline">
                              {keyword.keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {persona.personaMoodboards && persona.personaMoodboards.length > 0 && (
                      <div>
                        <h3 className="font-bold mb-2">Moodboard</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {persona.personaMoodboards.map((moodboard: any) => (
                            <div key={moodboard.id} className="relative">
                              <img
                                src={moodboard.snapshotUrl || "/placeholder.svg"}
                                alt="Moodboard image"
                                className="w-full h-20 object-cover rounded"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Persona created on {new Date(persona.createdAt).toLocaleDateString()}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No design persona set up yet</p>
                    <Link href="/persona">
                      <Button>Set Up Your Persona</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        disabled={isLoading}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  onClick={handlePasswordChange}
                  disabled={isLoading || !formData.newPassword || formData.newPassword !== formData.confirmPassword}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
