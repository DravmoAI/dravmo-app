"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Lightbulb, CheckCircle2 } from "lucide-react"

interface AnalysisItem {
  id: number
  title: string
  description: string
  suggestion: string
  severity: "high" | "medium" | "low"
  markerPosition: { top: string; left: string }
}

interface Category {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  subtopics: Subtopic[]
}

interface Subtopic {
  id: string
  title: string
  items: AnalysisItem[]
}

interface AnalysisPanelProps {
  selectedIndex: number | null
}

const analysisData: Category[] = [
  {
    id: "layout",
    title: "Layout & Structure",
    icon: "📐",
    color: "cyan",
    subtopics: [
      {
        id: "grid",
        title: "Grid & Alignment",
        items: [
          {
            id: 1,
            title: "Hero Section Misalignment",
            description:
              "The main hero section elements are not properly aligned to a consistent grid system.",
            suggestion:
              "Implement an 8px or 12px grid system throughout the design. Use consistent padding and margins to create visual harmony.",
            severity: "high",
            markerPosition: { top: "20%", left: "15%" },
          },
          {
            id: 2,
            title: "Spacing Inconsistency",
            description:
              "Padding between UI elements varies inconsistently across the layout.",
            suggestion:
              "Establish a spacing scale: 4px, 8px, 12px, 16px, 24px, 32px. Apply consistently throughout all components.",
            severity: "medium",
            markerPosition: { top: "45%", left: "60%" },
          },
        ],
      },
      {
        id: "hierarchy",
        title: "Hierarchy & Flow",
        items: [
          {
            id: 3,
            title: "Unclear Visual Priority",
            description:
              "Multiple elements compete for attention with similar visual weight.",
            suggestion:
              "Use size, color, and positioning to establish clear hierarchy. The most important elements should be largest and centrally placed.",
            severity: "high",
            markerPosition: { top: "70%", left: "35%" },
          },
        ],
      },
      {
        id: "spacing",
        title: "Spacing & Grouping",
        items: [
          {
            id: 4,
            title: "Related Elements Not Grouped",
            description:
              "Logically related elements should be placed closer together for better cognitive grouping.",
            suggestion:
              "Group related elements with 16px spacing internally and 32px spacing between different groups.",
            severity: "medium",
            markerPosition: { top: "50%", left: "50%" },
          },
        ],
      },
    ],
  },
  {
    id: "typography",
    title: "Typography & Readability",
    icon: "🔤",
    color: "blue",
    subtopics: [
      {
        id: "font",
        title: "Font Selection",
        items: [
          {
            id: 5,
            title: "Inconsistent Font Families",
            description: "More than 3 different font families are used across the design.",
            suggestion:
              "Stick to a maximum of 2 font families: one for headings and one for body text. Use weights for variation.",
            severity: "medium",
            markerPosition: { top: "30%", left: "50%" },
          },
        ],
      },
      {
        id: "scale",
        title: "Scale & Rhythm",
        items: [
          {
            id: 6,
            title: "Non-Harmonic Type Scale",
            description: "Text sizes don't follow a consistent mathematical ratio.",
            suggestion:
              "Use a type scale based on 1.125x or 1.25x ratio: 12px, 14px, 16px, 18px, 20px, 24px, 28px, 32px.",
            severity: "medium",
            markerPosition: { top: "25%", left: "75%" },
          },
        ],
      },
      {
        id: "legibility",
        title: "Legibility & Contrast",
        items: [
          {
            id: 7,
            title: "Low Text Contrast",
            description: "Some text colors don't meet WCAG AA contrast requirements.",
            suggestion:
              "Ensure minimum 4.5:1 contrast ratio for body text and 3:1 for large text. Test with contrast checkers.",
            severity: "high",
            markerPosition: { top: "60%", left: "40%" },
          },
        ],
      },
    ],
  },
  {
    id: "color",
    title: "Color & Visual Rhythm",
    icon: "🎨",
    color: "purple",
    subtopics: [
      {
        id: "palette",
        title: "Palette Consistency",
        items: [
          {
            id: 8,
            title: "Too Many Colors",
            description: "The design uses more than 5-7 distinct colors.",
            suggestion:
              "Limit palette to: 1 primary, 1-2 secondaries, 3-4 neutrals, and optional accent. This creates cohesion.",
            severity: "medium",
            markerPosition: { top: "35%", left: "65%" },
          },
        ],
      },
      {
        id: "contrast",
        title: "Contrast & Accessibility",
        items: [
          {
            id: 9,
            title: "Low Interactive Element Contrast",
            description:
              "Buttons and interactive elements lack sufficient contrast from the background.",
            suggestion:
              "Use colors with at least 3:1 contrast ratio. Add borders or shadows to interactive elements for better affordance.",
            severity: "high",
            markerPosition: { top: "15%", left: "50%" },
          },
        ],
      },
      {
        id: "imagery",
        title: "Imagery & Iconography",
        items: [
          {
            id: 10,
            title: "Inconsistent Icon Style",
            description: "Icons use different styles and stroke weights throughout the design.",
            suggestion:
              "Use a single icon system with consistent stroke weight, size, and style. Pick either solid or outline.",
            severity: "low",
            markerPosition: { top: "55%", left: "30%" },
          },
        ],
      },
    ],
  },
]

export function AnalysisPanel({ selectedIndex }: AnalysisPanelProps) {
  const [activeCategory, setActiveCategory] = useState("layout")
  const [activeSubtopic, setActiveSubtopic] = useState("grid")
  const [expandedItem, setExpandedItem] = useState<number | null>(
    selectedIndex !== null ? selectedIndex + 1 : null
  )

  useEffect(() => {
    if (selectedIndex !== null) {
      setExpandedItem(selectedIndex + 1)
      analysisData.forEach((category) => {
        category.subtopics.forEach((subtopic) => {
          const hasItem = subtopic.items.some((item) => item.id === selectedIndex + 1)
          if (hasItem) {
            setActiveCategory(category.id)
            setActiveSubtopic(subtopic.id)
          }
        })
      })
    }
  }, [selectedIndex])

  const currentCategory = analysisData.find((c) => c.id === activeCategory)
  const currentSubtopic = currentCategory?.subtopics.find((s) => s.id === activeSubtopic)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/20 border-red-500/30 text-red-300"
      case "medium":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-300"
      case "low":
        return "bg-blue-500/20 border-blue-500/30 text-blue-300"
      default:
        return "bg-white/10 border-white/20"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4" />
      case "medium":
        return <Lightbulb className="h-4 w-4" />
      case "low":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <h2 className="text-lg font-bold text-white/90 font-krona-one">Design Analysis</h2>
        <p className="text-xs text-white/50 mt-1 font-quantico">
          10 issues found • Click markers to view details
        </p>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-white/10 px-4 pt-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {analysisData.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id)
              setActiveSubtopic(category.subtopics[0].id)
            }}
            className={`pb-3 px-3 text-sm font-medium whitespace-nowrap transition-all font-quantico ${
              activeCategory === category.id
                ? "border-b-2 border-cyan-400 text-cyan-300"
                : "text-white/50 hover:text-white/70 border-b-2 border-transparent"
            }`}
            whileHover={{ y: -2 }}
          >
            {category.icon} {category.title}
          </motion.button>
        ))}
      </div>

      {/* Subtopic & Analysis Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentCategory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Subtopic Selection */}
            <div className="flex gap-2 flex-wrap mb-4">
              {currentCategory.subtopics.map((subtopic) => (
                <motion.button
                  key={subtopic.id}
                  onClick={() => setActiveSubtopic(subtopic.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all font-quantico ${
                    activeSubtopic === subtopic.id
                      ? "bg-cyan-500/30 border border-cyan-400 text-cyan-200"
                      : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {subtopic.title}
                </motion.button>
              ))}
            </div>

            {/* Analysis Items */}
            <div className="space-y-3">
              <AnimatePresence>
                {currentSubtopic?.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedItem(expandedItem === item.id ? null : item.id)
                    }
                  >
                    <Card
                      className={`border transition-all ${
                        expandedItem === item.id
                          ? "border-cyan-500/50 bg-cyan-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 rounded-full p-1 flex-shrink-0">
                            {getSeverityIcon(item.severity)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-semibold text-white/90 text-sm font-quantico">
                                {item.title}
                              </h3>
                              <Badge
                                className={`text-xs font-medium border ${getSeverityColor(
                                  item.severity
                                )}`}
                                variant="outline"
                              >
                                {item.severity === "high"
                                  ? "Critical"
                                  : item.severity === "medium"
                                  ? "Medium"
                                  : "Low"}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                              >
                                #{item.id}
                              </Badge>
                            </div>

                            <p className="text-xs text-white/60 mb-3 font-roboto-flex">
                              {item.description}
                            </p>

                            <AnimatePresence>
                              {expandedItem === item.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="border-t border-white/10 pt-3 mt-3"
                                >
                                  <div className="bg-white/5 rounded p-3">
                                    <div className="flex gap-2 items-start">
                                      <Lightbulb className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <p className="text-xs font-semibold text-white/80 mb-1 font-quantico">
                                          Suggestion:
                                        </p>
                                        <p className="text-xs text-white/60 leading-relaxed font-roboto-flex">
                                          {item.suggestion}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
