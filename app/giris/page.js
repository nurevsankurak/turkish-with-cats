import Kedi from '@/components/Kedi';

export const metadata = { title: 'Giriş' };

export default async function GirisSayfasi({ searchParams }) {
  const { hata, sonra } = await searchParams;
  return (
    <main className="giris">
      <form method="post" action="/api/giris" className="giris-kutu">
        <Kedi boyut={120} />
        <h1>Kedi ile Türkçe</h1>
        <p>Miyav! This classroom is private. Please log in with the username and password from your teacher.</p>
        {typeof sonra === 'string' && <input type="hidden" name="sonra" value={sonra} />}
        <label htmlFor="kullaniciAdi">Kullanıcı adı · Username</label>
        <input id="kullaniciAdi" name="kullaniciAdi" type="text" required autoFocus autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
        <label htmlFor="sifre">Şifre · Password</label>
        <input id="sifre" name="sifre" type="password" required autoComplete="current-password" />
        {hata && (
          <p className="giris-hata" role="alert">
            Wrong username or password — tekrar deneyin!
          </p>
        )}
        <button type="submit" className="dugme">Giriş · Log in</button>
      </form>
    </main>
  );
}
