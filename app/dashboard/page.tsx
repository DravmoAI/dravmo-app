"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/loading-spinner";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { LoadingProgressBar } from "@/components/loading-progress-bar";

interface Project {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  thumbnail?: string;
  updatedAt: string;
  screenCount: number;
  lastFeedback: string;
}

const mapColorBoldnessToName = {
  "0": "Monochrone Zen",
  "50": "Balanced Pop",
  "100": "Full-blast Neon",
};

const maptypeTemperamentToName = {
  "0": "Ultra-clean Sans-serif",
  "50": "Humanist Hybrid",
  "100": "Experimental Decorative",
};

const mapSpacingAirinessToName = {
  "0": "Compact & Dense",
  "50": "Balanced Breathing",
  "100": "Cloud-like Levity",
};

const mapMotionDramaToName = {
  "0": "Static & Direct",
  "50": "Subtle Animation",
  "100": "Cinematic Spectacle",
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [persona, setPersona] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [planInfo, setPlanInfo] = useState<any>(null);

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

        // Fetch user profile with persona
        const profileResponse = await fetch(`/api/profile/${user.id}`);
        if (profileResponse.ok) {
          const { profile } = await profileResponse.json();
          setPersona(profile?.persona);
        }

        // Fetch plan info
        const planResponse = await fetch(`/api/user-plan-info?userId=${user.id}`);
        if (planResponse.ok) {
          const planData = await planResponse.json();
          setPlanInfo(planData);
        }

        // Fetch projects from API
        const response = await fetch(`/api/projects?userId=${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch projects");

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

    const checkAndRedirectUser = async () => {
      console.log("Checking user authentication status...");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("Fetched user:", user);

      if (user) {
        console.log("User is logged in:", user);

        try {
          const response = await fetch(`/api/profile/${user.id}`);

          if (response.ok) {
            const data = await response.json();

            if (data.profile?.persona) {
              console.log("User has completed persona setup, loading projects...");
              fetchUserAndProjects();
            } else {
              startTransition(() => {
                router.push("/persona");
              });
            }
          } else {
            const response = await fetch("/api/profile", {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                id: user.id,
                email: user.email,
                fullName: `${user.user_metadata.full_name}`,
              }),
            });

            if (!response.ok) throw new Error("Failed to create profile");
            startTransition(() => {
              router.push("/persona");
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          startTransition(() => {
            router.push("/login"); // Redirect to login if there's an error
          });
        }
      }
    };

    checkAndRedirectUser();
  }, []);

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
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
        <LoadingProgressBar isPending={isPending} />
        <LoadingSpinner className="min-h-[400px]" />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <LoadingProgressBar isPending={isPending} />
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
      <LoadingProgressBar isPending={isPending} />
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

        {/* Plan Info Section */}
        {planInfo && (
          <Card className="bg-gradient-to-r from-[#0D1B2A] to-[#0F1619] dark:from-[#0D1B2A] dark:to-[#0F1619]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-krona-one">Current Plan</CardTitle>
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {planInfo.planName}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {planInfo.restrictions.maxProjects === -1
                      ? "∞"
                      : planInfo.usage.currentProjects}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {planInfo.restrictions.maxProjects === -1
                      ? "Unlimited Projects"
                      : `Projects (${planInfo.usage.remainingProjects} remaining)`}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {planInfo.restrictions.maxQueries === -1 ? "∞" : planInfo.usage.currentQueries}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {planInfo.restrictions.maxQueries === -1
                      ? "Unlimited Queries"
                      : `Queries (${planInfo.usage.remainingQueries} remaining)`}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {planInfo.restrictions.premiumAnalyzers.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Premium Analyzers</div>
                </div>
              </div>
              {planInfo.planName === "Free" && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    🚀 Upgrade to unlock unlimited projects, premium analyzers, and advanced
                    features!
                  </p>
                  <Link href="/billing" className="mt-2 inline-block">
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                      View Plans
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Design Persona Section */}
        <Card className="bg-[#0F1619] outline outline-1 outline-[#4AB395]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-krona-one">Design Persona</CardTitle>
              <Link href="/persona">
                <Button variant="outline" size="sm">
                  {persona ? "Update Persona" : "Create Persona"}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {persona ? (
              <>
                <div>
                  <h3 className="font-bold mb-2 font-quantico">Selected Persona</h3>
                  <Badge variant="default" className="text-xs">
                    {persona.personaCard?.personaCardName || "Custom Persona"}
                  </Badge>
                </div>

                {persona.personaVibes && persona.personaVibes.length > 0 && (
                  <div>
                    <h3 className="font-bold mb-4 font-quantico">Design Preferences</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label>Color Boldness</Label>
                        <Badge className="w-fit">
                          {mapColorBoldnessToName[
                            String(
                              persona.personaVibes[0].colorBoldness
                            ) as keyof typeof mapColorBoldnessToName
                          ] || "Custom"}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Typeface Temperament</Label>
                        <Badge className="w-fit">
                          {maptypeTemperamentToName[
                            persona.personaVibes[0].typeTemperament.toString() as keyof typeof maptypeTemperamentToName
                          ] || "Custom"}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Spacing Airiness</Label>
                        <Badge className="w-fit">
                          {mapSpacingAirinessToName[
                            String(
                              persona.personaVibes[0].spacingAiriness
                            ) as keyof typeof mapSpacingAirinessToName
                          ] || "Custom"}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Motion Drama</Label>
                        <Badge className="w-fit">
                          {mapMotionDramaToName[
                            String(
                              persona.personaVibes[0].motionDrama
                            ) as keyof typeof mapMotionDramaToName
                          ] || "Custom"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {persona.personaKeywords && persona.personaKeywords.length > 0 && (
                  <div>
                    <h3 className="font-bold mb-2 font-quantico">Style Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {persona.personaKeywords.map((keyword: any) => (
                        <Badge key={keyword.id} variant="default">
                          {keyword.keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {persona.personaMoodboards && persona.personaMoodboards.length > 0 && (
                  <div>
                    <h3 className="font-bold mb-2 font-quantico">Moodboard</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {persona.personaMoodboards.map((moodboard: any) => (
                        <div key={moodboard.id} className="relative">
                          <img
                            src={moodboard.snapshotUrl || "/placeholder.svg"}
                            alt="Moodboard image"
                            className="w-full h-20 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Persona created on {new Date(persona.createdAt).toLocaleDateString()}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No design persona set up yet</p>
                <Link href="/persona">
                  <Button>Set Up Your Persona</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-quantico">Recent Projects</h3>
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
