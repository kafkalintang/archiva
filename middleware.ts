import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Sementara dibiarkan kosong, akan diisi di Tahap 3C
  return NextResponse.next();
}

// Tentukan route mana yang akan dilewati middleware ini
export const config = {
  matcher: ['/app/:path*'],
};