import Link from 'next/link';
import SifreAlani from '@/components/SifreAlani';
import SilDugmesi from '@/components/SilDugmesi';
import { depoHazir, kullanicilariGetir } from '@/lib/db';
import { kullaniciEkle, kullaniciKaldir, sifreDegistir } from './islemler';

export const metadata = { title: 'Yönetici' };
export const dynamic = 'force-dynamic';

export default async function YoneticiSayfasi({ searchParams }) {
  const { hata, tamam } = await searchParams;
  const hazir = depoHazir();
  const kullanicilar = hazir ? await kullanicilariGetir() : [];

  return (
    <main className="sayfa yonetici">
      <Link href="/" className="geri">← Siteye dön</Link>
      <h1>Yönetici ekranı</h1>
      <p className="aciklama">Öğrenci hesaplarını buradan açar, şifrelerini değiştirir ya da silersiniz. Değişiklikler hemen geçerli olur.</p>

      {!hazir && <p className="uyari hata">Kullanıcı deposu bağlı değil. Vercel&apos;de bu projeye Upstash Redis bağlanmalı.</p>}
      {hata && <p className="uyari hata" role="alert">{hata}</p>}
      {tamam && <p className="uyari tamam" role="status">{tamam}</p>}

      <section className="panel">
        <h2>Yeni öğrenci</h2>
        <form action={kullaniciEkle} className="ekle-form">
          <label>
            <span>Ad <small>(sitede görünür)</small></span>
            <input name="ad" type="text" maxLength={40} placeholder="John" autoComplete="off" />
          </label>
          <label>
            Kullanıcı adı
            <input name="kullaniciAdi" type="text" required minLength={2} maxLength={30} placeholder="john" autoComplete="off" autoCapitalize="none" spellCheck={false} />
          </label>
          <label>
            Şifre
            <SifreAlani />
          </label>
          <button type="submit" className="dugme">Ekle</button>
        </form>
        <p className="not">Şifreler kayıt sırasında şifrelenir; sonradan buradan görülemez. Eklerken not alın, unutulursa yenisini verin.</p>
      </section>

      <section className="panel">
        <h2>Öğrenciler ({kullanicilar.length})</h2>
        {kullanicilar.length === 0 && <p className="not">Henüz öğrenci yok.</p>}
        <ul className="kullanici-listesi">
          {kullanicilar.map((k) => (
            <li key={k.kullaniciAdi}>
              <div className="kim">
                <strong>{k.ad || k.kullaniciAdi}</strong>
                <span>
                  @{k.kullaniciAdi} · {new Date(k.ts).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <form action={sifreDegistir} className="satir-form">
                <input type="hidden" name="kullaniciAdi" value={k.kullaniciAdi} />
                <SifreAlani placeholder="Yeni şifre" />
                <button type="submit" className="kucuk-dugme">Şifreyi değiştir</button>
              </form>
              <form action={kullaniciKaldir}>
                <input type="hidden" name="kullaniciAdi" value={k.kullaniciAdi} />
                <SilDugmesi kullaniciAdi={k.kullaniciAdi} />
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
