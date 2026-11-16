import { NextResponse } from 'next/server';
import { CEREZ, oturumBul } from '@/lib/kapi';

// Giriş yapmamış ziyaretçiyi /giris sayfasına yollar; /yonetici yalnızca öğretmene açıktır.
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const serbest = pathname === '/giris' || pathname === '/api/giris';
  const oturum = serbest ? null : await oturumBul(request.cookies.get(CEREZ)?.value).catch(() => null);
  const yoneticiYolu = pathname.startsWith('/yonetici');

  let yanit;
  if (serbest || (oturum && (!yoneticiYolu || oturum.yonetici))) {
    yanit = NextResponse.next();
  } else if (oturum) {
    yanit = NextResponse.redirect(new URL('/', request.url));
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
