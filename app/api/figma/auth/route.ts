import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    // Try to get the current user session
    const supabase = createServerSupabaseClient(request);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Generate a random state parameter for security
    const state = `figma_auth_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    // If we have a session, include user info in state
    const stateData = session?.user ? {
      userId: session.user.id,
      timestamp: Date.now()
    } : {
      timestamp: Date.now()
    };
    
    const encodedState = Buffer.from(JSON.stringify(stateData)).toString('base64');
    
    const authUrl = `https://www.figma.com/oauth?client_id=${process.env.FIGMA_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=file_read&state=${encodedState}&response_type=code`;

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error initiating Figma auth:", error);
    // Fallback to basic auth without state
    const authUrl = `https://www.figma.com/oauth?client_id=${process.env.FIGMA_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=file_read&state=figma_auth&response_type=code`;
    return NextResponse.redirect(authUrl);
  }
}
