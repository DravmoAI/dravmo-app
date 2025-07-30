"use client";

import type React from "react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, LinkIcon, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { uploadFile, STORAGE_BUCKETS } from "@/lib/supabase-storage";
import { getSupabaseClient } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

interface Project {
  id: string;
  name: string;
}

export default function UploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProjectId = searchParams.get("projectId");

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(preselectedProjectId || "");
  const [newProjectName, setNewProjectName] = useState("");
  const [figmaUrl, setFigmaUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFigmaAuthenticated, setIsFigmaAuthenticated] = useState(false);
  const [isFigmaAuthLoading, setIsFigmaAuthLoading] = useState(false);
  const supabase = getSupabaseClient();

  // Get the authenticated user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        router.push("/login");
      }
    };
    getUser();
  }, [router, supabase]);

  // Fetch projects when userId is available
  useEffect(() => {
    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  // Check Figma authentication status
  useEffect(() => {
    const checkFigmaAuth = async () => {
      try {
        const response = await fetch('/api/figma/check-auth');
        if (response.ok) {
          const data = await response.json();
          setIsFigmaAuthenticated(data.authenticated);
        }
      } catch (error) {
        console.error('Error checking Figma auth:', error);
        setIsFigmaAuthenticated(false);
      }
    };

    checkFigmaAuth();
  }, []);

  const fetchProjects = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects?userId=${userId}`);
      if (response.ok) {
        const { projects } = await response.json();
        setProjects(projects || []);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const createProject = async (name: string) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const { project } = await response.json();
      return project.id;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  };

  const createScreen = async (projectId: string, sourceUrl: string, sourceType: string) => {
    try {
      const response = await fetch("/api/screens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          sourceUrl,
          sourceType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create screen");
      }

      const { screen } = await response.json();
      return screen;
    } catch (error) {
      console.error("Error creating screen:", error);
      throw error;
    }
  };

  const handleFigmaLogin = async () => {
    setIsFigmaAuthLoading(true);
    try {
      window.location.href = '/api/figma/auth';
    } catch (error) {
      console.error('Error during Figma login:', error);
      setIsFigmaAuthLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile && !figmaUrl) {
      alert("Please upload a file or provide a Figma URL");
      return;
    }

    if (figmaUrl && !isFigmaAuthenticated) {
      alert("Please connect to Figma first before using Figma URLs");
      return;
    }

    if (!selectedProjectId && !newProjectName) {
      alert("Please select a project or create a new one");
      return;
    }

    if (!userId) {
      alert("You must be logged in to upload screens");
      router.push("/login");
      return;
    }

    setIsUploading(true);

    try {
      if (figmaUrl) {
        const analyzeRes = await fetch('/api/figma/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ figmaUrl }),
        });
        const analyzeData = await analyzeRes.json();
        console.log('Figma analyze response:', analyzeData);
        if (analyzeData && analyzeData.data) {
          console.error('Node data received! Check console for details.');
        } else {
          console.error('No node data found. Check console for details.');
        }
      }
      // Determine project ID
      let projectId = selectedProjectId;
      if (!projectId && newProjectName) {
        projectId = await createProject(newProjectName);
      }

      // Handle file upload or Figma URL
      let sourceUrl = "";
      let sourceType = "";

      if (uploadedFile) {
        // Generate a unique file path
        const fileExt = uploadedFile.name.split(".").pop();
        const filePath = `${userId}/${uuidv4()}.${fileExt}`;

        // Upload file to Supabase storage
        const { url, error } = await uploadFile(STORAGE_BUCKETS.SCREENS, filePath, uploadedFile);

        if (error || !url) {
          throw new Error("Failed to upload file to storage");
        }

        sourceUrl = url;
        sourceType = "upload";
      } else if (figmaUrl) {
        sourceUrl = figmaUrl;
        sourceType = "figma";
      }

      // Create screen
      const screen = await createScreen(projectId, sourceUrl, sourceType);

      // Redirect to project page
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Failed to upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading || !userId) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Upload Design</h1>
          <p className="text-muted-foreground mt-2">
            Connect from Figma or upload your design files to get AI-powered feedback
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project">Select Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an existing project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {projects.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  No projects found. Create a new one below.
                </p>
              )}
            </div>

            {!preselectedProjectId && (
              <>
                <div className="text-center text-sm text-muted-foreground">or</div>

                <div className="space-y-2">
                  <Label htmlFor="newProject">Create New Project</Label>
                  <Input
                    id="newProject"
                    placeholder="Enter new project name"
                    value={newProjectName}
                    onChange={(e) => {
                      setNewProjectName(e.target.value);
                      if (e.target.value) {
                        setSelectedProjectId("");
                      }
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="figma">Figma URL</TabsTrigger>
                <TabsTrigger value="upload">File Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="figma" className="space-y-4">
                <div className="space-y-2">
                  <Label>Connect to Figma</Label>
                  
                  {!isFigmaAuthenticated ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Connect your Figma account to import designs directly from Figma files.
                      </p>
                      <Button 
                        onClick={handleFigmaLogin}
                        disabled={isFigmaAuthLoading}
                        className="w-full"
                      >
                        {isFigmaAuthLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          'Connect to Figma'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="figma-url"
                            placeholder="https://www.figma.com/file/..."
                            value={figmaUrl}
                            onChange={(e) => setFigmaUrl(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Paste your Figma file URL to import the design
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </label>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit}
          className="w-full gap-2"
          size="lg"
          disabled={
            isUploading || 
            (!uploadedFile && !figmaUrl) || 
            (!selectedProjectId && !newProjectName) ||
            (!!figmaUrl && !isFigmaAuthenticated)
          }
        >
          {isUploading ? "Uploading..." : "Continue to Analysis"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </DashboardLayout>
  );
}
