'use client';
import { useRef, useState } from 'react';
import { ALFABE, buyuk, karistir, sec } from '@/lib/araclar';

const N = 10;
const YONLER = [[0, 1], [1, 0], [1, 1]];
const a = (r, c) => `${r},${c}`;

function izgaraKur(hafta) {
  const adaylar = hafta.kelimeler.filter((k) => !k.tr.includes(' ') && /^\p{L}{3,8}$/u.test(k.tr));
  const izgara = Array.from({ length: N }, () => Array(N).fill(null));
  const kelimeler = [];
  for (const k of karistir(adaylar)) {
    if (kelimeler.length === 8) break;
    const harfler = [...buyuk(k.tr)];
    for (let deneme = 0; deneme < 150; deneme++) {
      const [dr, dc] = YONLER[Math.floor(Math.random() * YONLER.length)];
      const r = Math.floor(Math.random() * (N - dr * (harfler.length - 1)));
      const c = Math.floor(Math.random() * (N - dc * (harfler.length - 1)));
      if (harfler.every((h, i) => [null, h].includes(izgara[r + dr * i][c + dc * i]))) {
        harfler.forEach((h, i) => (izgara[r + dr * i][c + dc * i] = h));
        kelimeler.push({ ...k, yazi: harfler.join('') });
        break;
      }
    }
  }
  for (const satir of izgara) satir.forEach((h, i) => (satir[i] ??= sec(ALFABE, 1)[0]));
  return { izgara, kelimeler };
}

function yol(bas, son) {
  const dr = son.r - bas.r, dc = son.c - bas.c;
  if (dr && dc && Math.abs(dr) !== Math.abs(dc)) return [bas];
  const n = Math.max(Math.abs(dr), Math.abs(dc));
  return Array.from({ length: n + 1 }, (_, i) => ({ r: bas.r + Math.sign(dr) * i, c: bas.c + Math.sign(dc) * i }));
}

export default function KelimeAvi({ hafta, onBitti }) {
  const [{ izgara, kelimeler }] = useState(() => izgaraKur(hafta));
  const [bulunan, setBulunan] = useState([]); // { yazi, hucreler }
  const [secim, setSecim] = useState(null); // { bas, son }
  const igne = useRef(null); // dokun-dokun seçim için ilk hücre

  const hucre = (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-rc]');
    if (!el) return null;
    const [r, c] = el.dataset.rc.split(',').map(Number);
    return { r, c };
  };

  const degerlendir = (bas, son) => {
    const hucreler = yol(bas, son);
    const yazi = hucreler.map((h) => izgara[h.r][h.c]).join('');
    const ters = [...yazi].reverse().join('');
    const k = kelimeler.find((x) => (x.yazi === yazi || x.yazi === ters) && !bulunan.some((b) => b.yazi === x.yazi));
    if (!k) return;
    const yeni = [...bulunan, { yazi: k.yazi, hucreler: hucreler.map((h) => a(h.r, h.c)) }];
    setBulunan(yeni);
    if (yeni.length === kelimeler.length) setTimeout(() => onBitti(), 900);
  };

  const secili = new Set(secim ? yol(secim.bas, secim.son).map((h) => a(h.r, h.c)) : []);
  if (igne.current && !secim) secili.add(a(igne.current.r, igne.current.c));
  const bulunmus = new Set(bulunan.flatMap((b) => b.hucreler));

  return (
    <div className="oyun kelime-avi">
      <p className="sayac">
        {bulunan.length} / {kelimeler.length} — drag across the letters (→ ↓ ↘)
      </p>
      <div
        className="izgara"
        style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
        onPointerDown={(e) => {
          const h = hucre(e);
          if (!h) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setSecim({ bas: h, son: h });
        }}
        onPointerMove={(e) => {
          if (!secim) return;
          const h = hucre(e);
          if (h && (h.r !== secim.son.r || h.c !== secim.son.c)) setSecim({ ...secim, son: h });
        }}
        onPointerUp={() => {
          if (!secim) return;
          const { bas, son } = secim;
          setSecim(null);
          if (bas.r !== son.r || bas.c !== son.c) {
            igne.current = null;
            degerlendir(bas, son);
          } else if (igne.current) {
            degerlendir(igne.current, son);
            igne.current = null;
          } else igne.current = bas;
        }}
        onPointerCancel={() => setSecim(null)}
      >
        {izgara.map((satir, r) =>
          satir.map((h, c) => (
            <span key={a(r, c)} data-rc={a(r, c)} className={`hucre${bulunmus.has(a(r, c)) ? ' bulundu' : ''}${secili.has(a(r, c)) ? ' secili' : ''}`}>
              {h}
            </span>
          )),
        )}
      </div>
      <ul className="av-listesi">
        {kelimeler.map((k) => (
          <li key={k.tr} className={bulunan.some((b) => b.yazi === k.yazi) ? 'bulundu' : ''}>
            <b>{k.tr}</b> <small>{k.en}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
