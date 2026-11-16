'use client';
import { useState } from 'react';

const KELIMELER = ['kedi', 'limon', 'portakal', 'zebra', 'masa', 'okul', 'vazo', 'nane', 'bebek', 'resim', 'defter', 'ceket'];
const rastgele = (n) => crypto.getRandomValues(new Uint32Array(1))[0] % n;

/** Şifre kutusu: öğretmen yazabilir ya da "Üret" ile kolay yazılan bir şifre alır. */
export default function SifreAlani({ name = 'sifre', placeholder = 'Şifre' }) {
  const [deger, setDeger] = useState('');
  return (
    <span className="sifre-alani">
      <input name={name} type="text" required minLength={6} value={deger} onChange={(e) => setDeger(e.target.value)} placeholder={placeholder} autoComplete="off" autoCapitalize="none" spellCheck={false} />
      <button type="button" className="kucuk-dugme" onClick={() => setDeger(`${KELIMELER[rastgele(KELIMELER.length)]}-${KELIMELER[rastgele(KELIMELER.length)]}-${10 + rastgele(90)}`)}>
        Üret
      </button>
    </span>
  );
}
