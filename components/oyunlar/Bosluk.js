'use client';
import { useState } from 'react';
import { karistir, sec } from '@/lib/araclar';
import SesDugmesi from '../SesDugmesi';

export default function Bosluk({ hafta, onBitti }) {
  const [sorular] = useState(() => sec(hafta.bosluklar, 10).map((b) => ({ ...b, secenekler: karistir(b.secenekler) })));
  const [no, setNo] = useState(0);
  const [yanlislar, setYanlislar] = useState([]);
  const [bulundu, setBulundu] = useState(false);
  const [dogru, setDogru] = useState(0);

  const s = sorular[no];
  const [once, sonra] = s.metin.split('___');

  const dene = (x) => {
    if (bulundu || yanlislar.includes(x)) return;
    if (x === s.cevap) {
      setBulundu(true);
      if (!yanlislar.length) setDogru((d) => d + 1);
    } else setYanlislar([...yanlislar, x]);
  };

  const sonraki = () => {
    if (no + 1 === sorular.length) onBitti({ dogru, toplam: sorular.length });
    else {
      setNo(no + 1);
      setYanlislar([]);
      setBulundu(false);
    }
  };

  return (
    <div className="oyun bosluk">
      <p className="sayac">
        {no + 1} / {sorular.length}
      </p>
      <div className="soru">
        <h2 className="tr cumle-bosluk">
          {once}
          <span className={`bosluk-yer${bulundu ? ' dolu' : ''}`}>{bulundu ? s.cevap : ' '}</span>
          {sonra}
        </h2>
        <p className="soru-ust">({s.ipucu})</p>
      </div>
      <div className="secenekler">
        {s.secenekler.map((x) => (
          <button
            key={x}
            type="button"
            className={`secenek${bulundu && x === s.cevap ? ' dogru' : yanlislar.includes(x) ? ' yanlis' : bulundu ? ' soluk' : ''}`}
            onClick={() => dene(x)}
          >
            {x}
          </button>
        ))}
      </div>
      {bulundu && (
        <div className="geri-bildirim">
          <p className="iyi">
            Doğru! 🐾 <SesDugmesi metin={s.metin.replace('___', s.cevap)} />
          </p>
          <button type="button" className="dugme" onClick={sonraki} autoFocus>
            {no + 1 === sorular.length ? 'Bitir · Finish' : 'Sonraki · Next'}
          </button>
        </div>
      )}
      {!bulundu && yanlislar.length > 0 && <p className="kotu ortala">Tekrar dene · Try again 😿</p>}
    </div>
  );
}
