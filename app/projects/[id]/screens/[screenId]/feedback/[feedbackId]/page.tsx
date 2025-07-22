"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
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

interface BoundingBox {
  id: string
  x: number
  y: number
  width: number
  height: number
  judgement: string
  color: string
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
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([])
  const [selectedBoundingBox, setSelectedBoundingBox] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Extract bounding boxes from feedback data
  useEffect(() => {
    if (!aiFeedback || !imageLoaded) return

    const boxes: BoundingBox[] = []
    const colors = [
      "#ef4444", // red
      "#f97316", // orange
      "#eab308", // yellow
      "#22c55e", // green
      "#3b82f6", // blue
      "#8b5cf6", // purple
      "#ec4899", // pink
      "#06b6d4", // cyan
    ]
    let colorIndex = 0

    // Extract from expert reviews
    if (aiFeedback.expert_reviews) {
      aiFeedback.expert_reviews.forEach((expert) => {
        expert.screen_review.forEach((review, index) => {
          if (review.bbox && Array.isArray(review.bbox) && review.bbox.length === 4) {
            const [x, y, width, height] = review.bbox
            boxes.push({
              id: `expert-${expert.name}-${index}`,
              x,
              y,
              width,
              height,
              judgement: review.judgement,
              color: colors[colorIndex % colors.length],
            })
            colorIndex++
          }
        })
      })
    }

    // Extract from general review
    if (aiFeedback.general_review) {
      Object.entries(aiFeedback.general_review).forEach(([topicName, topicData]) => {
        Object.entries(topicData).forEach(([subtopicName, subtopicData]) => {
          Object.entries(subtopicData).forEach(([pointName, judgements]) => {
            judgements.forEach((item, index) => {
              if (item.bbox && Array.isArray(item.bbox) && item.bbox.length === 4) {
                const [x, y, width, height] = item.bbox
                boxes.push({
                  id: `general-${topicName}-${subtopicName}-${pointName}-${index}`,
                  x,
                  y,
                  width,
                  height,
                  judgement: item.judgement,
                  color: colors[colorIndex % colors.length],
                })
                colorIndex++
              }
            })
          })
        })
      })
    }

    setBoundingBoxes(boxes)
  }, [aiFeedback, imageLoaded])

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

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleBoundingBoxClick = (boxId: string) => {
    setSelectedBoundingBox(selectedBoundingBox === boxId ? null : boxId)
  }

  const renderBoundingBoxes = () => {
    if (!imageRef.current || !containerRef.current || boundingBoxes.length === 0) return null

    const imageRect = imageRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    // Calculate the actual displayed image dimensions (accounting for object-contain)
    const imageNaturalRatio = imageRef.current.naturalWidth / imageRef.current.naturalHeight
    const containerRatio = imageRect.width / imageRect.height

    let displayedWidth, displayedHeight, offsetX, offsetY

    if (imageNaturalRatio > containerRatio) {
      // Image is wider, so it's constrained by width
      displayedWidth = imageRect.width
      displayedHeight = imageRect.width / imageNaturalRatio
      offsetX = 0
      offsetY = (imageRect.height - displayedHeight) / 2
    } else {
      // Image is taller, so it's constrained by height
      displayedWidth = imageRect.height * imageNaturalRatio
      displayedHeight = imageRect.height
      offsetX = (imageRect.width - displayedWidth) / 2
      offsetY = 0
    }

    const scaleX = displayedWidth / imageRef.current.naturalWidth
    const scaleY = displayedHeight / imageRef.current.naturalHeight

    return (
      <div className="absolute inset-0 pointer-events-none">
        {boundingBoxes.map((box) => {
          const scaledX = box.x * scaleX + offsetX
          const scaledY = box.y * scaleY + offsetY
          const scaledWidth = box.width * scaleX
          const scaledHeight = box.height * scaleY

          return (
            <div
              key={box.id}
              className={`absolute border-2 pointer-events-auto cursor-pointer transition-all duration-200 ${
                selectedBoundingBox === box.id ? "border-4 bg-black/20" : "border-2 hover:bg-black/10"
              }`}
              style={{
                left: `${scaledX}px`,
                top: `${scaledY}px`,
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                borderColor: box.color,
              }}
              onClick={() => handleBoundingBoxClick(box.id)}
              title={box.judgement.substring(0, 100) + "..."}
            >
              <div
                className="absolute -top-6 left-0 px-2 py-1 text-xs font-bold text-white rounded"
                style={{ backgroundColor: box.color }}
              >
                {boundingBoxes.indexOf(box) + 1}
              </div>
            </div>
          )
        })}
      </div>
    )
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
                  <p className="text-sm text-muted-foreground">Master Design Review</p>
                </div>
              </div>

              <div className="space-y-4">
                {expertReview.screen_review.map((review, reviewIndex) => {
                  const boxId = `expert-${expertReview.name}-${reviewIndex}`
                  const boundingBox = boundingBoxes.find((box) => box.id === boxId)

                  return (
                    <div
                      key={reviewIndex}
                      className={`flex gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedBoundingBox === boxId
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                      onClick={() => boundingBox && handleBoundingBoxClick(boxId)}
                    >
                      {boundingBox && (
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0 mt-1 flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: boundingBox.color }}
                        >
                          {boundingBoxes.indexOf(boundingBox) + 1}
                        </div>
                      )}
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
                  )
                })}
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
                          {judgements.map((item, index) => {
                            const boxId = `general-${topicName}-${subtopicName}-${pointName}-${index}`
                            const boundingBox = boundingBoxes.find((box) => box.id === boxId)

                            return (
                              <Card
                                key={index}
                                className={`cursor-pointer transition-colors ${
                                  selectedBoundingBox === boxId ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                }`}
                                onClick={() => boundingBox && handleBoundingBoxClick(boxId)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-2">
                                    {boundingBox && (
                                      <div
                                        className="w-4 h-4 rounded-full flex-shrink-0 mt-1 flex items-center justify-center text-xs font-bold text-white"
                                        style={{ backgroundColor: boundingBox.color }}
                                      >
                                        {boundingBoxes.indexOf(boundingBox) + 1}
                                      </div>
                                    )}
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
                            )
                          })}
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
          <h3 className="text-xl font-bold mb-4 font-krona-one">Analytics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalIssues}</div>
                <div className="text-sm text-muted-foreground">Total Insights</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{boundingBoxes.length}</div>
                <div className="text-sm text-muted-foreground">Visual Annotations</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 font-quantico">
                {isExpertReview ? "Master Reviewers:" : "Areas Reviewed:"}
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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-4">
            <Link href={`/projects/${projectId}/screens/${screenId}`}>
              <Button variant="ghost" size="sm" className="gap-2 -ml-4">
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
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Image Preview - Takes up most space */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div ref={containerRef} className="relative bg-muted" style={{ minHeight: "70vh" }}>
                  <img
                    ref={imageRef}
                    src={screen.sourceUrl || "/placeholder.svg?height=800&width=600"}
                    alt="Design preview"
                    className="w-full h-full object-contain"
                    onLoad={handleImageLoad}
                  />
                  {renderBoundingBoxes()}
                </div>
                <div className="p-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold font-quantico">Screen Preview</h3>
                      <p className="text-sm text-muted-foreground">From {project.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{feedbackResult.version}</Badge>
                      {boundingBoxes.length > 0 && (
                        <Badge variant="secondary">{boundingBoxes.length} annotations</Badge>
                      )}
                    </div>
                  </div>
                  {boundingBoxes.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Click on numbered boxes to highlight corresponding feedback
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Content */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-6">
              <div className="flex gap-2 border-b">
                <button
                  className={`pb-2 px-1 font-quantico text-sm ${
                    activeTab === "feedback" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("feedback")}
                >
                  {aiFeedback?.expert_reviews && aiFeedback.expert_reviews.length > 0 ? "Master Review" : "AI Feedback"}
                </button>
                <button
                  className={`pb-2 px-1 font-quantico text-sm ${
                    activeTab === "summary" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("summary")}
                >
                  Analytics
                </button>
                <button
                  className={`pb-2 px-1 font-quantico text-sm ${
                    activeTab === "details" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto">
                {activeTab === "feedback" && renderFeedbackContent()}

                {activeTab === "summary" && renderSummaryContent()}

                {activeTab === "details" && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 font-krona-one">Analysis Details</h3>
                      <div className="grid grid-cols-1 gap-4 text-sm">
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
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="pt-4 border-t">
                <Link href={`/projects/${projectId}/screens/${screenId}/analyze`}>
                  <Button className="w-full">New Analysis</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
