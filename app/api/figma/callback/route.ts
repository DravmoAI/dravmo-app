import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  try {
    const formData = new URLSearchParams({
      client_id: process.env.FIGMA_CLIENT_ID!,
      client_secret: process.env.FIGMA_CLIENT_SECRET!,
      redirect_uri: process.env.REDIRECT_URI!,
      code: code as string,
      grant_type: 'authorization_code',
    });

    const tokenRes = await fetch('https://api.figma.com/v1/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    }); 

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    
    const response = NextResponse.redirect(new URL('/upload', request.url));
    response.cookies.set('figma_token', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 3600,
    });
    
    return response;
  } catch (err) {
    console.error('OAuth error:', err);
    return NextResponse.redirect(new URL('/upload?error=auth_failed', request.url));
  }
}