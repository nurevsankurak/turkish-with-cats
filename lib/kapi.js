// Giriş kapısı. Her öğrencinin kişisel bir giriş kodu vardır:
//   SITE_KULLANICILAR="Nur:kod-1234,John:kod-5678"
// Listeden silinen kişinin girişi kendiliğinden düşer. Liste boşsa kimse giremez.
export const CEREZ = 'kedi_giris';

const sade = (s) => String(s ?? '').trim().toLowerCase();

export function kullanicilar() {
  return (process.env.SITE_KULLANICILAR ?? '')
    .split(',')
    .map((parca) => {
      const i = parca.indexOf(':');
      return i < 1 ? null : { ad: parca.slice(0, i).trim(), kod: sade(parca.slice(i + 1)) };
    })
    .filter((k) => k && k.ad && k.kod);
}

/** Çerezde kodun kendisi değil, özeti saklanır. */
export async function anahtar(kod) {
  const veri = new TextEncoder().encode(`kedi-ile-turkce:${sade(kod)}`);
  const ozet = await crypto.subtle.digest('SHA-256', veri);
  return [...new Uint8Array(ozet)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function kodlaBul(kod) {
  const aranan = sade(kod);
  return (aranan && kullanicilar().find((k) => k.kod === aranan)) || null;
}

export async function cerezleBul(deger) {
  if (!deger) return null;
  for (const k of kullanicilar()) if ((await anahtar(k.kod)) === deger) return k;
  return null;
}
