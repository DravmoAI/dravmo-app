"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileUp, Upload } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      handleFile(droppedFile)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      handleFile(selectedFile)
    }
  }

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG)")
      return
    }

    setFile(file)
    // In a real app, you would upload the file to your server here
    // For now, we'll just simulate a successful upload and redirect
    setTimeout(() => {
      router.push("/analyze")
    }, 1000)
  }

  const handleFigmaImport = () => {
    // In a real app, this would trigger the Figma OAuth flow
    alert("Figma import would be triggered here")
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Upload Your Design</h2>
        <p className="text-muted-foreground mb-8">
          Upload a JPG or PNG file, or import directly from Figma to get started with your design analysis.
        </p>

        <Card
          className={`border-2 border-dashed ${isDragging ? "border-primary" : "border-border"} rounded-lg`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">Drag and drop your file here</h3>
            <p className="text-muted-foreground mb-6">Supports JPG and PNG files up to 10MB</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => document.getElementById("file-upload")?.click()} className="gap-2">
                <Upload className="h-4 w-4" /> Browse Files
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFileInput}
              />
              <Button variant="outline" onClick={handleFigmaImport}>
                Import from Figma
              </Button>
            </div>
          </CardContent>
        </Card>

        {file && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">Uploading: {file.name}</p>
            <div className="w-full bg-secondary h-2 rounded-full mt-2">
              <div className="bg-primary h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
