"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface LoadingProgressBarProps {
  isPending: boolean;
}

export function LoadingProgressBar({ isPending }: LoadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPending) {
      setProgress(0);
      return;
    }

    // Start progress animation
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev; // Stop at 90% until navigation completes
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [isPending]);

  if (!isPending) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress
        value={progress}
        className="h-1 rounded-none bg-transparent"
        style={{
          background: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
        }}
      />
    </div>
  );
}
