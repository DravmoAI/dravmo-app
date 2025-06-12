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

interface FeedbackItem {
  title: string
  description: string
  severity: "high" | "medium" | "low"
}

interface FeedbackCategory {
  title: string
  items: FeedbackItem[]
}

interface FeedbackResult {
  id: string
  createdAt: string
  version: string
  summary: string
  categories: Record<string, FeedbackCategory>
}

export default function FeedbackDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const screenId = params.screenId as string
  const feedbackId = params.feedbackId as string
  const [activeTab, setActiveTab] = useState("feedback")
  const [feedbackResult, setFeedbackResult] = useState<FeedbackResult | null>(null)

  useEffect(() => {
    // Mock feedback result data
    const mockFeedbackResult: FeedbackResult = {
      id: feedbackId,
      createdAt: "2024-01-20",
      version: "v3",
      summary: "Layout analysis with typography recommendations",
      categories: {
        layout: {
          title: "Layout & Structure",
          items: [
            {
              title: "Hero Section Overload",
              description:
                "The large 'Praktika' text competes with the phone mockup for attention. Consider reducing its opacity or shifting it slightly to create a clearer visual hierarchy.",
              severity: "medium",
            },
            {
              title: "Navigation Pills",
              description:
                "The tabs at the bottom lack sufficient visual cues to indicate they're interactive. Consider adding subtle underlines or shadows to enhance their affordance.",
              severity: "low",
            },
          ],
        },
        typography: {
          title: "Typography & Readability",
          items: [
            {
              title: "Font Contrast Issues",
              description:
                "The white text on yellow background creates readability issues. Consider using a darker text color or adding a subtle text shadow to improve contrast.",
              severity: "high",
            },
            {
              title: "Inconsistent Type Scale",
              description:
                "There are too many different text sizes being used. Recommend consolidating to a more consistent type scale with 3-4 distinct sizes.",
              severity: "medium",
            },
          ],
        },
      },
    }

    setFeedbackResult(mockFeedbackResult)
  }, [feedbackId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!feedbackResult) {
    return <DashboardLayout>Loading...</DashboardLayout>
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
              <h2 className="text-3xl font-bold">Feedback {feedbackResult.version}</h2>
              <p className="text-muted-foreground">Created on {formatDate(feedbackResult.createdAt)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="mb-6 flex gap-4 border-b">
              <button
                className={`pb-2 px-1 ${
                  activeTab === "feedback" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("feedback")}
              >
                Feedback
              </button>
              <button
                className={`pb-2 px-1 ${
                  activeTab === "summary" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("summary")}
              >
                Summary
              </button>
            </div>

            {activeTab === "feedback" && (
              <div className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  {Object.entries(feedbackResult.categories).map(([key, category]) => (
                    <AccordionItem key={key} value={key}>
                      <AccordionTrigger className="text-lg font-medium">{category.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          {category.items.map((item, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-2">
                                  <div
                                    className={`h-3 w-3 rounded-full mt-1.5 ${
                                      item.severity === "high"
                                        ? "bg-destructive"
                                        : item.severity === "medium"
                                          ? "bg-tertiary"
                                          : "bg-primary"
                                    }`}
                                  />
                                  <div>
                                    <h4 className="font-medium">{item.title}</h4>
                                    <p className="text-muted-foreground text-sm">{item.description}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Design Summary</h3>
                    <p className="text-muted-foreground mb-4">
                      Your design shows strong potential with its vibrant color choices and modern aesthetic. The
                      primary areas for improvement are in typography contrast, layout hierarchy, and interactive
                      element affordances.
                    </p>
                    <h4 className="font-bold mt-6 mb-2">Strengths</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Bold, energetic color palette that stands out</li>
                      <li>Clean, modern illustration style</li>
                      <li>Good use of white space in certain areas</li>
                    </ul>
                    <h4 className="font-bold mt-6 mb-2">Areas for Improvement</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Typography contrast and readability</li>
                      <li>Visual hierarchy in the hero section</li>
                      <li>Interactive element affordances</li>
                    </ul>
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
                    src="/placeholder.svg?height=400&width=300"
                    alt="Design preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">Screen Preview</h3>
                      <p className="text-sm text-muted-foreground">From {projectId}</p>
                    </div>
                    <Badge variant="outline">{feedbackResult.version}</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 space-y-4">
                <Button className="w-full">Apply to Figma</Button>
                <Link href={`/projects/${projectId}/screens/${screenId}/analyze`}>
                  <Button variant="outline" className="w-full">
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
