'use client';

import { MessageCircle } from 'lucide-react';

/** Site contact WhatsApp; override with NEXT_PUBLIC_WHATSAPP_NUMBER if needed */
const DEFAULT_WHATSAPP_E164 = '251955888885';

export default function WhatsAppChat() {
  const raw = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || DEFAULT_WHATSAPP_E164).trim();
  if (!raw) return null;

  const href = `https://wa.me/${raw}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 end-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl md:bottom-8 md:end-8"
      aria-label="WhatsApp chat"
    >
      <MessageCircle size={28} strokeWidth={2} />
    </a>
  );
}
