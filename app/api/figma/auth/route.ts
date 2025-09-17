import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authUrl = `https://www.figma.com/oauth?client_id=${process.env.FIGMA_CLIENT_ID}&redirect_uri=${process.env.FIGMA_REDIRECT_URI}&scope=file_read&state=figma_auth&response_type=code`;

  return NextResponse.redirect(authUrl);
}
