'use client';
import { useSes } from '@/lib/ses';

export default function SesDugmesi({ metin, buyuk = false }) {
  const { sesVar, soyle } = useSes();
  if (!sesVar) return null;
  return (
    <button
      type="button"
      className={`ses${buyuk ? ' ses-buyuk' : ''}`}
      aria-label={`Listen: ${metin}`}
      onClick={(e) => {
        e.stopPropagation();
        soyle(metin);
      }}
    >
      🔊{buyuk && <span> Dinle · Listen</span>}
    </button>
  );
}
