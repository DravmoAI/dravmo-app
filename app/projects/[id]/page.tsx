"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Eye, MessageSquare, Upload } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingProgressBar } from "@/components/loading-progress-bar";

interface Screen {
  id: string;
  projectId: string;
  sourceUrl: string;
  sourceType: "upload" | "figma";
  createdAt: string;
  updatedAt: string;
  feedbackCount: number;
  lastFeedback?: string;
}

interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | "archived";
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchProjectData = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        if (response.status === 404) {
          startTransition(() => {
            router.push("/projects");
          });
          return;
        }
        throw new Error("Failed to fetch project");
      }
      const { project, screens } = await response.json();
      setProject(project);
      setScreens(screens);
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const handleAddScreen = () => {
    startTransition(() => {
      router.push(`/upload?projectId=${projectId}`);
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingProgressBar isPending={isPending} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading project...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <LoadingProgressBar isPending={isPending} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Project not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <LoadingProgressBar isPending={isPending} />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold">{project.name}</h2>
              <Badge variant={project.status === "active" ? "default" : "secondary"}>
                {project.status}
              </Badge>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span>Created: {formatDate(project.createdAt)}</span>
              <span>Updated: {formatDate(project.updatedAt)}</span>
              <span>Screens: {screens.length}</span>
            </div>
          </div>
          <Button className="gap-2" onClick={handleAddScreen}>
            <Plus className="h-4 w-4" />
            Add Screen
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {screens.map((screen) => (
            <Card
              key={screen.id}
              className="overflow-hidden hover:border-primary/50 transition-colors"
            >
              <div className="aspect-[4/3] bg-muted">
                <img
                  src={screen.sourceUrl || "/placeholder.svg?height=300&width=400"}
                  alt={`Screen ${screen.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg?height=300&width=400";
                  }}
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {screen.sourceType === "figma" ? "Figma" : "Upload"}
                      {screen.sourceType === "figma" ? (
                        <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.5 0H8.5C6.57 0 5 1.57 5 3.5S6.57 7 8.5 7H12V3.5C12 1.57 13.43 0 15.5 0ZM8.5 8.5C6.57 8.5 5 10.07 5 12S6.57 15.5 8.5 15.5H12V8.5H8.5ZM8.5 17C6.57 17 5 18.57 5 20.5S6.57 24 8.5 24S12 22.43 12 20.5V17H8.5ZM13 12C13 10.07 14.57 8.5 16.5 8.5S20 10.07 20 12S18.43 15.5 16.5 15.5S13 13.93 13 12ZM15.5 0C17.43 0 19 1.57 19 3.5S17.43 7 15.5 7H12V0H15.5Z" />
                        </svg>
                      ) : (
                        <Upload className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    {screen.feedbackCount}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  <div>Created: {formatDate(screen.createdAt)}</div>
                  {screen.lastFeedback && (
                    <div>Last feedback: {formatDate(screen.lastFeedback)}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/projects/${projectId}/screens/${screen.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/projects/${projectId}/screens/${screen.id}/analyze`}>
                    <Button size="sm" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Analyze
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {screens.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No screens in this project yet</div>
            <Button onClick={handleAddScreen}>Add Your First Screen</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
