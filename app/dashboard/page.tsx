"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  screenCount: number;
  lastFeedback: string;
  status: string;
  thumbnail?: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUserAndProjects() {
      try {
        const supabase = getSupabaseClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Please log in to view your projects");
          setLoading(false);
          return;
        }

        setUser(user);

        // Fetch projects from API
        const response = await fetch(`/api/projects?userId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();

        // Get the 3 most recent projects
        const recentProjects = data.projects.slice(0, 3);

        // For each project, try to get a thumbnail from the first screen
        const projectsWithThumbnails = await Promise.all(
          recentProjects.map(async (project: Project) => {
            try {
              const screensResponse = await fetch(`/api/screens?projectId=${project.id}`);
              if (screensResponse.ok) {
                const screensData = await screensResponse.json();
                const firstScreen = screensData.screens?.[0];
                return {
                  ...project,
                  thumbnail:
                    firstScreen?.sourceUrl || "/placeholder.svg?height=100&width=200&text=No+Image",
                };
              }
            } catch (error) {
              console.error(`Error fetching screens for project ${project.id}:`, error);
            }
            return {
              ...project,
              thumbnail: "/placeholder.svg?height=100&width=200&text=No+Image",
            };
          })
        );

        setProjects(projectsWithThumbnails);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndProjects();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner className="min-h-[400px]" />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold font-krona-one">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}!
          </h2>
          <Link href="/upload">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Upload
            </Button>
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-roboto-flex">Recent Projects</h3>
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-muted-foreground mb-4">No projects yet</p>
                <Link href="/upload">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="aspect-video w-full bg-muted">
                      <img
                        src={project.thumbnail || "/placeholder.svg"}
                        alt={project.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=100&width=200&text=No+Image";
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="font-medium truncate">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(project.updatedAt)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {project.screenCount} screen{project.screenCount !== 1 ? "s" : ""}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
