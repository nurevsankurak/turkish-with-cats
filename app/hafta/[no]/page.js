import Link from 'next/link';
import { notFound } from 'next/navigation';
import EtkinlikListesi from '@/components/EtkinlikListesi';
import Kedi from '@/components/Kedi';
import { haftaBul } from '@/content';

export async function generateMetadata({ params }) {
  const { no } = await params;
  return { title: `Hafta ${no}` };
}

export default async function HaftaSayfasi({ params }) {
  const { no } = await params;
  const hafta = haftaBul(no);
  if (!hafta) notFound();

  return (
    <main className="sayfa">
      <Link href="/" className="geri">← Haftalar · All weeks</Link>
      <header className="hafta-ust">
        <Kedi boyut={84} />
        <div>
          <p className="ust-yazi">Hafta {hafta.no} · Week {hafta.no}</p>
          <h1>{hafta.baslik}</h1>
          <p>{hafta.altBaslik}</p>
        </div>
      </header>
      <EtkinlikListesi haftaNo={hafta.no} />
    </main>
  );
}
