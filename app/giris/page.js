import Kedi from '@/components/Kedi';
import { sifreTanimli } from '@/lib/kapi';

export const metadata = { title: 'Giriş' };

export default async function GirisSayfasi({ searchParams }) {
  const { hata, sonra } = await searchParams;
  return (
    <main className="giris">
      <form method="post" action="/api/giris" className="giris-kutu">
        <Kedi boyut={120} />
        <h1>Kedi ile Türkçe</h1>
        <p>Miyav! This classroom is private. Please enter the class password.</p>
        {typeof sonra === 'string' && <input type="hidden" name="sonra" value={sonra} />}
        <label htmlFor="sifre">Şifre · Password</label>
        <input id="sifre" name="sifre" type="password" required autoFocus autoComplete="current-password" />
        {hata && (
          <p className="giris-hata" role="alert">
            {sifreTanimli() ? 'Wrong password — tekrar deneyin!' : 'No password is set for this site yet (SITE_SIFRE).'}
          </p>
        )}
        <button type="submit" className="dugme">Giriş · Enter</button>
      </form>
    </main>
  );
}
