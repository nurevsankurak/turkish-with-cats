'use client';
import { useCallback, useEffect, useState } from 'react';

const turkceSes = () =>
  window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith('tr'));

/** Tarayıcının Türkçe sesiyle okuma. Cihazda Türkçe ses yoksa sesVar = false olur. */
export function useSes() {
  const [sesVar, setSesVar] = useState(false);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const bak = () => setSesVar(Boolean(turkceSes()));
    bak();
    window.speechSynthesis.addEventListener('voiceschanged', bak);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', bak);
  }, []);

  const soyle = useCallback((metin) => {
    if (!('speechSynthesis' in window)) return;
    const s = new SpeechSynthesisUtterance(metin);
    s.lang = 'tr-TR';
    s.rate = 0.8;
    const ses = turkceSes();
    if (ses) s.voice = ses;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(s);
  }, []);

  return { sesVar, soyle };
}
