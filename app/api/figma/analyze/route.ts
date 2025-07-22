import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { figmaUrl } = await request.json();
  const token = request.cookies.get('figma_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const match = figmaUrl.match(/(?:file|design)\/([a-zA-Z0-9]+)\/[^?]+[?&]node-id=([^&]+)/);
  if (!match) {
    return NextResponse.json({ error: 'Invalid Figma URL' }, { status: 400 });
  }

  const fileKey = match[1];
  const nodeIdRaw = decodeURIComponent(match[2]);
  const nodeId = nodeIdRaw.replace(/-/g, ':');

  try {
    const nodeRes = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const nodeData = await nodeRes.json();
    const node = nodeData.nodes[nodeId];
    
    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: node.document });
  } catch (err) {
    console.error('Figma API error:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}