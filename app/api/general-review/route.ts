import { type NextRequest, NextResponse } from "next/server";

interface ReviewCriteria {
  [topic: string]: {
    [subtopic: string]: string[];
  };
}

interface ReviewMetadata {
  industry: string;
  product_type: string;
  personality: string;
  audience_type: string;
  age_group: string;
  platform: string;
}

interface ImageDetails {
  mime_type: string;
  img_str: string;
}

interface ReviewPayload {
  metadata: ReviewMetadata;
  criterias: ReviewCriteria;
  img_details: ImageDetails;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metadata, criterias, imageData } = body;

    if (!metadata || !criterias || !imageData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prepare the payload for FastAPI backend
    const reviewPayload: ReviewPayload = {
      metadata: {
        industry: metadata.industry,
        product_type: metadata.productType,
        personality: metadata.brandPersonality,
        audience_type: "B2C", // Default for now, can be made configurable
        age_group: metadata.ageGroup,
        platform: metadata.platform,
      },
      criterias,
      img_details: {
        mime_type: imageData.mime_type,
        img_str: imageData.img_str,
      },
    };

    // Send to FastAPI backend
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_AI_ENGINE_URL}/general_review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewPayload),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("FastAPI backend error:", errorText);
      return NextResponse.json(
        { error: "Failed to generate review with AI backend" },
        { status: 500 }
      );
    }

    const result = await backendResponse.json();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error generating review:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
