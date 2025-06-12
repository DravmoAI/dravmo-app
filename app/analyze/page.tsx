"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Check } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AnalyzePage() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "layout",
    "typography",
    "color",
    "interactive",
    "masters",
    "accessibility",
  ])
  const [formData, setFormData] = useState({
    industry: "Education",
    productType: "Mobile App",
    purpose: "Learning Platform",
    audience: "Students",
    ageGroup: "18-25",
    brandPersonality: "Professional",
  })
  const router = useRouter()

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
    // In a real app, this would trigger the analysis process
    router.push("/feedback")
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">Analyze Your Design</h2>
            <p className="text-muted-foreground mb-8">Select which aspects of your design you want feedback on.</p>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-md overflow-hidden mb-4">
                  <img
                    src="/placeholder.svg?height=300&width=500"
                    alt="Uploaded design"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">praktika</h3>
                <p className="text-muted-foreground">EDUCATION MOBILE APP DESIGN</p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Context Setup</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
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
                        id="masters"
                        checked={selectedTopics.includes("masters")}
                        onCheckedChange={() => handleTopicChange("masters")}
                      />
                      <Label htmlFor="masters" className="flex items-center gap-2">
                        Design Master Review
                        {selectedTopics.includes("masters") && <Check className="h-4 w-4 text-primary" />}
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
                    <Button onClick={handleAnalyze} className="w-full gap-2" disabled={selectedTopics.length === 0}>
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
