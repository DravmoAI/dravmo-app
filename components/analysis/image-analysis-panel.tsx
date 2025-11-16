"use client"

import { motion, useAnimation } from "framer-motion"
import { EyeOff, Eye } from "lucide-react"
import { useState } from "react"

interface ImageAnalysisPanelProps {
  onAnalysisSelect: (index: number | null) => void
  selectedIndex: number | null
  imageUrl: string
}

export function ImageAnalysisPanel({
  onAnalysisSelect,
  selectedIndex,
  imageUrl,
}: ImageAnalysisPanelProps) {
  const [showMarkers, setShowMarkers] = useState(true)
  const headerControls = useAnimation()

  const handleHoverStart = () => {
    headerControls.start({ opacity: 0, y: -20, transition: { duration: 0.3 } })
  }

  const handleHoverEnd = () => {
    headerControls.start({ opacity: 1, y: 0, transition: { duration: 0.3 } })
  }

  return (
    <motion.div
      className="relative rounded overflow-hidden border border-white/10 h-full"
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      {/* Header with Title and Subtitle */}
      <motion.div
        className="absolute top-0 left-0 p-4 z-10 bg-gradient-to-b from-black/60 to-transparent w-full"
        initial={{ opacity: 1, y: 0 }}
        animate={headerControls}
      >
        <h3 className="font-krona-one text-lg font-bold text-white/90">Visual Analysis</h3>
        <p className="text-xs text-white/60 mt-1 font-quantico">Click on markers to see details</p>
      </motion.div>

      <img
        src={imageUrl || "/placeholder.svg"}
        alt="Design analysis"
        className="w-full h-full object-contain"
      />

      {/* Toggle Markers Button */}
      <motion.button
        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg transition-colors z-20"
        onClick={() => setShowMarkers(!showMarkers)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {showMarkers ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        <span className="sr-only">{showMarkers ? "Hide Markers" : "Show Markers"}</span>
      </motion.button>

      {/* Numbered Markers */}
      {showMarkers && (
        <div className="absolute inset-0">
        {[
          { top: "20%", left: "15%", num: 1 },
          { top: "45%", left: "60%", num: 2 },
          { top: "70%", left: "35%", num: 3 },
        ].map((marker) => (
          <motion.button
            key={marker.num}
            whileHover={{ scale: 1.2 }}
            onClick={() => onAnalysisSelect(marker.num - 1)}
            className={`absolute w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
              selectedIndex === marker.num - 1
                ? "bg-cyan-500 text-black ring-2 ring-cyan-300"
                : "bg-cyan-500/40 text-white hover:bg-cyan-500/60"
            }`}
            style={{ top: marker.top, left: marker.left }}
          >
            {marker.num}
          </motion.button>
        ))}
      </div>
      )}
    </motion.div>
  )
}