import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // Mock data for recent projects
  const recentProjects = [
    {
      id: "1",
      name: "Praktika Landing Page",
      date: "Today",
      thumbnail: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "2",
      name: "Wrek Burkley Sign Up",
      date: "Yesterday",
      thumbnail: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "3",
      name: "Mobile App Redesign",
      date: "3 days ago",
      thumbnail: "/placeholder.svg?height=100&width=200",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Welcome back!</h2>
          <Link href="/upload">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Upload
            </Button>
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Recent Projects</h3>
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="aspect-video w-full bg-muted">
                    <img
                      src={project.thumbnail || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground">{project.date}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
