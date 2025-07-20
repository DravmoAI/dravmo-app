import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

interface ExpertDetails {
  name: string
  philosophy: string
  methodology: string[]
  signature_gestures: string[]
  talks: Array<{
    title: string
    content: string
  }>
  blogs: Array<{
    title: string
    content: string
  }>
}

interface ExpertMetadata {
  industry: string
  product_type: string
  personality: string
  audience_type: string
  age_group: string
  platform: string
}

interface ImageDetails {
  mime_type: string
  img_str: string
}

interface ExpertPayload {
  thread_id: string
  metadata: ExpertMetadata
  expert_details: ExpertDetails
  img_details: ImageDetails
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metadata, expertDetails, imageData } = body

    if (!metadata || !expertDetails || !imageData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate a random thread ID
    const threadId = uuidv4()

    // Prepare the payload for FastAPI backend
    const expertPayload: ExpertPayload = {
      thread_id: threadId,
      metadata: {
        industry: metadata.industry,
        product_type: metadata.productType,
        personality: metadata.brandPersonality,
        audience_type: "B2C", // Default for now, can be made configurable
        age_group: metadata.ageGroup,
        platform: metadata.platform,
      },
      expert_details: {
        name: expertDetails.name,
        philosophy: expertDetails.philosophy || "",
        methodology: expertDetails.methodology || [],
        signature_gestures: expertDetails.signatureGestures || [],
        talks: expertDetails.talks || [],
        blogs: expertDetails.blogs || [],
      },
      img_details: {
        mime_type: imageData.mime_type,
        img_str: imageData.img_str,
      },
    }

    // Send to FastAPI backend
    const backendResponse = await fetch("http://localhost:8000/expert_advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expertPayload),
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error("FastAPI backend error:", errorText)
      return NextResponse.json({ error: "Failed to generate expert advice with AI backend" }, { status: 500 })
    }

    const result = await backendResponse.json()

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error generating expert advice:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
