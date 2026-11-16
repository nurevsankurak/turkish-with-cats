'use client';
import { useRef, useState } from 'react';
import { karistir, sec } from '@/lib/araclar';

const TUR_SAYISI = 3;
const CIFT = 5;

function turlariKur(hafta) {
  const havuz = sec(hafta.kelimeler.filter((k) => k.emoji), TUR_SAYISI * CIFT);
  return Array.from({ length: TUR_SAYISI }, (_, i) => {
    const kelimeler = havuz.slice(i * CIFT, (i + 1) * CIFT);
    return { hedefler: kelimeler, cipler: karistir(kelimeler) };
  }).filter((t) => t.hedefler.length);
}

/** Sürüklenebilir kelime: fare ve dokunmatik ekranda çalışır; dokunup hedefe dokunmak da olur. */
function Cip({ kelime, secili, onSec, onBirak }) {
  const bas = useRef(null);
  const [kayma, setKayma] = useState(null);

  return (
    <button
      type="button"
      className={`surukle${secili ? ' secili' : ''}${kayma ? ' suruklenen' : ''}`}
      style={kayma ? { transform: `translate(${kayma.x}px, ${kayma.y}px) rotate(-3deg)` } : undefined}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        bas.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        if (!bas.current) return;
        const x = e.clientX - bas.current.x;
        const y = e.clientY - bas.current.y;
        if (kayma || Math.hypot(x, y) > 6) setKayma({ x, y });
      }}
      onPointerUp={(e) => {
        if (!bas.current) return;
        bas.current = null;
        if (kayma) {
          const hedef = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-hedef]');
          setKayma(null);
          if (hedef) onBirak(kelime, hedef.dataset.hedef);
        } else onSec(kelime);
      }}
      onPointerCancel={() => {
        bas.current = null;
        setKayma(null);
      }}
    >
      {kelime.tr}
    </button>
  );
}

export default function Esle({ hafta, onBitti }) {
  const [turlar] = useState(() => turlariKur(hafta));
  const [no, setNo] = useState(0);
  const [eslesen, setEslesen] = useState([]);
  const [secili, setSecili] = useState(null);
  const [hatali, setHatali] = useState(null);
  const [hata, setHata] = useState(0);
  const toplam = turlar.reduce((n, t) => n + t.hedefler.length, 0);

  const tur = turlar[no];

  const birak = (kelime, hedefTr) => {
    setSecili(null);
    if (eslesen.includes(hedefTr)) return;
    if (kelime.tr !== hedefTr) {
      setHata((h) => h + 1);
      setHatali(hedefTr);
      setTimeout(() => setHatali(null), 500);
      return;
    }
    const yeni = [...eslesen, hedefTr];
    setEslesen(yeni);
    if (yeni.length === tur.hedefler.length) {
      setTimeout(() => {
        if (no + 1 === turlar.length) onBitti({ dogru: Math.max(0, toplam - hata), toplam });
        else {
          setNo(no + 1);
          setEslesen([]);
        }
      }, 800);
    }
  };

  return (
    <div className="oyun esle">
      <p className="sayac">
        Tur {no + 1} / {turlar.length} — drag each word onto its meaning (or tap the word, then the meaning)
      </p>
      <div className="havuz">
        {tur.cipler
          .filter((k) => !eslesen.includes(k.tr))
          .map((k) => (
            <Cip key={k.tr} kelime={k} secili={secili?.tr === k.tr} onSec={(x) => setSecili(secili?.tr === x.tr ? null : x)} onBirak={birak} />
          ))}
      </div>
      <div className="hedefler">
        {tur.hedefler.map((h) => {
          const tamam = eslesen.includes(h.tr);
          return (
            <div
              key={h.tr}
              data-hedef={h.tr}
              className={`hedef${tamam ? ' tamam' : ''}${hatali === h.tr ? ' salla' : ''}${secili && !tamam ? ' bekliyor' : ''}`}
              onClick={() => secili && birak(secili, h.tr)}
            >
              <span className="hedef-emoji">{h.emoji}</span>
              <span className="hedef-en">{h.en}</span>
              <span className="hedef-yuva">{tamam ? h.tr : ''}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
