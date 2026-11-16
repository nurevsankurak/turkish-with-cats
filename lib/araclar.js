export function karistir(dizi) {
  const d = [...dizi];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

export const sec = (dizi, n) => karistir(dizi).slice(0, n);

/** Türkçe büyük harf: i → İ, ı → I */
export const buyuk = (s) => s.toLocaleUpperCase('tr-TR');

export const ALFABE = [...'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'];
