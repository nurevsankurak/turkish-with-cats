'use client';
import { useEffect, useMemo, useState } from 'react';
import { ALFABE, buyuk } from '@/lib/araclar';
import { bulmacaKur } from '@/lib/bulmaca';

export default function Bulmaca({ hafta, onBitti }) {
  const b = useMemo(() => bulmacaKur(hafta.bulmaca), [hafta]);
  const [girdi, setGirdi] = useState({});
  const [aktif, setAktif] = useState({ kelime: 0, sira: 0 });
  const [kontrol, setKontrol] = useState(false);
  const [bitti, setBitti] = useState(false);

  const harfler = useMemo(() => {
    const m = {};
    for (const w of b.kelimeler) w.hucreler.forEach((h, i) => (m[h] = w.harfler[i]));
    return m;
  }, [b]);

  const kelime = b.kelimeler[aktif.kelime];
  const aktifHucre = kelime.hucreler[aktif.sira];

  const yaz = (harf) => {
    if (bitti) return;
    const yeni = { ...girdi, [aktifHucre]: harf };
    setGirdi(yeni);
    setKontrol(false);
    if (aktif.sira < kelime.hucreler.length - 1) setAktif({ ...aktif, sira: aktif.sira + 1 });
    if (Object.keys(harfler).every((h) => yeni[h] === harfler[h])) {
      setBitti(true);
      setTimeout(() => onBitti(), 1200);
    }
  };

  const sil = () => {
    if (bitti) return;
    setKontrol(false);
    if (girdi[aktifHucre]) {
      const yeni = { ...girdi };
      delete yeni[aktifHucre];
      setGirdi(yeni);
    } else if (aktif.sira > 0) {
      const onceki = kelime.hucreler[aktif.sira - 1];
      const yeni = { ...girdi };
      delete yeni[onceki];
      setGirdi(yeni);
      setAktif({ ...aktif, sira: aktif.sira - 1 });
    }
  };

  const hucreSec = (h) => {
    const icerenler = b.kelimeler.map((w, i) => ({ i, sira: w.hucreler.indexOf(h) })).filter((x) => x.sira >= 0);
    // aynı hücreye ikinci dokunuş yatay/dikey arasında geçiş yapar
    const sec = h === aktifHucre ? icerenler.find((x) => x.i !== aktif.kelime) ?? icerenler[0] : icerenler.find((x) => x.i === aktif.kelime) ?? icerenler[0];
    setAktif({ kelime: sec.i, sira: sec.sira });
  };

  useEffect(() => {
    const tus = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Backspace') {
        e.preventDefault();
        sil();
      } else if (e.key.length === 1) {
        const harf = buyuk(e.key);
        if (ALFABE.includes(harf)) yaz(harf);
      }
    };
    window.addEventListener('keydown', tus);
    return () => window.removeEventListener('keydown', tus);
  });

  const ipuclari = (yon) =>
    b.kelimeler
      .map((w, i) => ({ ...w, i }))
      .filter((w) => w.yon === yon)
      .sort((x, y) => x.no - y.no)
      .map((w) => (
        <li key={w.i}>
          <button type="button" className={`ipucu${w.i === aktif.kelime ? ' secili' : ''}`} onClick={() => setAktif({ kelime: w.i, sira: 0 })}>
            <b>{w.no}.</b> {w.ipucu} <small>({w.harfler.length})</small>
          </button>
        </li>
      ));

  return (
    <div className="oyun bulmaca">
      <p className="aktif-ipucu">
        <b>
          {kelime.no} {kelime.yon === 'yatay' ? '→' : '↓'}
        </b>{' '}
        {kelime.ipucu}
      </p>
      <div className="bulmaca-kaydir">
        <div className="bulmaca-izgara" style={{ '--sutun': b.sutun, gridTemplateColumns: `repeat(${b.sutun}, var(--kare))` }}>
          {Array.from({ length: b.satir * b.sutun }, (_, n) => {
            const h = `${Math.floor(n / b.sutun)},${n % b.sutun}`;
            if (!harfler[h]) return <span key={h} className="kare bos" />;
            const sinif = [
              'kare',
              kelime.hucreler.includes(h) && 'kelimede',
              h === aktifHucre && 'aktif',
              bitti && 'dogru',
              kontrol && girdi[h] && (girdi[h] === harfler[h] ? 'dogru' : 'yanlis'),
            ];
            return (
              <button key={h} type="button" className={sinif.filter(Boolean).join(' ')} onClick={() => hucreSec(h)}>
                {b.numaralar[h] && <i>{b.numaralar[h]}</i>}
                {girdi[h] ?? ''}
              </button>
            );
          })}
        </div>
      </div>

      <div className="klavye" aria-label="Turkish keyboard">
        {ALFABE.map((harf) => (
          <button key={harf} type="button" onClick={() => yaz(harf)}>
            {harf}
          </button>
        ))}
        <button type="button" className="genis" onClick={sil} aria-label="Delete">
          ⌫
        </button>
        <button type="button" className="genis" onClick={() => setKontrol(true)}>
          Kontrol ✓
        </button>
      </div>

      <div className="ipuclari">
        <div>
          <h3>Yatay · Across →</h3>
          <ul>{ipuclari('yatay')}</ul>
        </div>
        <div>
          <h3>Dikey · Down ↓</h3>
          <ul>{ipuclari('dikey')}</ul>
        </div>
      </div>
    </div>
  );
}
