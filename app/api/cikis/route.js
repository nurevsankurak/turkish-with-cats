import { NextResponse } from 'next/server';
import { CEREZ } from '@/lib/kapi';

export async function POST(request) {
  const yanit = NextResponse.redirect(new URL('/giris', request.url), 303);
  yanit.cookies.delete(CEREZ);
  return yanit;
}
