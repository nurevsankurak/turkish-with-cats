'use client';
import { useState } from 'react';
import { karistir, sec } from '@/lib/araclar';
import SesDugmesi from '../SesDugmesi';

function karisikParcalar(cumle) {
  const parcalar = cumle.split(' ').map((metin, i) => ({ id: i, metin }));
  let k = karistir(parcalar);
  for (let i = 0; i < 5 && parcalar.length > 1 && k.every((p, j) => p.id === j); i++) k = karistir(parcalar);
  return k;
}

export default function Cumle({ hafta, onBitti }) {
  const [sorular] = useState(() => sec(hafta.cumleler, 6).map((c) => ({ ...c, parcalar: karisikParcalar(c.tr) })));
  const [no, setNo] = useState(0);
  const [dizi, setDizi] = useState([]);
  const [hataVar, setHataVar] = useState(false);
  const [dogru, setDogru] = useState(0);

  const s = sorular[no];
  const dolu = dizi.length === s.parcalar.length;
  const tamam = dolu && dizi.map((p) => p.metin).join(' ') === s.tr;

  const ekle = (p) => !tamam && setDizi([...dizi, p]);
  const cikar = (p) => !tamam && setDizi(dizi.filter((x) => x.id !== p.id));

  const sonraki = () => {
    const puan = dogru + (hataVar ? 0 : 1);
    if (no + 1 === sorular.length) onBitti({ dogru: puan, toplam: sorular.length });
    else {
      setDogru(puan);
      setNo(no + 1);
      setDizi([]);
      setHataVar(false);
    }
  };

  return (
    <div className="oyun cumle">
      <p className="sayac">
        {no + 1} / {sorular.length}
      </p>
      <div className="soru">
        <p className="soru-ust">Build this sentence in Turkish:</p>
        <h2>{s.en}</h2>
      </div>
      <div className={`cumle-satir${tamam ? ' dogru' : dolu ? ' yanlis' : ''}`}>
        {dizi.map((p) => (
          <button key={p.id} type="button" className="parca" onClick={() => cikar(p)}>
            {p.metin}
          </button>
        ))}
      </div>
      <div className="havuz">
        {s.parcalar
          .filter((p) => !dizi.some((x) => x.id === p.id))
          .map((p) => (
            <button key={p.id} type="button" className="parca" onClick={() => ekle(p)}>
              {p.metin}
            </button>
          ))}
      </div>
      {tamam && (
        <div className="geri-bildirim">
          <p className="iyi">
            Doğru! 🐾 <SesDugmesi metin={s.tr} />
          </p>
          <button type="button" className="dugme" onClick={sonraki} autoFocus>
            {no + 1 === sorular.length ? 'Bitir · Finish' : 'Sonraki · Next'}
          </button>
        </div>
      )}
      {dolu && !tamam && (
        <div className="geri-bildirim">
          <p className="kotu">Not quite 😿</p>
          <button
            type="button"
            className="dugme dugme-acik"
            onClick={() => {
              setDizi([]);
              setHataVar(true);
            }}
          >
            Tekrar dene · Try again
          </button>
        </div>
      )}
    </div>
  );
}
