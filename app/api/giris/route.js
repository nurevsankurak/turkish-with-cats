import { NextResponse } from 'next/server';
import { kullaniciGetir } from '@/lib/db';
import { CEREZ, CEREZ_AYAR, adSade, ogrenciJetonu, sifreDogru, yoneticiAdi, yoneticiJetonu, yoneticiSifresiDogru } from '@/lib/kapi';

function guvenliYol(yol) {
  return typeof yol === 'string' && yol.startsWith('/') && !yol.startsWith('//') ? yol : '/';
}

export async function POST(request) {
  const form = await request.formData();
  const sonra = guvenliYol(form.get('sonra'));
  const kullaniciAdi = adSade(form.get('kullaniciAdi'));
  const sifre = form.get('sifre');

  const git = (yol, jeton) => {
    const yanit = NextResponse.redirect(new URL(yol, request.url), 303);
    if (jeton) yanit.cookies.set(CEREZ, jeton, CEREZ_AYAR);
    return yanit;
  };

  if (kullaniciAdi === yoneticiAdi()) {
    if (yoneticiSifresiDogru(sifre)) return git(sonra === '/' ? '/yonetici' : sonra, yoneticiJetonu());
  } else {
    const k = await kullaniciGetir(kullaniciAdi).catch(() => null);
    if (k && sifreDogru(sifre, k.ozet)) return git(sonra.startsWith('/yonetici') ? '/' : sonra, ogrenciJetonu(k));
  }

  const geri = new URL('/giris', request.url);
  geri.searchParams.set('hata', '1');
  if (sonra !== '/') geri.searchParams.set('sonra', sonra);
  return NextResponse.redirect(geri, 303);
}
