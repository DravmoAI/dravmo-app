"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

interface Screen {
  id: string
  projectId: string
  sourceUrl: string
  sourceType: "upload" | "figma"
  createdAt: string
}

interface Project {
  id: string
  name: string
}

interface DesignMaster {
  id: string
  name: string
  styleSummary: string
}

export default function ScreenAnalyzePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const screenId = params.screenId as string

  const [screen, setScreen] = useState<Screen | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "layout",
    "typography",
    "color",
    "interactive",
    "accessibility",
  ])
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null)
  const [designMasters, setDesignMasters] = useState<DesignMaster[]>([])
  const [isMastersMode, setIsMastersMode] = useState(false)
  const [formData, setFormData] = useState({
    industry: "Education",
    productType: "Mobile App",
    purpose: "Learning Platform",
    audience: "Students",
    ageGroup: "18-25",
    brandPersonality: "Professional",
  })

  useEffect(() => {
    // Mock screen data
    const mockScreen: Screen = {
      id: screenId,
      projectId,
      sourceUrl: "/placeholder.svg?height=400&width=300",
      sourceType: "upload",
      createdAt: "2024-01-15",
    }

    // Mock project data
    const mockProject: Project = {
      id: projectId,
      name: "Praktika Landing Page",
    }

    // Mock design masters
    const mockDesignMasters: DesignMaster[] = [
      {
        id: "1",
        name: "Dieter Rams",
        styleSummary: "Less, but better. Focuses on minimalism and functionality.",
      },
      {
        id: "2",
        name: "Paul Rand",
        styleSummary: "Iconic simplicity with a focus on memorable visual elements.",
      },
      {
        id: "3",
        name: "Susan Kare",
        styleSummary: "Pixel-perfect iconography with human-centered design.",
      },
      {
        id: "4",
        name: "Massimo Vignelli",
        styleSummary: "Timeless grid systems and typographic clarity.",
      },
      {
        id: "5",
        name: "Jony Ive",
        styleSummary: "Refined minimalism with attention to materials and details.",
      },
    ]

    setScreen(mockScreen)
    setProject(mockProject)
    setDesignMasters(mockDesignMasters)
  }, [projectId, screenId])

  const handleTopicChange = (topic: string) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAnalyze = () => {
    // In a real app, this would trigger the analysis process with the selected options
    // For now, we'll just redirect to a mock feedback page
    router.push(`/projects/${projectId}/screens/${screenId}/feedback/new`)
  }

  if (!screen || !project) {
    return <DashboardLayout>Loading...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/projects/${projectId}/screens/${screenId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Screen
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">Analyze Design</h2>
            <p className="text-muted-foreground mb-8">
              Configure analysis options for <span className="font-medium">{project.name}</span>
            </p>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-md overflow-hidden mb-4">
                  <img
                    src={screen.sourceUrl || "/placeholder.svg"}
                    alt="Design to analyze"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Context Setup</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Masters Mode</span>
                  <Switch checked={isMastersMode} onCheckedChange={setIsMastersMode} />
                </div>
              </div>

              {isMastersMode ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Select a design master to analyze your design through their unique perspective and philosophy.
                  </p>
                  <div className="grid gap-3">
                    {designMasters.map((master) => (
                      <Card
                        key={master.id}
                        className={`cursor-pointer transition-all ${
                          selectedMaster === master.id ? "border-primary" : "hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedMaster(master.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold">{master.name}</h4>
                              <p className="text-sm text-muted-foreground">{master.styleSummary}</p>
                            </div>
                            {selectedMaster === master.id && (
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => handleSelectChange("industry", value)}
                      >
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productType">Product Type</Label>
                      <Select
                        value={formData.productType}
                        onValueChange={(value) => handleSelectChange("productType", value)}
                      >
                        <SelectTrigger id="productType">
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mobile App">Mobile App</SelectItem>
                          <SelectItem value="Website">Website</SelectItem>
                          <SelectItem value="Dashboard">Dashboard</SelectItem>
                          <SelectItem value="Landing Page">Landing Page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select value={formData.purpose} onValueChange={(value) => handleSelectChange("purpose", value)}>
                      <SelectTrigger id="purpose">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Learning Platform">Learning Platform</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Social Networking">Social Networking</SelectItem>
                        <SelectItem value="Productivity">Productivity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select value={formData.audience} onValueChange={(value) => handleSelectChange("audience", value)}>
                      <SelectTrigger id="audience">
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Students">Students</SelectItem>
                        <SelectItem value="Professionals">Professionals</SelectItem>
                        <SelectItem value="General Public">General Public</SelectItem>
                        <SelectItem value="Specialized Field">Specialized Field</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageGroup">Age Group</Label>
                    <Select value={formData.ageGroup} onValueChange={(value) => handleSelectChange("ageGroup", value)}>
                      <SelectTrigger id="ageGroup">
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-25">18-25</SelectItem>
                        <SelectItem value="26-35">26-35</SelectItem>
                        <SelectItem value="36-45">36-45</SelectItem>
                        <SelectItem value="46-55">46-55</SelectItem>
                        <SelectItem value="55+">55+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brandPersonality">Brand Personality</Label>
                    <Select
                      value={formData.brandPersonality}
                      onValueChange={(value) => handleSelectChange("brandPersonality", value)}
                    >
                      <SelectTrigger id="brandPersonality">
                        <SelectValue placeholder="Select brand personality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Playful">Playful</SelectItem>
                        <SelectItem value="Innovative">Innovative</SelectItem>
                        <SelectItem value="Trustworthy">Trustworthy</SelectItem>
                        <SelectItem value="Bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="sticky top-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Analyze</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="layout"
                        checked={selectedTopics.includes("layout")}
                        onCheckedChange={() => handleTopicChange("layout")}
                      />
                      <Label htmlFor="layout" className="flex items-center gap-2">
                        Layout & Structure
                        {selectedTopics.includes("layout") && <Check className="h-4 w-4 text-primary" />}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="typography"
                        checked={selectedTopics.includes("typography")}
                        onCheckedChange={() => handleTopicChange("typography")}
                      />
                      <Label htmlFor="typography" className="flex items-center gap-2">
                        Typography & Readability
                        {selectedTopics.includes("typography") && <Check className="h-4 w-4 text-primary" />}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="color"
                        checked={selectedTopics.includes("color")}
                        onCheckedChange={() => handleTopicChange("color")}
                      />
                      <Label htmlFor="color" className="flex items-center gap-2">
                        Color & Visual Rhythm
                        {selectedTopics.includes("color") && <Check className="h-4 w-4 text-primary" />}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="interactive"
                        checked={selectedTopics.includes("interactive")}
                        onCheckedChange={() => handleTopicChange("interactive")}
                      />
                      <Label htmlFor="interactive" className="flex items-center gap-2">
                        Interactive Components
                        {selectedTopics.includes("interactive") && <Check className="h-4 w-4 text-primary" />}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="accessibility"
                        checked={selectedTopics.includes("accessibility")}
                        onCheckedChange={() => handleTopicChange("accessibility")}
                      />
                      <Label htmlFor="accessibility" className="flex items-center gap-2">
                        Accessibility & Usability
                        {selectedTopics.includes("accessibility") && <Check className="h-4 w-4 text-primary" />}
                      </Label>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      onClick={handleAnalyze}
                      className="w-full gap-2"
                      disabled={selectedTopics.length === 0 || (isMastersMode && !selectedMaster)}
                    >
                      Analyze with Dravmo <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
