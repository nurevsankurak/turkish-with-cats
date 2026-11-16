# Kedi ile Türkçe

Haftalık Türkçe dersleri için alıştırma sitesi (kedi temalı). Her hafta aynı sekiz etkinlik, o haftanın içeriğiyle çalışır:
kartlar, test, boşluk doldurma, sürükle-bırak, cümle kurma, kelime avı, bulmaca, hafıza oyunu.

## Çalıştırma

```bash
npm install
npm run dev
```

## Şifre

Site tek bir ortak şifreyle açılır: `SITE_SIFRE` ortam değişkeni (yerelde `.env.local`, Vercel'de
Project → Settings → Environment Variables). Değişken tanımlı değilse kimse giremez.

## Yeni hafta eklemek

1. `content/hafta1.js` dosyasını `content/hafta2.js` olarak kopyalayın, içeriği o haftanın dersine göre değiştirin.
2. `content/index.js` içinde içe aktarıp `haftalar` listesine ekleyin.

Etkinlikler içerikten kendiliğinden oluşur: `kelimeler` (kartlar, test, eşleştirme, kelime avı, hafıza),
`sorular` (test), `bosluklar`, `cumleler`, `bulmaca`.

## Dinleme

Sesler tarayıcının Türkçe sesiyle okunur (ses dosyası gerekmez). Cihazda Türkçe ses yoksa dinleme düğmeleri gizlenir.
