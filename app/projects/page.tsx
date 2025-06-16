import { LoadingSpinner } from "@/components/loading-spinner"

export default function ProjectsPage() {
  return (
    <div className="container relative pb-20">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors first:mt-0">Projects</h1>
        <p className="max-w-[85%] sm:text-lg text-sm text-muted-foreground">
          Here are some of the projects I've worked on.
        </p>
      </div>

      <LoadingSpinner className="min-h-[400px]" />
    </div>
  )
}
