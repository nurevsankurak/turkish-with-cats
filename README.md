# Kedi ile Türkçe

Haftalık Türkçe dersleri için alıştırma sitesi (kedi temalı). Her hafta aynı sekiz etkinlik, o haftanın içeriğiyle çalışır:
kartlar, test, boşluk doldurma, sürükle-bırak, cümle kurma, kelime avı, bulmaca, hafıza oyunu.

## Çalıştırma

```bash
npm install
npm run dev
```

## Giriş kodları

Her öğrencinin kişisel bir giriş kodu vardır: `SITE_KULLANICILAR="Ad:kod,Ad:kod"` ortam değişkeni
(yerelde `.env.local`, Vercel'de Project → Settings → Environment Variables). Listeden silinen kişinin
girişi düşer; liste boşsa kimse giremez. Değişiklikten sonra siteyi yeniden yayınlamak gerekir.

## Yeni hafta eklemek

1. `content/hafta1.js` dosyasını `content/hafta2.js` olarak kopyalayın, içeriği o haftanın dersine göre değiştirin.
2. `content/index.js` içinde içe aktarıp `haftalar` listesine ekleyin.

Etkinlikler içerikten kendiliğinden oluşur: `kelimeler` (kartlar, test, eşleştirme, kelime avı, hafıza),
`sorular` (test), `bosluklar`, `cumleler`, `bulmaca`.

## Dinleme

Sesler tarayıcının Türkçe sesiyle okunur (ses dosyası gerekmez). Cihazda Türkçe ses yoksa dinleme düğmeleri gizlenir.
