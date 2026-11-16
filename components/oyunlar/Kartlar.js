'use client';
import { useMemo, useState } from 'react';
import { karistir } from '@/lib/araclar';
import SesDugmesi from '../SesDugmesi';

export default function Kartlar({ hafta, onBitti }) {
  const [grup, setGrup] = useState(hafta.gruplar[0].id);
  const hepsi = useMemo(() => hafta.kelimeler.filter((k) => k.grup === grup), [hafta, grup]);
  const [deste, setDeste] = useState(() => karistir(hepsi));
  const [acik, setAcik] = useState(false);

  const grupSec = (id) => {
    setGrup(id);
    setDeste(karistir(hafta.kelimeler.filter((k) => k.grup === id)));
    setAcik(false);
  };

  const kart = deste[0];
  const ilerle = (ogrendim) => {
    setAcik(false);
    const kalan = ogrendim ? deste.slice(1) : [...deste.slice(1), kart];
    if (!kalan.length) onBitti();
    else setDeste(kalan);
  };

  return (
    <div className="oyun kartlar">
      <div className="cipler" role="tablist">
        {hafta.gruplar.map((g) => (
          <button key={g.id} type="button" role="tab" aria-selected={g.id === grup} className={`cip${g.id === grup ? ' secili' : ''}`} onClick={() => grupSec(g.id)}>
            {g.ad} <small>{g.en}</small>
          </button>
        ))}
      </div>
      <p className="sayac">
        {hepsi.length - deste.length} / {hepsi.length} öğrenildi · learned
      </p>

      <div key={kart.tr} className={`kart${acik ? ' acik' : ''}`} role="button" tabIndex={0} onClick={() => setAcik(!acik)} onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setAcik(!acik)}>
        <div className="kart-ic">
          <div className="kart-yuz kart-on">
            {kart.emoji && <span className="kart-emoji">{kart.emoji}</span>}
            <span className="kart-tr">{kart.tr}</span>
            <SesDugmesi metin={kart.tr} />
            <span className="kart-ipucu">tap to flip</span>
          </div>
          <div className="kart-yuz kart-arka">
            <span className="kart-en">{kart.en}</span>
            <span className="kart-oku">say it: {kart.oku}</span>
          </div>
        </div>
      </div>

      <div className="dugmeler">
        <button type="button" className="dugme dugme-acik" onClick={() => ilerle(false)}>
          Tekrar · Again
        </button>
        <button type="button" className="dugme" onClick={() => ilerle(true)}>
          Öğrendim · Got it 🐾
        </button>
      </div>
    </div>
  );
}
