"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Download, Share2 } from "lucide-react"
import { useState } from "react"

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState("feedback")

  // Mock feedback data
  const feedbackData = {
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
    color: {
      title: "Color & Visual Rhythm",
      items: [
        {
          title: "Color Harmony",
          description:
            "The yellow and teal combination works well for creating energy, but consider adding a neutral tone to provide visual rest areas.",
          severity: "low",
        },
        {
          title: "Background Contrast",
          description:
            "The bright yellow background may cause eye strain during extended use. Consider offering a dark mode option or slightly desaturating the background.",
          severity: "medium",
        },
      ],
    },
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Design Feedback</h2>
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
              <button
                className={`pb-2 px-1 ${
                  activeTab === "history" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("history")}
              >
                History
              </button>
            </div>

            {activeTab === "feedback" && (
              <div className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="layout">
                    <AccordionTrigger className="text-lg font-medium">Layout & Structure</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {feedbackData.layout.items.map((item, index) => (
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
                  <AccordionItem value="typography">
                    <AccordionTrigger className="text-lg font-medium">Typography & Readability</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {feedbackData.typography.items.map((item, index) => (
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
                  <AccordionItem value="color">
                    <AccordionTrigger className="text-lg font-medium">Color & Visual Rhythm</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {feedbackData.color.items.map((item, index) => (
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
                  <AccordionItem value="masters">
                    <AccordionTrigger className="text-lg font-medium">Design Master Review</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-2">
                              <div className="h-3 w-3 rounded-full mt-1.5 bg-tertiary" />
                              <div>
                                <h4 className="font-medium">Dieter Rams Would Say...</h4>
                                <p className="text-muted-foreground text-sm">
                                  "This design has potential but lacks restraint. Remember that good design is as little
                                  design as possible. Consider removing decorative elements that don't serve a clear
                                  purpose."
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-2">
                              <div className="h-3 w-3 rounded-full mt-1.5 bg-primary" />
                              <div>
                                <h4 className="font-medium">Grid Alignment</h4>
                                <p className="text-muted-foreground text-sm">
                                  "Your layout would benefit from a more rigorous grid system. Rams' work always
                                  featured precise alignment and mathematical proportions."
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
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

            {activeTab === "history" && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Version History</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">v3</div>
                        <div>
                          <div className="font-medium">Current Version</div>
                          <div className="text-sm text-muted-foreground">Today, 2:45 PM</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">v2</div>
                        <div>
                          <div className="font-medium">Second Iteration</div>
                          <div className="text-sm text-muted-foreground">Yesterday, 4:30 PM</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">v1</div>
                        <div>
                          <div className="font-medium">Initial Upload</div>
                          <div className="text-sm text-muted-foreground">2 days ago, 10:15 AM</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-6">
              <Card className="overflow-hidden">
                <div className="aspect-[3/4] bg-tertiary relative">
                  <img
                    src="/placeholder.svg?height=400&width=300"
                    alt="Design preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold">praktika</h3>
                  <p className="text-sm text-muted-foreground">EDUCATION MOBILE APP DESIGN</p>
                </CardContent>
              </Card>

              <div className="mt-6 space-y-4">
                <Button className="w-full">Apply to Figma</Button>
                <Button variant="outline" className="w-full">
                  Save Feedback
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
