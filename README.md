# Kedi ile Türkçe

Haftalık Türkçe dersleri için alıştırma sitesi (kedi temalı). Her hafta aynı sekiz etkinlik, o haftanın içeriğiyle çalışır:
kartlar, test, boşluk doldurma, sürükle-bırak, cümle kurma, kelime avı, bulmaca, hafıza oyunu.

## Çalıştırma

```bash
npm install
npm run dev
```

## Giriş ve hesaplar

Öğrenciler kullanıcı adı + şifreyle girer. Hesapları öğretmen `/yonetici` ekranından açar, şifre değiştirir, siler
(değişiklik hemen geçerli olur, yeniden yayın gerekmez). Öğretmen aynı giriş sayfasından `YONETICI_ADI` /
`YONETICI_SIFRE` ile girer. Hesaplar Upstash Redis'te `kedi:kullanicilar` anahtarında durur; Redis ayarı yoksa
yerelde `data/db.json` kullanılır. Gerekli değişkenler `.env.example` dosyasında.

## Yeni hafta eklemek

1. `content/hafta1.js` dosyasını `content/hafta2.js` olarak kopyalayın, içeriği o haftanın dersine göre değiştirin.
2. `content/index.js` içinde içe aktarıp `haftalar` listesine ekleyin.

Etkinlikler içerikten kendiliğinden oluşur: `kelimeler` (kartlar, test, eşleştirme, kelime avı, hafıza),
`sorular` (test), `bosluklar`, `cumleler`, `bulmaca`.

## Dinleme

Sesler tarayıcının Türkçe sesiyle okunur (ses dosyası gerekmez). Cihazda Türkçe ses yoksa dinleme düğmeleri gizlenir.
