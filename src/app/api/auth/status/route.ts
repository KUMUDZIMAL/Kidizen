// app/api/auth/status/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const hasToken = req.headers.get('cookie')?.includes('token=');
  return NextResponse.json({ isAuthenticated: !!hasToken });
}
