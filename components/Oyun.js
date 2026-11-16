'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ilerlemeKaydet } from '@/lib/ilerleme';
import Kedi from './Kedi';
import Kartlar from './oyunlar/Kartlar';
import Test from './oyunlar/Test';
import Bosluk from './oyunlar/Bosluk';
import Esle from './oyunlar/Esle';
import Cumle from './oyunlar/Cumle';
import KelimeAvi from './oyunlar/KelimeAvi';
import Bulmaca from './oyunlar/Bulmaca';
import Hafiza from './oyunlar/Hafiza';

const BILESENLER = {
  kartlar: Kartlar,
  test: Test,
  bosluk: Bosluk,
  esle: Esle,
  cumle: Cumle,
  'kelime-avi': KelimeAvi,
  bulmaca: Bulmaca,
  hafiza: Hafiza,
};

export default function Oyun({ hafta, oyun }) {
  // Oyunlar rastgele karıştırma kullandığı için yalnızca tarayıcıda çizilir.
  const [hazir, setHazir] = useState(false);
  const [tur, setTur] = useState(0);
  const [sonuc, setSonuc] = useState(null);
  useEffect(() => setHazir(true), []);

  const bitti = useCallback(
    (s) => {
      setSonuc(s ?? {});
      ilerlemeKaydet(hafta.no, oyun);
    },
    [hafta.no, oyun],
  );

  const Bilesen = BILESENLER[oyun];
  if (!hazir) return <p className="yukleniyor">🐾 …</p>;

  if (sonuc) {
    const { dogru, toplam } = sonuc;
    const tam = toplam == null || dogru === toplam;
    return (
      <div className="bitis">
        <Kedi boyut={140} mutlu />
        <h2>{tam ? 'Aferin!' : 'Bitti!'}</h2>
        <p className="bitis-en">{tam ? 'Well done!' : 'Finished — keep practicing!'}</p>
        {toplam != null && (
          <p className="puan">
            {dogru} / {toplam} <span>doğru · correct</span>
          </p>
        )}
        <div className="dugmeler">
          <button
            type="button"
            className="dugme"
            onClick={() => {
              setSonuc(null);
              setTur((t) => t + 1);
            }}
          >
            Tekrar oyna · Play again
          </button>
          <Link className="dugme dugme-acik" href={`/hafta/${hafta.no}`}>
            Diğer etkinlikler · More activities
          </Link>
        </div>
      </div>
    );
  }

  return <Bilesen key={tur} hafta={hafta} onBitti={bitti} />;
}
