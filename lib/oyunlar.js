// Etkinlik listesi (her haftada aynı etkinlikler, o haftanın içeriğiyle çalışır)
export const OYUNLAR = [
  { id: 'kartlar', ad: 'Kartlar', en: 'Flashcards', simge: '🃏', aciklama: 'Flip the cards, listen and learn the words.' },
  { id: 'test', ad: 'Test', en: 'Quiz', simge: '❓', aciklama: 'Ten quick questions — listen, read and choose.' },
  { id: 'bosluk', ad: 'Boşluk Doldurma', en: 'Fill in the Blank', simge: '✏️', aciklama: 'Choose the missing word.' },
  { id: 'esle', ad: 'Sürükle Bırak', en: 'Drag & Drop', simge: '🧶', aciklama: 'Drag each Turkish word to its meaning.' },
  { id: 'cumle', ad: 'Cümle Kur', en: 'Build the Sentence', simge: '🧩', aciklama: 'Put the words in the right order.' },
  { id: 'kelime-avi', ad: 'Kelime Avı', en: 'Word Search', simge: '🔎', aciklama: 'Find the hidden words in the grid.' },
  { id: 'bulmaca', ad: 'Bulmaca', en: 'Crossword', simge: '🔠', aciklama: 'Solve the clues in Turkish.' },
  { id: 'hafiza', ad: 'Hafıza Oyunu', en: 'Memory Game', simge: '🐾', aciklama: 'Match each word with its picture.' },
];

export const oyunBul = (id) => OYUNLAR.find((o) => o.id === id);
