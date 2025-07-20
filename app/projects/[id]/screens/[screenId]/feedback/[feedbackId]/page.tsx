"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

interface FeedbackJudgement {
  bbox: number[] | null
  judgement: string
}

interface FeedbackPoint {
  [pointName: string]: FeedbackJudgement[]
}

interface FeedbackSubtopic {
  [subtopicName: string]: FeedbackPoint
}

interface FeedbackTopic {
  [topicName: string]: FeedbackSubtopic
}

interface GeneralReview {
  [topicName: string]: FeedbackTopic[string]
}

interface ExpertReview {
  name: string
  screen_review: Array<{
    bbox: number[] | null
    judgement: string
  }>
}

interface AIFeedbackResponse {
  expert_reviews: ExpertReview[]
  general_review: GeneralReview
  criterias: any
  metadata: any
  img_details: any
  expert_assigned?: any
}

interface FeedbackResult {
  id: string
  createdAt: string
  version: string
  feedbackSummary: string
  feedbackQuery: {
    id: string
    industry: string
    productType: string
    purpose: string
    audience: string
    ageGroup: string
    brandPersonality: string
    platform: string
    designMaster?: {
      id: string
      name: string
    }
  }
}

interface Screen {
  id: string
  projectId: string
  sourceUrl: string
  sourceType: "upload" | "figma"
  createdAt: string
  updatedAt: string
}

interface Project {
  id: string
  name: string
}

export default function FeedbackDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const screenId = params.screenId as string
  const feedbackId = params.feedbackId as string
  const [activeTab, setActiveTab] = useState("feedback")
  const [feedbackResult, setFeedbackResult] = useState<FeedbackResult | null>(null)
  const [screen, setScreen] = useState<Screen | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [aiFeedback, setAiFeedback] = useState<AIFeedbackResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch feedback result
        const feedbackResponse = await fetch(`/api/feedback-results/${feedbackId}`)
        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json()
          setFeedbackResult(feedbackData.feedbackResult)

          // Parse AI feedback from feedbackSummary
          try {
            const parsedFeedback = JSON.parse(feedbackData.feedbackResult.feedbackSummary)
            setAiFeedback(parsedFeedback)
          } catch (error) {
            console.error("Error parsing AI feedback:", error)
          }
        }

        // Fetch screen data
        const screenResponse = await fetch(`/api/screens/${screenId}`)
        if (screenResponse.ok) {
          const screenData = await screenResponse.json()
          setScreen(screenData.screen)
        }

        // Fetch project data
        const projectResponse = await fetch(`/api/projects/${projectId}`)
        if (projectResponse.ok) {
          const projectData = await projectResponse.json()
          setProject(projectData.project)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [feedbackId, screenId, projectId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getSeverityFromJudgement = (judgement: string): "high" | "medium" | "low" => {
    const lowerJudgement = judgement.toLowerCase()
    if (lowerJudgement.includes("critical") || lowerJudgement.includes("major") || lowerJudgement.includes("serious")) {
      return "high"
    } else if (
      lowerJudgement.includes("minor") ||
      lowerJudgement.includes("slight") ||
      lowerJudgement.includes("could")
    ) {
      return "low"
    }
    return "medium"
  }

  const renderExpertReviewContent = () => {
    if (!aiFeedback?.expert_reviews || aiFeedback.expert_reviews.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No expert review available</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {aiFeedback.expert_reviews.map((expertReview, expertIndex) => (
          <Card key={expertIndex}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {expertReview.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg font-krona-one">{expertReview.name}</h3>
                  <p className="text-sm text-muted-foreground">Expert Design Review</p>
                </div>
              </div>

              <div className="space-y-4">
                {expertReview.screen_review.map((review, reviewIndex) => (
                  <div key={reviewIndex} className="flex gap-3 p-4 bg-muted/30 rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        getSeverityFromJudgement(review.judgement) === "high"
                          ? "bg-destructive"
                          : getSeverityFromJudgement(review.judgement) === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {review.judgement.replace(/^>\s*/, "")}
                      </p>
                      {review.bbox && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            Region: [{review.bbox.join(", ")}]
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderGeneralReviewContent = () => {
    if (!aiFeedback?.general_review) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No general review available</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(aiFeedback.general_review).map(([topicName, topicData]) => (
            <AccordionItem key={topicName} value={topicName}>
              <AccordionTrigger className="text-lg font-medium font-krona-one">{topicName}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {Object.entries(topicData).map(([subtopicName, subtopicData]) => (
                    <div key={subtopicName} className="space-y-3">
                      <h4 className="font-semibold text-base font-quantico">{subtopicName}</h4>
                      {Object.entries(subtopicData).map(([pointName, judgements]) => (
                        <div key={pointName} className="space-y-2">
                          <h5 className="font-medium text-sm font-quantico text-muted-foreground">{pointName}</h5>
                          {judgements.map((item, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-2">
                                  <div
                                    className={`h-3 w-3 rounded-full mt-1.5 flex-shrink-0 ${
                                      getSeverityFromJudgement(item.judgement) === "high"
                                        ? "bg-destructive"
                                        : getSeverityFromJudgement(item.judgement) === "medium"
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                    }`}
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm leading-relaxed">{item.judgement.replace(/^>\s*/, "")}</p>
                                    {item.bbox && (
                                      <div className="mt-2 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="text-xs">
                                          Region: [{item.bbox.join(", ")}]
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  }

  const renderFeedbackContent = () => {
    // Check if we have expert reviews (design master was selected)
    if (aiFeedback?.expert_reviews && aiFeedback.expert_reviews.length > 0) {
      return renderExpertReviewContent()
    }

    // Otherwise show general review
    return renderGeneralReviewContent()
  }

  const getTotalFeedbackCount = () => {
    if (aiFeedback?.expert_reviews && aiFeedback.expert_reviews.length > 0) {
      // Count expert review items
      return aiFeedback.expert_reviews.reduce((total, expert) => {
        return total + expert.screen_review.length
      }, 0)
    }

    if (!aiFeedback?.general_review) return 0

    // Count general review items
    let count = 0
    Object.values(aiFeedback.general_review).forEach((topic) => {
      Object.values(topic).forEach((subtopic) => {
        Object.values(subtopic).forEach((points) => {
          count += points.length
        })
      })
    })
    return count
  }

  const renderSummaryContent = () => {
    if (!aiFeedback) {
      return (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 font-krona-one">Design Summary</h3>
            <p className="text-muted-foreground">No summary available</p>
          </CardContent>
        </Card>
      )
    }

    const totalIssues = getTotalFeedbackCount()
    const isExpertReview = aiFeedback.expert_reviews && aiFeedback.expert_reviews.length > 0
    const topicsAnalyzed = isExpertReview
      ? aiFeedback.expert_reviews.map((expert) => expert.name)
      : Object.keys(aiFeedback.general_review || {})

    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 font-krona-one">AI Analysis Summary</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalIssues}</div>
                <div className="text-sm text-muted-foreground">Total Insights</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{topicsAnalyzed.length}</div>
                <div className="text-sm text-muted-foreground">
                  {isExpertReview ? "Expert Reviews" : "Topics Analyzed"}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 font-quantico">
                {isExpertReview ? "Expert Reviewers:" : "Areas Reviewed:"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {topicsAnalyzed.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Loading feedback..." />
      </DashboardLayout>
    )
  }

  if (!feedbackResult || !screen || !project) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Feedback not found</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/projects/${projectId}/screens/${screenId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Screen
              </Button>
            </Link>
            <div>
              <h2 className="text-3xl font-bold font-krona-one">Feedback {feedbackResult.version}</h2>
              <p className="text-muted-foreground">
                Created on {formatDate(feedbackResult.createdAt)}
                {feedbackResult.feedbackQuery.designMaster && (
                  <span> • by {feedbackResult.feedbackQuery.designMaster.name}</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="mb-6 flex gap-4 border-b">
              <button
                className={`pb-2 px-1 font-quantico ${
                  activeTab === "feedback" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("feedback")}
              >
                {aiFeedback?.expert_reviews && aiFeedback.expert_reviews.length > 0 ? "Expert Review" : "AI Feedback"}
              </button>
              <button
                className={`pb-2 px-1 font-quantico ${
                  activeTab === "summary" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("summary")}
              >
                Summary
              </button>
              <button
                className={`pb-2 px-1 font-quantico ${
                  activeTab === "details" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Analysis Details
              </button>
            </div>

            {activeTab === "feedback" && renderFeedbackContent()}

            {activeTab === "summary" && <div className="space-y-6">{renderSummaryContent()}</div>}

            {activeTab === "details" && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 font-krona-one">Analysis Parameters</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground font-quantico">Industry:</span>
                        <p>{feedbackResult.feedbackQuery.industry}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground font-quantico">Product Type:</span>
                        <p>{feedbackResult.feedbackQuery.productType}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground font-quantico">Purpose:</span>
                        <p>{feedbackResult.feedbackQuery.purpose}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground font-quantico">Target Audience:</span>
                        <p>{feedbackResult.feedbackQuery.audience}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground font-quantico">Age Group:</span>
                        <p>{feedbackResult.feedbackQuery.ageGroup}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground font-quantico">Brand Personality:</span>
                        <p>{feedbackResult.feedbackQuery.brandPersonality}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground font-quantico">Platform:</span>
                        <p>{feedbackResult.feedbackQuery.platform}</p>
                      </div>
                    </div>
                    {aiFeedback?.metadata && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-2 font-quantico">AI Analysis Metadata:</h4>
                        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                          <pre>{JSON.stringify(aiFeedback.metadata, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-6">
              <Card className="overflow-hidden">
                <div className="aspect-[3/4] bg-muted relative">
                  <img
                    src={screen.sourceUrl || "/placeholder.svg?height=400&width=300"}
                    alt="Design preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold font-quantico">Screen Preview</h3>
                      <p className="text-sm text-muted-foreground">From {project.name}</p>
                    </div>
                    <Badge variant="outline">{feedbackResult.version}</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 space-y-4">
                <Button className="w-full">Apply to Figma</Button>
                <Link href={`/projects/${projectId}/screens/${screenId}/analyze`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    New Analysis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
