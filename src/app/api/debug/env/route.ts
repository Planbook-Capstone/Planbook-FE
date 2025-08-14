import { NextResponse } from 'next/server';

export async function GET() {
  // Chỉ cho phép debug trong development hoặc khi có flag đặc biệt
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_ENV_DEBUG) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_SECONDARY_URL: process.env.NEXT_PUBLIC_API_SECONDARY_URL,
    NEXT_PUBLIC_WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
    NEXT_PUBLIC_REDIRECT_URL: process.env.NEXT_PUBLIC_REDIRECT_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    // Không hiển thị sensitive keys, chỉ hiển thị có hay không
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
    NEXT_DATABASE_URL: process.env.NEXT_DATABASE_URL ? 'SET' : 'NOT_SET',
  };

  return NextResponse.json(envVars);
}
