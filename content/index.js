import hafta1 from './hafta1';

// Yeni hafta: dosyayı içe aktarıp bu listeye ekleyin.
export const haftalar = [hafta1];

export const haftaBul = (no) => haftalar.find((h) => String(h.no) === String(no));
