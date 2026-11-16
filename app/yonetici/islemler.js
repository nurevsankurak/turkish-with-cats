'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { kullaniciGetir, kullaniciKaydet, kullaniciSil } from '@/lib/db';
import { CEREZ, adGecerli, adSade, oturumBul, sifreOzetle, yoneticiAdi } from '@/lib/kapi';

async function yoneticiOl() {
  const oturum = await oturumBul((await cookies()).get(CEREZ)?.value);
  if (!oturum?.yonetici) redirect('/giris');
}

const don = (tur, metin) => redirect(`/yonetici?${tur}=${encodeURIComponent(metin)}`);

export async function kullaniciEkle(form) {
  await yoneticiOl();
  const kullaniciAdi = adSade(form.get('kullaniciAdi'));
  const ad = String(form.get('ad') ?? '').trim().slice(0, 40);
  const sifre = String(form.get('sifre') ?? '');

  if (!adGecerli(kullaniciAdi)) don('hata', 'Kullanıcı adı 2–30 karakter olmalı; yalnızca küçük harf (a–z), rakam, nokta, tire.');
  if (kullaniciAdi === yoneticiAdi()) don('hata', 'Bu kullanıcı adı öğretmen hesabına ayrılmış.');
  if (sifre.length < 6) don('hata', 'Şifre en az 6 karakter olmalı.');
  if (await kullaniciGetir(kullaniciAdi)) don('hata', `"${kullaniciAdi}" adlı kullanıcı zaten var.`);

  await kullaniciKaydet({ kullaniciAdi, ad, ozet: sifreOzetle(sifre), ts: Date.now() });
  don('tamam', `${kullaniciAdi} eklendi.`);
}

export async function sifreDegistir(form) {
  await yoneticiOl();
  const k = await kullaniciGetir(adSade(form.get('kullaniciAdi')));
  const sifre = String(form.get('sifre') ?? '');
  if (!k) don('hata', 'Kullanıcı bulunamadı.');
  if (sifre.length < 6) don('hata', 'Şifre en az 6 karakter olmalı.');
  await kullaniciKaydet({ ...k, ozet: sifreOzetle(sifre) });
  don('tamam', `${k.kullaniciAdi} için şifre değişti. Eski oturumları kapandı.`);
}

export async function kullaniciKaldir(form) {
  await yoneticiOl();
  const kullaniciAdi = adSade(form.get('kullaniciAdi'));
  await kullaniciSil(kullaniciAdi);
  don('tamam', `${kullaniciAdi} silindi.`);
}
