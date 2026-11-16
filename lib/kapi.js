// Giriş kapısı: öğrenciler kullanıcı adı + şifreyle girer; hesapları öğretmen /yonetici ekranından açar.
// Öğretmen hesabı ortam değişkenlerindedir: YONETICI_ADI (varsayılan "ogretmen") ve YONETICI_SIFRE.
import crypto from 'node:crypto';
import { kullaniciGetir } from './db';

export const CEREZ = 'kedi_oturum';
export const CEREZ_AYAR = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 120,
  path: '/',
};

export const adSade = (s) => String(s ?? '').trim().toLowerCase();
export const adGecerli = (s) => /^[a-z0-9._-]{2,30}$/.test(s);
export const yoneticiAdi = () => adSade(process.env.YONETICI_ADI) || 'ogretmen';

const esit = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export function yoneticiSifresiDogru(sifre) {
  const beklenen = process.env.YONETICI_SIFRE;
  return Boolean(beklenen) && esit(sifre ?? '', beklenen);
}

/** Şifreler düz metin saklanmaz: "tuz:özet" (scrypt). */
export function sifreOzetle(sifre) {
  const tuz = crypto.randomBytes(16).toString('hex');
  return `${tuz}:${crypto.scryptSync(String(sifre), tuz, 32).toString('hex')}`;
}
export function sifreDogru(sifre, ozet) {
  const [tuz, beklenen] = String(ozet ?? '').split(':');
  if (!tuz || !beklenen) return false;
  return esit(crypto.scryptSync(String(sifre ?? ''), tuz, 32).toString('hex'), beklenen);
}

function gizli() {
  const s = process.env.OTURUM_GIZLI;
  if (!s && process.env.NODE_ENV === 'production') throw new Error('OTURUM_GIZLI tanımlı değil');
  return s || 'gelistirme-gizli';
}
const imza = (v) => crypto.createHmac('sha256', gizli()).update(v).digest('hex');
const parmakIzi = (ozet) => String(ozet).slice(-12);

export function jetonYap(veri) {
  const yuk = Buffer.from(JSON.stringify(veri)).toString('base64url');
  return `${yuk}.${imza(yuk)}`;
}
export const ogrenciJetonu = (k) => jetonYap({ u: k.kullaniciAdi, k: parmakIzi(k.ozet) });
export const yoneticiJetonu = () => jetonYap({ y: 1 });

/** Çerezden oturumu çözer. Silinen ya da şifresi değişen hesabın oturumu geçersiz olur. */
export async function oturumBul(jeton) {
  if (!jeton) return null;
  const [yuk, im] = jeton.split('.');
  if (!yuk || !im || !esit(im, imza(yuk))) return null;
  let veri;
  try {
    veri = JSON.parse(Buffer.from(yuk, 'base64url').toString());
  } catch {
    return null;
  }
  if (veri.y) return { yonetici: true, ad: 'Öğretmen' };
  const k = await kullaniciGetir(veri.u);
  if (!k || parmakIzi(k.ozet) !== veri.k) return null;
  return { yonetici: false, kullaniciAdi: k.kullaniciAdi, ad: k.ad || k.kullaniciAdi };
}
