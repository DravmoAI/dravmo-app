"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Eye, Trash2, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateProjectModal } from "@/components/create-project-modal"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Project {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  screenCount: number
  lastFeedback: string
  status: "active" | "archived"
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects?userId=temp-user-id") // TODO: Replace with actual user ID
      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }
      const { projects } = await response.json()
      setProjects(projects)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      setProjects(projects.filter((p) => p.id !== projectId))
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const handleProjectCreated = (newProject: any) => {
    const transformedProject: Project = {
      id: newProject.id,
      name: newProject.name,
      createdAt: newProject.createdAt,
      updatedAt: newProject.updatedAt,
      screenCount: 0,
      lastFeedback: newProject.updatedAt,
      status: "active",
    }
    setProjects([transformedProject, ...projects])
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading projects...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Projects</h2>
            <p className="text-muted-foreground">Manage your design projects and feedback history</p>
          </div>
          <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Created:</span> {formatDate(project.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Updated:</span> {formatDate(project.updatedAt)}
                      </div>
                      <div>
                        <span className="font-medium">Screens:</span> {project.screenCount}
                      </div>
                      <div>
                        <span className="font-medium">Last Feedback:</span> {formatDate(project.lastFeedback)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/projects/${project.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}/edit`} className="flex items-center cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Project
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}`} className="flex items-center cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            View Screens
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No projects yet</div>
            <Button onClick={() => setIsCreateModalOpen(true)}>Create Your First Project</Button>
          </div>
        )}

        <CreateProjectModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    </DashboardLayout>
  )
}
