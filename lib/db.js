// Kullanıcı deposu: Upstash Redis varsa onu, yoksa (yalnızca geliştirmede) yerel JSON dosyasını kullanır.
import fs from 'node:fs';
import path from 'node:path';
import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

// Aynı Redis başka sitelerle paylaşılabilsin diye anahtarlar "kedi:" ile başlar.
const ANAHTAR = 'kedi:kullanicilar';
const DOSYA = path.join(process.cwd(), 'data', 'db.json');

export const depoHazir = () => Boolean(redis) || process.env.NODE_ENV !== 'production';

function dosyaOku() {
  if (process.env.NODE_ENV === 'production') throw new Error('Kullanıcı deposu bağlı değil (Upstash Redis).');
  try {
    return JSON.parse(fs.readFileSync(DOSYA, 'utf8'));
  } catch {
    return { kullanicilar: {} };
  }
}
function dosyaYaz(db) {
  fs.mkdirSync(path.dirname(DOSYA), { recursive: true });
  fs.writeFileSync(DOSYA, JSON.stringify(db, null, 2));
}

/** Kayıt: { kullaniciAdi, ad, ozet, ts } */
export async function kullanicilariGetir() {
  const hepsi = redis ? Object.values((await redis.hgetall(ANAHTAR)) ?? {}) : Object.values(dosyaOku().kullanicilar);
  return hepsi.sort((a, b) => a.ts - b.ts);
}

export async function kullaniciGetir(kullaniciAdi) {
  if (!kullaniciAdi) return null;
  if (redis) return (await redis.hget(ANAHTAR, kullaniciAdi)) ?? null;
  return dosyaOku().kullanicilar[kullaniciAdi] ?? null;
}

export async function kullaniciKaydet(k) {
  if (redis) return void (await redis.hset(ANAHTAR, { [k.kullaniciAdi]: k }));
  const db = dosyaOku();
  db.kullanicilar[k.kullaniciAdi] = k;
  dosyaYaz(db);
}

export async function kullaniciSil(kullaniciAdi) {
  if (redis) return void (await redis.hdel(ANAHTAR, kullaniciAdi));
  const db = dosyaOku();
  delete db.kullanicilar[kullaniciAdi];
  dosyaYaz(db);
}
