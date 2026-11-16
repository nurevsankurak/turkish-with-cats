// Tamamlanan etkinlikler tarayıcıda saklanır (her öğrencinin kendi cihazında).
const ANAHTAR = 'kedi-ilerleme';

export function ilerlemeOku() {
  try {
    return JSON.parse(localStorage.getItem(ANAHTAR)) ?? {};
  } catch {
    return {};
  }
}

export function ilerlemeKaydet(haftaNo, oyun) {
  try {
    const hepsi = ilerlemeOku();
    hepsi[haftaNo] = { ...hepsi[haftaNo], [oyun]: true };
    localStorage.setItem(ANAHTAR, JSON.stringify(hepsi));
  } catch {}
}
