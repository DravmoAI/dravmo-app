"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Camera, Eye, EyeOff, Save } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface User {
  email: string
  name: string
  firstName?: string
  lastName?: string
  profileImage?: string
  createdAt?: string
}

interface PersonaData {
  selectedPersona: string
  sliders: {
    colorBoldness: number
    typefaceTemperament: number
    spacingAiriness: number
    motionDrama: number
  }
  selectedKeywords: string[]
  completedAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [persona, setPersona] = useState<PersonaData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        email: parsedUser.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }

    // Load persona data
    const personaData = localStorage.getItem("userPersona")
    if (personaData) {
      setPersona(JSON.parse(personaData))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setIsEditing(false)
    }
  }

  const handlePasswordChange = () => {
    // In a real app, you would validate the current password and update it
    alert("Password updated successfully!")
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        if (user) {
          const updatedUser = { ...user, profileImage: imageUrl }
          localStorage.setItem("user", JSON.stringify(updatedUser))
          setUser(updatedUser)
        }
      }
      reader.readAsDataURL(file)
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
    const personas: Record<string, string> = {
      minimalist: "Minimalist Maverick",
      color: "Color Rebel",
      layout: "Layout Architect",
      motion: "Motion Maestro",
      accessibility: "Accessibility Advocate",
    }
    return personas[personaId] || personaId
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
                      <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
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
                      onChange={handleProfileImageUpload}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    {user.createdAt && (
                      <p className="text-sm text-muted-foreground">
                        Member since {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveProfile} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
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
                      Update Persona
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
                        {getPersonaName(persona.selectedPersona)}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold mb-4">Design Preferences</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Color Boldness</Label>
                          <div className="text-sm text-muted-foreground">{persona.sliders.colorBoldness}%</div>
                        </div>
                        <div>
                          <Label>Typeface Temperament</Label>
                          <div className="text-sm text-muted-foreground">{persona.sliders.typefaceTemperament}%</div>
                        </div>
                        <div>
                          <Label>Spacing Airiness</Label>
                          <div className="text-sm text-muted-foreground">{persona.sliders.spacingAiriness}%</div>
                        </div>
                        <div>
                          <Label>Motion Drama</Label>
                          <div className="text-sm text-muted-foreground">{persona.sliders.motionDrama}%</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-2">Style Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {persona.selectedKeywords.map((keyword) => (
                          <Badge key={keyword} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Persona completed on {new Date(persona.completedAt).toLocaleDateString()}
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
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

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
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
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
                    />
                  </div>
                </div>

                <Button
                  onClick={handlePasswordChange}
                  disabled={
                    !formData.currentPassword ||
                    !formData.newPassword ||
                    formData.newPassword !== formData.confirmPassword
                  }
                >
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
