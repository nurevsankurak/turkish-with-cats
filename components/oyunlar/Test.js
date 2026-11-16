'use client';
import { useEffect, useState } from 'react';
import { karistir, sec } from '@/lib/araclar';
import { useSes } from '@/lib/ses';

function sorulariKur(hafta) {
  const hazir = sec(hafta.sorular ?? [], 4).map((s) => ({ tip: 'hazir', soru: s.soru, cevap: s.cevap, secenekler: karistir(s.secenekler) }));
  const kelimeSorulari = sec(hafta.kelimeler, 10 - hazir.length).map((k, i) => {
    const digerleri = sec(hafta.kelimeler.filter((x) => x.grup === k.grup && x.tr !== k.tr && x.en !== k.en), 3);
    return { tip: ['dinle', 'tr-en', 'en-tr'][i % 3], kelime: k, secenekler: karistir([k, ...digerleri]) };
  });
  return karistir([...hazir, ...kelimeSorulari]);
}

export default function Test({ hafta, onBitti }) {
  const { sesVar, soyle } = useSes();
  const [sorular] = useState(() => sorulariKur(hafta));
  const [no, setNo] = useState(0);
  const [secim, setSecim] = useState(null);
  const [dogru, setDogru] = useState(0);

  const s = sorular[no];
  // Cihazda Türkçe ses yoksa dinleme sorusu okuma sorusuna döner
  const tip = s.tip === 'dinle' && !sesVar ? 'tr-en' : s.tip;
  const dinleMetni = tip === 'dinle' ? s.kelime.tr : null;

  useEffect(() => {
    if (dinleMetni) soyle(dinleMetni);
  }, [dinleMetni, no, soyle]);

  const etiket = (x) => (tip === 'hazir' ? x : tip === 'tr-en' ? x.en : x.tr);
  const dogruMu = (x) => (tip === 'hazir' ? x === s.cevap : x.tr === s.kelime.tr);

  const sec_ = (x) => {
    if (secim !== null) return;
    setSecim(x);
    if (dogruMu(x)) setDogru((d) => d + 1);
    if (tip !== 'hazir') soyle(s.kelime.tr);
  };

  const sonraki = () => {
    if (no + 1 === sorular.length) onBitti({ dogru, toplam: sorular.length });
    else {
      setNo(no + 1);
      setSecim(null);
    }
  };

  return (
    <div className="oyun test">
      <p className="sayac">
        Soru {no + 1} / {sorular.length}
      </p>
      <div className="soru">
        {tip === 'hazir' && <h2>{s.soru}</h2>}
        {tip === 'tr-en' && (
          <>
            <p className="soru-ust">What does this mean?</p>
            <h2 className="tr">{s.kelime.tr}</h2>
          </>
        )}
        {tip === 'en-tr' && (
          <>
            <p className="soru-ust">How do you say this in Turkish?</p>
            <h2>
              {s.kelime.emoji} {s.kelime.en}
            </h2>
          </>
        )}
        {tip === 'dinle' && (
          <>
            <p className="soru-ust">Listen and choose the word you hear.</p>
            <button type="button" className="ses ses-dev" onClick={() => soyle(s.kelime.tr)} aria-label="Listen again">
              🔊
            </button>
          </>
        )}
      </div>
      <div className="secenekler">
        {s.secenekler.map((x) => {
          const durum = secim === null ? '' : dogruMu(x) ? ' dogru' : x === secim ? ' yanlis' : ' soluk';
          return (
            <button key={etiket(x)} type="button" className={`secenek${durum}`} onClick={() => sec_(x)} disabled={secim !== null}>
              {etiket(x)}
            </button>
          );
        })}
      </div>
      {secim !== null && (
        <div className="geri-bildirim">
          <p className={dogruMu(secim) ? 'iyi' : 'kotu'}>
            {dogruMu(secim) ? 'Doğru! 🐾' : 'Yanlış 😿'}
            {tip !== 'hazir' && (
              <span>
                {' '}
                {s.kelime.tr} = {s.kelime.en}
              </span>
            )}
          </p>
          <button type="button" className="dugme" onClick={sonraki} autoFocus>
            {no + 1 === sorular.length ? 'Bitir · Finish' : 'Sonraki · Next'}
          </button>
        </div>
      )}
    </div>
  );
}
