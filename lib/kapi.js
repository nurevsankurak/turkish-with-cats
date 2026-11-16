// Şifre kapısı. Site tek bir ortak şifreyle açılır: SITE_SIFRE ortam değişkeni.
// Değişken tanımlı değilse kimse giremez (yanlışlıkla herkese açık kalmasın diye).
export const CEREZ = 'kedi_giris';

export function sifreTanimli() {
  return Boolean(process.env.SITE_SIFRE);
}

/** Çerezde şifrenin kendisi değil, özeti saklanır. */
export async function anahtar(sifre = process.env.SITE_SIFRE ?? '') {
  const veri = new TextEncoder().encode(`kedi-ile-turkce:${sifre}`);
  const ozet = await crypto.subtle.digest('SHA-256', veri);
  return [...new Uint8Array(ozet)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
