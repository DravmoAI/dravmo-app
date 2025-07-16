import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageUrl = formData.get("imageUrl") as string

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 400 })
    }

    // Get the image blob
    const imageBlob = await imageResponse.blob()

    // Create FormData for the FastAPI backend
    const backendFormData = new FormData()
    backendFormData.append("img_file", imageBlob, "image.jpg")

    // Send to FastAPI backend
    const backendResponse = await fetch("http://localhost:8000/get_image_url", {
      method: "POST",
      body: backendFormData,
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error("FastAPI backend error:", errorText)
      return NextResponse.json({ error: "Failed to process image with AI backend" }, { status: 500 })
    }

    const result = await backendResponse.json()

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
