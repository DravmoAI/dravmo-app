"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DarkVeil } from "@/components/DarkVeil"
import { DashboardNav } from "@/components/dashboard-nav"
import { ConversationPanel } from "@/components/analysis/conversation-panel"
import { AnalysisPanel } from "@/components/analysis/analysis-panel"
import { ImageAnalysisPanel } from "@/components/analysis/image-analysis-panel"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { useIsMobile } from "@/hooks/use-mobile"

export default function AnalysisPage() {
  const [selectedAnalysisIndex, setSelectedAnalysisIndex] = useState<number | null>(
    null
  )
  const isMobile = useIsMobile()

  // Avoid hydration mismatch
  if (isMobile === undefined) {
    return null
  }

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden">
      {/* Background Effect */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <DarkVeil hueShift={50} speed={0.5} resolutionScale={1.2} />
      </div>

      <DashboardNav />

      {/* Main Content */}
      <main className="relative z-10 pt-16 h-[calc(100vh-64px)] flex">
        {isMobile ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full border-r border-white/10 bg-black/40 backdrop-blur-sm flex flex-col"
          >
            <ConversationPanel />
          </motion.div>
        ) : (
          <ResizablePanelGroup direction="horizontal" className="w-full">
            <ResizablePanel defaultSize={25} minSize={20}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full border-r border-white/10 bg-black/40 backdrop-blur-sm flex flex-col"
              >
                <ConversationPanel />
              </motion.div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-full flex flex-col bg-black/20 backdrop-blur-sm overflow-hidden p-4"
              >
                <ImageAnalysisPanel
                  onAnalysisSelect={setSelectedAnalysisIndex}
                  selectedIndex={selectedAnalysisIndex}
                  imageUrl="/design-analysis-with-numbered-markers.jpg"
                />
              </motion.div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={20}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full flex flex-col bg-black/20 backdrop-blur-sm overflow-hidden"
              >
                <AnalysisPanel selectedIndex={selectedAnalysisIndex} />
              </motion.div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </main>
    </div>
  )
}
