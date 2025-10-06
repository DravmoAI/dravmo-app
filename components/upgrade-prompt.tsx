
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Star } from "lucide-react";

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  feature?: string;
  currentPlan?: string;
}

export function UpgradePrompt({
  open,
  onOpenChange,
  title,
  description,
  feature,
  currentPlan = "Free",
}: UpgradePromptProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleUpgrade = () => {
    setIsNavigating(true);
    router.push("/billing");
  };

  const getPlanRecommendation = () => {
    if (feature?.includes("analyzer") || feature?.includes("premium")) {
      return {
        plan: "Lite",
        icon: <Zap className="h-4 w-4" />,
        color: "bg-blue-500",
        description: "Access to all premium analyzers and advanced features",
      };
    }
    if (feature?.includes("priority") || feature?.includes("analytics")) {
      return {
        plan: "Pro",
        icon: <Crown className="h-4 w-4" />,
        color: "bg-purple-500",
        description: "Priority support, advanced analytics, and custom branding",
      };
    }
    return {
      plan: "Lite",
      icon: <Star className="h-4 w-4" />,
      color: "bg-green-500",
      description: "Unlock unlimited projects and queries",
    };
  };

  const recommendation = getPlanRecommendation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">Current Plan</p>
              <p className="text-xs text-muted-foreground">{currentPlan}</p>
            </div>
            <Badge variant="secondary">{currentPlan}</Badge>
          </div>

          <div className="flex items-center justify-between p-3 border-2 border-primary rounded-lg bg-primary/5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${recommendation.color} text-white`}>
                {recommendation.icon}
              </div>
              <div>
                <p className="text-sm font-medium">Recommended: {recommendation.plan}</p>
                <p className="text-xs text-muted-foreground">{recommendation.description}</p>
              </div>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              {recommendation.plan}
            </Badge>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} disabled={isNavigating}>
            {isNavigating ? "Redirecting..." : "Upgrade Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
