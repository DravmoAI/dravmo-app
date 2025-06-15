"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/hooks/use-toast"

interface Screen {
  id: string
  projectId: string
  sourceUrl: string
  sourceType: "upload" | "figma"
  createdAt: string
  project: {
    id: string
    name: string
  }
}

interface DesignMaster {
  id: string
  name: string
  styleSummary: string
  userfulFor: string
  bio: string
  avatarUrl: string
}

interface AnalyzerPoint {
  id: string
  name: string
  description: string
}

interface AnalyzerSubtopic {
  id: string
  name: string
  description: string
  analyzerPoints: AnalyzerPoint[]
}

interface AnalyzerTopic {
  id: string
  name: string
  description: string
  analyzerSubtopics: AnalyzerSubtopic[]
}

interface SelectedAnalyzer {
  topicId: string
  subtopicId: string
  pointId: string
}

export default function ScreenAnalyzePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const screenId = params.screenId as string

  const [screen, setScreen] = useState<Screen | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzerTopics, setAnalyzerTopics] = useState<AnalyzerTopic[]>([])
  const [designMasters, setDesignMasters] = useState<DesignMaster[]>([])
  const [selectedAnalyzers, setSelectedAnalyzers] = useState<SelectedAnalyzer[]>([])
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null)
  const [isMastersMode, setIsMastersMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    industry: "Education",
    productType: "Mobile App",
    purpose: "Learning Platform",
    audience: "Students",
    ageGroup: "18-25",
    brandPersonality: "Professional",
    platform: "Web",
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch screen data
        const screenRes = await fetch(`/api/screens/${screenId}`)
        if (!screenRes.ok) throw new Error("Failed to fetch screen")
        const screenData = await screenRes.json()
        setScreen(screenData.screen)

        // Fetch analyzer topics
        const analyzerRes = await fetch("/api/analyzer")
        if (!analyzerRes.ok) throw new Error("Failed to fetch analyzer topics")
        const analyzerData = await analyzerRes.json()
        setAnalyzerTopics(analyzerData.topics)

        // Fetch design masters
        const mastersRes = await fetch("/api/design-masters")
        if (!mastersRes.ok) throw new Error("Failed to fetch design masters")
        const mastersData = await mastersRes.json()
        setDesignMasters(mastersData.designMasters)

        // Pre-select the first point from the first subtopic of the first topic
        if (analyzerData.topics.length > 0) {
          const firstTopic = analyzerData.topics[0]
          if (firstTopic.analyzerSubtopics.length > 0) {
            const firstSubtopic = firstTopic.analyzerSubtopics[0]
            if (firstSubtopic.analyzerPoints.length > 0) {
              const firstPoint = firstSubtopic.analyzerPoints[0]
              setSelectedAnalyzers([
                {
                  topicId: firstTopic.id,
                  subtopicId: firstSubtopic.id,
                  pointId: firstPoint.id,
                },
              ])
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [screenId])

  const isPointSelected = (pointId: string) => {
    return selectedAnalyzers.some((analyzer) => analyzer.pointId === pointId)
  }

  const isSubtopicSelected = (subtopicId: string) => {
    return selectedAnalyzers.some((analyzer) => analyzer.subtopicId === subtopicId)
  }

  const isTopicSelected = (topicId: string) => {
    return selectedAnalyzers.some((analyzer) => analyzer.topicId === topicId)
  }

  const handlePointChange = (pointId: string, subtopicId: string, topicId: string) => {
    setSelectedAnalyzers((prev) => {
      const isSelected = prev.some((analyzer) => analyzer.pointId === pointId)

      if (isSelected) {
        // Remove the analyzer with this point
        return prev.filter((analyzer) => analyzer.pointId !== pointId)
      } else {
        // Add new analyzer
        return [
          ...prev,
          {
            topicId,
            subtopicId,
            pointId,
          },
        ]
      }
    })
  }

  const handleSubtopicChange = (subtopicId: string, topicId: string) => {
    const topic = analyzerTopics.find((t) => t.id === topicId)
    if (!topic) return

    const subtopic = topic.analyzerSubtopics.find((s) => s.id === subtopicId)
    if (!subtopic) return

    const isSelected = isSubtopicSelected(subtopicId)

    if (isSelected) {
      // Remove all analyzers for this subtopic
      setSelectedAnalyzers((prev) => prev.filter((analyzer) => analyzer.subtopicId !== subtopicId))
    } else {
      // Add all points from this subtopic
      const newAnalyzers = subtopic.analyzerPoints.map((point) => ({
        topicId,
        subtopicId,
        pointId: point.id,
      }))

      setSelectedAnalyzers((prev) => [
        ...prev.filter((analyzer) => analyzer.subtopicId !== subtopicId),
        ...newAnalyzers,
      ])
    }
  }

  const handleTopicChange = (topicId: string) => {
    const topic = analyzerTopics.find((t) => t.id === topicId)
    if (!topic) return

    const isSelected = isTopicSelected(topicId)

    if (isSelected) {
      // Remove all analyzers for this topic
      setSelectedAnalyzers((prev) => prev.filter((analyzer) => analyzer.topicId !== topicId))
    } else {
      // Add all points from all subtopics of this topic
      const newAnalyzers: SelectedAnalyzer[] = []

      topic.analyzerSubtopics.forEach((subtopic) => {
        subtopic.analyzerPoints.forEach((point) => {
          newAnalyzers.push({
            topicId,
            subtopicId: subtopic.id,
            pointId: point.id,
          })
        })
      })

      setSelectedAnalyzers((prev) => [...prev.filter((analyzer) => analyzer.topicId !== topicId), ...newAnalyzers])
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAnalyze = async () => {
    if (selectedAnalyzers.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one analysis point.",
        variant: "destructive",
      })
      return
    }

    if (isMastersMode && !selectedMaster) {
      toast({
        title: "Selection Required",
        description: "Please select a design master for analysis.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/feedback-queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          screenId,
          projectId,
          designMasterId: selectedMaster,
          industry: formData.industry,
          productType: formData.productType,
          purpose: formData.purpose,
          audience: formData.audience,
          ageGroup: formData.ageGroup,
          brandPersonality: formData.brandPersonality,
          platform: formData.platform,
          selectedAnalyzers,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create feedback query")
      }

      const data = await response.json()
      router.push(data.redirectUrl)
    } catch (error) {
      console.error("Error creating feedback query:", error)
      toast({
        title: "Error",
        description: "Failed to create feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading analysis options...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (!screen) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Screen not found</h2>
            <p className="text-muted-foreground mb-6">
              The screen you're looking for doesn't exist or has been removed.
            </p>
            <Link href={`/projects/${projectId}`}>
              <Button>Back to Project</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
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
              Configure analysis options for <span className="font-medium">{screen.project?.name}</span>
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
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                              <img
                                src={master.avatarUrl || "/placeholder-user.jpg"}
                                alt={master.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold">{master.name}</h4>
                              <p className="text-sm text-muted-foreground">{master.styleSummary}</p>
                              <p className="text-xs text-muted-foreground mt-1">Useful for: {master.userfulFor}</p>
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
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
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
                          <SelectItem value="Web Application">Web Application</SelectItem>
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
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Information">Information</SelectItem>
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
                        <SelectItem value="Children">Children</SelectItem>
                        <SelectItem value="Seniors">Seniors</SelectItem>
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
                        <SelectItem value="Under 18">Under 18</SelectItem>
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
                        <SelectItem value="Minimalist">Minimalist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={formData.platform} onValueChange={(value) => handleSelectChange("platform", value)}>
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web">Web</SelectItem>
                        <SelectItem value="iOS">iOS</SelectItem>
                        <SelectItem value="Android">Android</SelectItem>
                        <SelectItem value="Cross-platform">Cross-platform</SelectItem>
                        <SelectItem value="Desktop">Desktop</SelectItem>
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
                  <h3 className="text-xl font-bold mb-4">Analysis Topics</h3>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {analyzerTopics.map((topic) => (
                      <Accordion type="single" collapsible key={topic.id} className="border rounded-md">
                        <AccordionItem value={topic.id} className="border-none">
                          <AccordionTrigger className="px-4 py-2 hover:no-underline">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`topic-${topic.id}`}
                                checked={isTopicSelected(topic.id)}
                                onCheckedChange={() => handleTopicChange(topic.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <Label
                                htmlFor={`topic-${topic.id}`}
                                className="font-medium cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleTopicChange(topic.id)
                                }}
                              >
                                {topic.name}
                              </Label>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-2">
                            <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                            <div className="space-y-1 pl-6">
                              {topic.analyzerSubtopics.map((subtopic) => (
                                <Accordion
                                  type="single"
                                  collapsible
                                  key={subtopic.id}
                                  className="border rounded-md mt-2"
                                >
                                  <AccordionItem value={subtopic.id} className="border-none">
                                    <AccordionTrigger className="px-4 py-2 hover:no-underline">
                                      <div className="flex items-center gap-3">
                                        <Checkbox
                                          id={`subtopic-${subtopic.id}`}
                                          checked={isSubtopicSelected(subtopic.id)}
                                          onCheckedChange={() => handleSubtopicChange(subtopic.id, topic.id)}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <Label
                                          htmlFor={`subtopic-${subtopic.id}`}
                                          className="font-medium cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleSubtopicChange(subtopic.id, topic.id)
                                          }}
                                        >
                                          {subtopic.name}
                                        </Label>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-2">
                                      <p className="text-sm text-muted-foreground mb-3">{subtopic.description}</p>
                                      <div className="space-y-2 pl-6">
                                        {subtopic.analyzerPoints.map((point) => (
                                          <div key={point.id} className="flex items-center gap-3">
                                            <Checkbox
                                              id={`point-${point.id}`}
                                              checked={isPointSelected(point.id)}
                                              onCheckedChange={() => handlePointChange(point.id, subtopic.id, topic.id)}
                                            />
                                            <div>
                                              <Label
                                                htmlFor={`point-${point.id}`}
                                                className="font-medium cursor-pointer"
                                              >
                                                {point.name}
                                              </Label>
                                              <p className="text-xs text-muted-foreground">{point.description}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Button
                      onClick={handleAnalyze}
                      className="w-full gap-2"
                      disabled={selectedAnalyzers.length === 0 || (isMastersMode && !selectedMaster) || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Analyze with Dravmo <ArrowRight className="h-4 w-4" />
                        </>
                      )}
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
