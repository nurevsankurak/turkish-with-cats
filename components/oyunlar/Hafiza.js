'use client';
import { useState } from 'react';
import { karistir, sec } from '@/lib/araclar';
import { useSes } from '@/lib/ses';

function kartlariKur(hafta) {
  const kelimeler = sec(hafta.kelimeler.filter((k) => k.emoji), 6);
  return karistir(kelimeler.flatMap((k) => [{ id: `${k.tr}-tr`, cift: k.tr, tr: k.tr }, { id: `${k.tr}-en`, cift: k.tr, emoji: k.emoji, en: k.en }]));
}

export default function Hafiza({ hafta, onBitti }) {
  const { soyle } = useSes();
  const [kartlar] = useState(() => kartlariKur(hafta));
  const [acik, setAcik] = useState([]);
  const [bulunan, setBulunan] = useState([]);
  const [hamle, setHamle] = useState(0);

  const cevir = (k) => {
    if (acik.length === 2 || acik.includes(k.id) || bulunan.includes(k.cift)) return;
    if (k.tr) soyle(k.tr);
    const yeni = [...acik, k.id];
    setAcik(yeni);
    if (yeni.length < 2) return;
    setHamle(hamle + 1);
    const [x, y] = yeni.map((id) => kartlar.find((c) => c.id === id));
    if (x.cift === y.cift) {
      const b = [...bulunan, x.cift];
      setBulunan(b);
      setAcik([]);
      if (b.length === kartlar.length / 2) setTimeout(() => onBitti(), 900);
    } else setTimeout(() => setAcik([]), 1000);
  };

  return (
    <div className="oyun hafiza">
      <p className="sayac">
        {bulunan.length} / {kartlar.length / 2} çift · pairs — {hamle} hamle · moves
      </p>
      <div className="hafiza-izgara">
        {kartlar.map((k) => {
          const gorunur = acik.includes(k.id) || bulunan.includes(k.cift);
          return (
            <button key={k.id} type="button" className={`hafiza-kart${gorunur ? ' acik' : ''}${bulunan.includes(k.cift) ? ' bulundu' : ''}`} onClick={() => cevir(k)} aria-label={gorunur ? k.tr ?? k.en : 'Hidden card'}>
              {gorunur ? (
                k.tr ? (
                  <b>{k.tr}</b>
                ) : (
                  <>
                    <span className="hafiza-emoji">{k.emoji}</span>
                    <small>{k.en}</small>
                  </>
                )
              ) : (
                <span className="pati">🐾</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
