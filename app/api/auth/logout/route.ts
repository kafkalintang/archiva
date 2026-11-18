// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('archiva_token', '', {
    httpOnly: true,
    path: '/',          // ← harus sama dengan saat set
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,          // langsung kedaluwarsa
  });
  return response;
}