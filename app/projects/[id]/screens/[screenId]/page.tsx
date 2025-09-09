"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, Download, Share2, Pencil } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/loading-spinner";
import { LoadingProgressBar } from "@/components/loading-progress-bar";

interface Screen {
  id: string;
  projectId: string;
  sourceUrl: string;
  sourceType: "upload" | "figma";
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
}

interface FeedbackResult {
  id: string;
  createdAt: string;
  feedbackSummary: string;
  version: string;
  feedbackQuery: {
    id: string;
    designMaster?: {
      id: string;
      name: string;
    };
  };
}

export default function ScreenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const screenId = params.screenId as string;
  const [screen, setScreen] = useState<Screen | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [feedbackResults, setFeedbackResults] = useState<FeedbackResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch screen data
        const screenResponse = await fetch(`/api/screens/${screenId}`);
        if (screenResponse.ok) {
          const screenData = await screenResponse.json();
          setScreen(screenData.screen);
        }

        // Fetch project data
        const projectResponse = await fetch(`/api/projects/${projectId}`);
        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          setProject(projectData.project);
        }

        // Fetch feedback results for this screen
        const feedbackResponse = await fetch(`/api/screens/${screenId}/feedback`);
        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json();
          setFeedbackResults(feedbackData.feedbackResults);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId, screenId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateSummary = (summary: string, maxLength = 80) => {
    if (summary.length <= maxLength) return summary;
    return summary.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingProgressBar isPending={isPending} />
        <LoadingSpinner size="lg" text="Loading screen details..." />
      </DashboardLayout>
    );
  }

  if (!screen || !project) {
    return (
      <DashboardLayout>
        <LoadingProgressBar isPending={isPending} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Screen not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <LoadingProgressBar isPending={isPending} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/projects/${projectId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Project
              </Button>
            </Link>
          </div>
          {/* <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Link href={`/projects/${projectId}/screens/${screenId}/analyze`}>
              <Button size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Analyze
              </Button>
            </Link>
          </div> */}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="overflow-hidden">
              <div className="bg-muted p-4">
                <div className="relative aspect-[4/3] bg-background rounded-md overflow-hidden">
                  <img
                    src={screen.sourceUrl || "/placeholder.svg"}
                    alt={`Screen ${screen.id}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {screen.sourceType === "figma" ? "Figma" : "Upload"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Uploaded on {formatDate(screen.createdAt)}
                    </span>
                  </div>
                  {/* <Button variant="ghost" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Details
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">Screen Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project:</span>
                      <span className="font-medium">{project.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span className="font-medium capitalize">{screen.sourceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{formatDate(screen.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">{formatDate(screen.updatedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Feedback Count:</span>
                      <span className="font-medium">{feedbackResults.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Link href={`/projects/${projectId}/screens/${screenId}/analyze`} className="block">
                <Button className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" />
                  New Analysis
                </Button>
              </Link>

              <div>
                <h3 className="font-bold mb-3">Feedback History</h3>
                {feedbackResults.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-muted-foreground text-sm">No feedback yet</p>
                      <Link
                        href={`/projects/${projectId}/screens/${screenId}/analyze`}
                        className="block mt-2"
                      >
                        <Button size="sm" variant="outline">
                          Create First Analysis
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {feedbackResults.map((result) => (
                      <Link
                        key={result.id}
                        href={`/projects/${projectId}/screens/${screenId}/feedback/${result.id}`}
                      >
                        <Card className="my-4 hover:border-primary/50 transition-colors">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {result.version}
                                </Badge>
                                {result.feedbackQuery.designMaster && (
                                  <Badge variant="default" className="text-xs">
                                    Master Review
                                  </Badge>
                                )}
                              </div>

                              <span className="text-xs text-muted-foreground">
                                {formatDate(result.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {truncateSummary(result.feedbackSummary)}
                            </p>
                            {result.feedbackQuery.designMaster && (
                              <Badge variant="secondary" className="text-xs -ml-1">
                                by {result.feedbackQuery.designMaster.name}
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
