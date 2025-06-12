"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, LinkIcon, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { uploadToSupabase } from "@/lib/supabase-storage"

interface Project {
  id: string
  name: string
}

export default function UploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedProjectId = searchParams.get("projectId")

  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>(preselectedProjectId || "")
  const [newProjectName, setNewProjectName] = useState("")
  const [figmaUrl, setFigmaUrl] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects?userId=temp-user-id") // TODO: Replace with actual user ID
      if (response.ok) {
        const { projects } = await response.json()
        setProjects(projects)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const createProject = async (name: string) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          userId: "temp-user-id", // TODO: Replace with actual user ID
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const { project } = await response.json()
      return project.id
    } catch (error) {
      console.error("Error creating project:", error)
      throw error
    }
  }

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
      })

      if (!response.ok) {
        throw new Error("Failed to create screen")
      }

      const { screen } = await response.json()
      return screen
    } catch (error) {
      console.error("Error creating screen:", error)
      throw error
    }
  }

  const handleSubmit = async () => {
    if (!uploadedFile && !figmaUrl) {
      alert("Please upload a file or provide a Figma URL")
      return
    }

    if (!selectedProjectId && !newProjectName) {
      alert("Please select a project or create a new one")
      return
    }

    setIsUploading(true)

    try {
      // Determine project ID
      let projectId = selectedProjectId
      if (!projectId && newProjectName) {
        projectId = await createProject(newProjectName)
      }

      // Handle file upload or Figma URL
      let sourceUrl = ""
      let sourceType = ""

      if (uploadedFile) {
        // Upload file to Supabase
        const uploadedUrl = await uploadToSupabase(uploadedFile, "screens")
        sourceUrl = uploadedUrl
        sourceType = "upload"
      } else if (figmaUrl) {
        sourceUrl = figmaUrl
        sourceType = "figma"
      }

      // Create screen
      const screen = await createScreen(projectId, sourceUrl, sourceType)

      // Redirect to project page
      router.push(`/projects/${projectId}`)
    } catch (error) {
      console.error("Error uploading:", error)
      alert("Failed to upload. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Upload Design</h1>
          <p className="text-muted-foreground mt-2">
            Upload your design files or connect from Figma to get AI-powered feedback
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
            </div>

            <div className="text-center text-sm text-muted-foreground">or</div>

            <div className="space-y-2">
              <Label htmlFor="newProject">Create New Project</Label>
              <Input
                id="newProject"
                placeholder="Enter new project name"
                value={newProjectName}
                onChange={(e) => {
                  setNewProjectName(e.target.value)
                  if (e.target.value) {
                    setSelectedProjectId("")
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">File Upload</TabsTrigger>
                <TabsTrigger value="figma">Figma URL</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
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

              <TabsContent value="figma" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="figma-url">Figma File URL</Label>
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
                    Make sure your Figma file is publicly accessible or shared with view permissions
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit}
          className="w-full gap-2"
          size="lg"
          disabled={isUploading || (!uploadedFile && !figmaUrl) || (!selectedProjectId && !newProjectName)}
        >
          {isUploading ? "Uploading..." : "Continue to Analysis"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </DashboardLayout>
  )
}
