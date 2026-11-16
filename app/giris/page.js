import Kedi from '@/components/Kedi';
import { kullanicilar } from '@/lib/kapi';

export const metadata = { title: 'Giriş' };

export default async function GirisSayfasi({ searchParams }) {
  const { hata, sonra } = await searchParams;
  return (
    <main className="giris">
      <form method="post" action="/api/giris" className="giris-kutu">
        <Kedi boyut={120} />
        <h1>Kedi ile Türkçe</h1>
        <p>Miyav! This classroom is private. Please enter your personal class code.</p>
        {typeof sonra === 'string' && <input type="hidden" name="sonra" value={sonra} />}
        <label htmlFor="kod">Giriş kodu · Your code</label>
        <input id="kod" name="kod" type="text" required autoFocus autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
        {hata && (
          <p className="giris-hata" role="alert">
            {kullanicilar().length ? 'That code is not right — tekrar deneyin!' : 'No class codes are set for this site yet (SITE_KULLANICILAR).'}
          </p>
        )}
        <button type="submit" className="dugme">Giriş · Enter</button>
      </form>
    </main>
  );
}
