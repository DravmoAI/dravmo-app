"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSupabaseClient } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: any) => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
  onProjectCreated,
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [planInfo, setPlanInfo] = useState<any>(null);
  const supabase = getSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        // Fetch plan info
        try {
          const response = await fetch(`/api/user-plan-info?userId=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setPlanInfo(data);
          }
        } catch (error) {
          console.error("Error fetching plan info:", error);
        }
      }
    };
    getUser();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !userId) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName.trim(),
          userId: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle plan limit exceeded
        if (errorData.code === "PROJECT_LIMIT_EXCEEDED") {
          toast({
            title: "Project Limit Reached",
            description: errorData.error,
            variant: "destructive",
          });

          // Show upgrade prompt
          const shouldUpgrade = confirm(
            `${errorData.error}\n\nWould you like to upgrade your plan to create more projects?`
          );

          if (shouldUpgrade) {
            router.push("/billing");
          }
          return;
        }

        throw new Error(errorData.error || "Failed to create project");
      }

      const { project } = await response.json();
      onProjectCreated(project);
      setProjectName("");
      onOpenChange(false);

      toast({
        title: "Project Created",
        description: "Your new project has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Give your project a name to get started with design feedback.
            </DialogDescription>
            {planInfo && planInfo.restrictions.maxProjects !== -1 && (
              <div className="text-sm text-muted-foreground">
                Projects used: {planInfo.usage.currentProjects}/{planInfo.restrictions.maxProjects}
                {planInfo.usage.remainingProjects === 0 && (
                  <span className="text-destructive ml-2">(Limit reached)</span>
                )}
              </div>
            )}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !projectName.trim() || !userId}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
