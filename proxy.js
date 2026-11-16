import { NextResponse } from 'next/server';
import { CEREZ, cerezleBul } from '@/lib/kapi';

// Giriş yapmamış ziyaretçiyi /giris sayfasına yollar.
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const serbest = pathname === '/giris' || pathname === '/api/giris';
  const girisli = Boolean(await cerezleBul(request.cookies.get(CEREZ)?.value));

  let yanit;
  if (serbest || girisli) {
    yanit = NextResponse.next();
  } else {
    const hedef = new URL('/giris', request.url);
    if (pathname !== '/') hedef.searchParams.set('sonra', pathname);
    yanit = NextResponse.redirect(hedef);
  }
  yanit.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return yanit;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|icon.svg).*)',
};
