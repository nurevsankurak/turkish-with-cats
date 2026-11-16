import Link from 'next/link';
import Kedi from '@/components/Kedi';
import { cookies } from 'next/headers';
import { haftalar } from '@/content';
import { CEREZ, cerezleBul } from '@/lib/kapi';

export default async function AnaSayfa() {
  const kullanici = await cerezleBul((await cookies()).get(CEREZ)?.value);
  return (
    <main className="sayfa">
      <header className="kahraman">
        <Kedi boyut={150} />
        <div>
          <p className="ust-yazi">Merhaba{kullanici ? `, ${kullanici.ad}` : ''}! Ben Portakal. 🍊</p>
          <h1>Kedi ile Türkçe</h1>
          <p>Practice each week&apos;s Turkish lesson with flashcards, puzzles and games.</p>
        </div>
      </header>

      <h2 className="bolum-baslik">Haftalar · Weeks</h2>
      <div className="hafta-listesi">
        {haftalar.map((h) => (
          <Link key={h.no} href={`/hafta/${h.no}`} className="hafta-kart">
            <span className="hafta-no">Hafta {h.no}</span>
            <strong>{h.baslik}</strong>
            <span className="hafta-en">{h.altBaslik}</span>
            <span className="etiketler">
              {h.konular.map((k) => (
                <em key={k}>{k}</em>
              ))}
            </span>
          </Link>
        ))}
        <div className="hafta-kart yakinda">
          <span className="hafta-no">Hafta {haftalar.length + 1}</span>
          <strong>Yakında…</strong>
          <span className="hafta-en">Coming after the next lesson 🐾</span>
        </div>
      </div>
    </main>
  );
}
