import Link from 'next/link';
import { notFound } from 'next/navigation';
import Oyun from '@/components/Oyun';
import { haftaBul } from '@/content';
import { oyunBul } from '@/lib/oyunlar';

export async function generateMetadata({ params }) {
  const { oyun } = await params;
  return { title: oyunBul(oyun)?.ad };
}

export default async function OyunSayfasi({ params }) {
  const { no, oyun } = await params;
  const hafta = haftaBul(no);
  const bilgi = oyunBul(oyun);
  if (!hafta || !bilgi) notFound();

  return (
    <main className="sayfa sayfa-oyun">
      <Link href={`/hafta/${hafta.no}`} className="geri">← Hafta {hafta.no}</Link>
      <header className="oyun-ust">
        <span className="etkinlik-simge">{bilgi.simge}</span>
        <h1>
          {bilgi.ad} <small>{bilgi.en}</small>
        </h1>
      </header>
      <Oyun hafta={hafta} oyun={oyun} />
    </main>
  );
}
