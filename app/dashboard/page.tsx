"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/loading-spinner";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [persona, setPersona] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

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
              router.push("/persona");
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
            router.push("/persona");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          router.push("/login"); // Redirect to login if there's an error
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
