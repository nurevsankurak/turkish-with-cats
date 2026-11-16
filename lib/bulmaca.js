import { buyuk } from './araclar';

const k = (r, c) => `${r},${c}`;

/** Kelimeleri çapraz bulmaca olarak yerleştirir. Sığmayan kelime atlanır. */
export function bulmacaKur(liste) {
  const kelimeler = liste
    .map((x) => ({ ...x, harfler: [...buyuk(x.cevap)] }))
    .sort((a, b) => b.harfler.length - a.harfler.length);
  const izgara = new Map(); // "r,c" -> { harf, yonler }
  const yerlesen = [];

  const uygun = (harfler, r, c, yon) => {
    const [dr, dc] = yon === 'yatay' ? [0, 1] : [1, 0];
    if (izgara.has(k(r - dr, c - dc)) || izgara.has(k(r + dr * harfler.length, c + dc * harfler.length))) return -1;
    let kesisim = 0;
    for (let i = 0; i < harfler.length; i++) {
      const rr = r + dr * i, cc = c + dc * i;
      const h = izgara.get(k(rr, cc));
      if (h) {
        if (h.harf !== harfler[i] || h.yonler.includes(yon)) return -1;
        kesisim++;
      } else if (izgara.has(k(rr + dc, cc + dr)) || izgara.has(k(rr - dc, cc - dr))) {
        return -1; // yan yana yapışmasın
      }
    }
    return kesisim;
  };

  const koy = (kelime, r, c, yon) => {
    const [dr, dc] = yon === 'yatay' ? [0, 1] : [1, 0];
    kelime.harfler.forEach((harf, i) => {
      const a = k(r + dr * i, c + dc * i);
      const h = izgara.get(a) ?? { harf, yonler: [] };
      h.yonler.push(yon);
      izgara.set(a, h);
    });
    yerlesen.push({ ...kelime, r, c, yon });
  };

  const dene = (kelime) => {
    let enIyi = null;
    for (const [a, h] of izgara) {
      const [r, c] = a.split(',').map(Number);
      kelime.harfler.forEach((harf, i) => {
        if (harf !== h.harf) return;
        for (const yon of ['yatay', 'dikey']) {
          const br = yon === 'yatay' ? r : r - i;
          const bc = yon === 'yatay' ? c - i : c;
          const puan = uygun(kelime.harfler, br, bc, yon);
          if (puan > 0) {
            const uzaklik = Math.abs(br) + Math.abs(bc);
            if (!enIyi || puan > enIyi.puan || (puan === enIyi.puan && uzaklik < enIyi.uzaklik))
              enIyi = { r: br, c: bc, yon, puan, uzaklik };
          }
        }
      });
    }
    if (enIyi) koy(kelime, enIyi.r, enIyi.c, enIyi.yon);
    return Boolean(enIyi);
  };

  if (!kelimeler.length) return { satir: 0, sutun: 0, kelimeler: [] };
  koy(kelimeler[0], 0, 0, 'yatay');
  let kalan = kelimeler.slice(1);
  for (let tur = 0; tur < 3 && kalan.length; tur++) kalan = kalan.filter((w) => !dene(w));

  const minR = Math.min(...yerlesen.map((w) => w.r));
  const minC = Math.min(...yerlesen.map((w) => w.c));
  let satir = 0, sutun = 0;
  for (const w of yerlesen) {
    w.r -= minR;
    w.c -= minC;
    w.hucreler = w.harfler.map((_, i) => (w.yon === 'yatay' ? k(w.r, w.c + i) : k(w.r + i, w.c)));
    satir = Math.max(satir, w.r + (w.yon === 'dikey' ? w.harfler.length : 1));
    sutun = Math.max(sutun, w.c + (w.yon === 'yatay' ? w.harfler.length : 1));
  }
  yerlesen.sort((a, b) => a.r - b.r || a.c - b.c);
  let no = 0;
  const numaralar = {};
  for (const w of yerlesen) {
    const bas = k(w.r, w.c);
    numaralar[bas] ??= ++no;
    w.no = numaralar[bas];
  }
  return { satir, sutun, kelimeler: yerlesen, numaralar };
}
