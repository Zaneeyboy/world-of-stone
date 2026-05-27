'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { incrementProductInquiry } from '@/lib/firestore';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '27000000000';

interface WhatsAppButtonProps {
  productId?: string;
  productName?: string;
  productSlug?: string;
  label?: string;
  variant?: 'floating' | 'inline' | 'cta';
  message?: string;
}

export default function WhatsAppButton({ productId, productName, productSlug, label = 'Chat on WhatsApp', variant = 'floating', message }: WhatsAppButtonProps) {
  const buildMessage = () => {
    if (message) return encodeURIComponent(message);
    if (productName) {
      const url = productSlug ? `https://worldofstone.co.za/product/${productSlug}` : '';
      return encodeURIComponent(`Hi, I'm interested in *${productName}*.\n${url}\n\nCould you please send me more information and pricing?`);
    }
    return encodeURIComponent("Hi, I'm interested in your stone materials. Could you please send me more information?");
  };

  const handleClick = async () => {
    if (productId) {
      try {
        await incrementProductInquiry(productId);
      } catch {
        // non-critical — don't block the user
      }
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildMessage()}`, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleClick}
        aria-label='Contact us on WhatsApp'
        className='fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-200 group'
      >
        <FaWhatsapp size={28} className='text-white' />
        <span className='absolute right-16 bg-surface border border-border text-foreground text-sm px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg'>
          Chat with us
        </span>
      </button>
    );
  }

  if (variant === 'cta') {
    return (
      <button
        onClick={handleClick}
        className='flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20bc5c] text-white font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
      >
        <FaWhatsapp size={22} />
        <span>{label}</span>
      </button>
    );
  }

  // inline
  return (
    <button
      onClick={handleClick}
      className='flex items-center gap-2 px-5 py-2.5 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white text-sm font-medium transition-all duration-200'
    >
      <FaWhatsapp size={18} />
      <span>{label}</span>
    </button>
  );
}
