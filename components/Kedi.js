// Portakal: sitenin turuncu kedisi.
export default function Kedi({ boyut = 96, mutlu = false, className = '' }) {
  return (
    <svg className={`kedi ${className}`} width={boyut} height={boyut} viewBox="0 0 120 120" role="img" aria-label="Portakal the cat">
      <path d="M22 50 L18 12 L48 30 Z" fill="#F2913D" />
      <path d="M98 50 L102 12 L72 30 Z" fill="#F2913D" />
      <path d="M25 40 L23 21 L39 31 Z" fill="#F9C9B6" />
      <path d="M95 40 L97 21 L81 31 Z" fill="#F9C9B6" />
      <ellipse cx="60" cy="66" rx="44" ry="40" fill="#F2913D" />
      <path d="M60 28 v13 M48 30 l3 11 M72 30 l-3 11" stroke="#D9722A" strokeWidth="4" strokeLinecap="round" />
      <path d="M17 62 h10 M17 74 h9 M103 62 h-10 M103 74 h-9" stroke="#D9722A" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="60" cy="82" rx="22" ry="16" fill="#FFF3E2" />
      {mutlu ? (
        <path d="M36 62 q7 -9 14 0 M70 62 q7 -9 14 0" fill="none" stroke="#3B2A20" strokeWidth="4" strokeLinecap="round" />
      ) : (
        <>
          <ellipse cx="43" cy="60" rx="6" ry="7.5" fill="#3B2A20" />
          <ellipse cx="77" cy="60" rx="6" ry="7.5" fill="#3B2A20" />
          <circle cx="45" cy="57" r="2" fill="#fff" />
          <circle cx="79" cy="57" r="2" fill="#fff" />
        </>
      )}
      <path d="M55 74 h10 l-5 6 Z" fill="#E8776F" />
      <path d="M60 80 v4 M60 84 q-6 6 -11 1 M60 84 q6 6 11 1" fill="none" stroke="#3B2A20" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 80 h-18 M31 86 l-17 5 M90 80 h18 M89 86 l17 5" stroke="#3B2A20" strokeWidth="1.8" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}
