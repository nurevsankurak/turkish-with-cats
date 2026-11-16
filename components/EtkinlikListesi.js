'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ilerlemeOku } from '@/lib/ilerleme';
import { OYUNLAR } from '@/lib/oyunlar';

export default function EtkinlikListesi({ haftaNo }) {
  const [biten, setBiten] = useState({});
  useEffect(() => setBiten(ilerlemeOku()[haftaNo] ?? {}), [haftaNo]);
  const sayi = OYUNLAR.filter((o) => biten[o.id]).length;

  return (
    <>
      <p className="ilerleme">
        <span className="ilerleme-cubuk">
          <span style={{ width: `${(sayi / OYUNLAR.length) * 100}%` }} />
        </span>
        {sayi} / {OYUNLAR.length} tamamlandı · completed
      </p>
      <div className="etkinlikler">
        {OYUNLAR.map((o) => (
          <Link key={o.id} href={`/hafta/${haftaNo}/${o.id}`} className={`etkinlik${biten[o.id] ? ' bitti' : ''}`}>
            <span className="etkinlik-simge">{o.simge}</span>
            <strong>{o.ad}</strong>
            <span className="etkinlik-en">{o.en}</span>
            <span className="etkinlik-aciklama">{o.aciklama}</span>
            {biten[o.id] && <span className="damga" title="Completed">🐾</span>}
          </Link>
        ))}
      </div>
    </>
  );
}
