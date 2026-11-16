import { NextResponse } from 'next/server';
import { CEREZ, anahtar, sifreTanimli } from '@/lib/kapi';

function guvenliYol(yol) {
  return typeof yol === 'string' && yol.startsWith('/') && !yol.startsWith('//') ? yol : '/';
}

export async function POST(request) {
  const form = await request.formData();
  const sonra = guvenliYol(form.get('sonra'));

  if (!sifreTanimli() || form.get('sifre') !== process.env.SITE_SIFRE) {
    const geri = new URL('/giris', request.url);
    geri.searchParams.set('hata', '1');
    if (sonra !== '/') geri.searchParams.set('sonra', sonra);
    return NextResponse.redirect(geri, 303);
  }

  const yanit = NextResponse.redirect(new URL(sonra, request.url), 303);
  yanit.cookies.set(CEREZ, await anahtar(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 120,
    path: '/',
  });
  return yanit;
}
