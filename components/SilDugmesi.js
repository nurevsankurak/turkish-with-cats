'use client';

export default function SilDugmesi({ kullaniciAdi }) {
  return (
    <button type="submit" className="kucuk-dugme tehlike" onClick={(e) => !confirm(`${kullaniciAdi} silinsin mi? Bu kişi artık giriş yapamaz.`) && e.preventDefault()}>
      Sil
    </button>
  );
}
