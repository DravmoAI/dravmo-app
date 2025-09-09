import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { figmaUrl } = await request.json();

  try {
    // Get the user from the session using request headers
    const supabase = getSupabaseClient();
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 });
    }

    const userToken = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(userToken);

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get the Figma token from the database
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { figmaToken: true },
    });

    if (!profile?.figmaToken) {
      return NextResponse.json({ error: "Figma not connected" }, { status: 401 });
    }

    const figmaToken = profile.figmaToken;

    const match = figmaUrl.match(/(?:file|design)\/([a-zA-Z0-9]+)\/[^?]+[?&]node-id=([^&]+)/);
    if (!match) {
      return NextResponse.json({ error: "Invalid Figma URL" }, { status: 400 });
    }

    const fileKey = match[1];
    const nodeIdRaw = decodeURIComponent(match[2]);
    const nodeId = nodeIdRaw.replace(/-/g, ":");

    // First, get the node to verify it exists
    const nodeRes = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`, {
      headers: { Authorization: `Bearer ${figmaToken}` },
    });

    const nodeData = await nodeRes.json();
    const node = nodeData.nodes[nodeId];

    if (!node) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 });
    }

    // Get the image export URL for the node
    const imageRes = await fetch(
      `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&format=png&scale=2`,
      {
        headers: { Authorization: `Bearer ${figmaToken}` },
      }
    );

    const imageData = await imageRes.json();

    if (!imageData.images || !imageData.images[nodeId]) {
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }

    // Fetch the actual image from the URL
    const imageUrl = imageData.images[nodeId];
    const imageBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer());

    // Return the image as a response
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error("Figma API error:", err);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
