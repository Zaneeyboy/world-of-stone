'use client';

import { useState } from 'react';
import { HiX, HiSpeakerphone } from 'react-icons/hi';
import type { Promotion } from '@/types';

interface PromotionBannerProps {
  promotions: Promotion[];
}

export default function PromotionBanner({ promotions }: PromotionBannerProps) {
  const banners = promotions.filter((p) => p.type === 'banner' && p.active);
  const [dismissed, setDismissed] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(sessionStorage.getItem('wos_banners_dismissed') ?? '[]');
    } catch {
      return [];
    }
  });

  const visible = banners.filter((b) => !dismissed.includes(b.id));
  if (visible.length === 0) return null;

  const banner = visible[0];

  const dismiss = (id: string) => {
    const next = [...dismissed, id];
    setDismissed(next);
    try {
      sessionStorage.setItem('wos_banners_dismissed', JSON.stringify(next));
    } catch {}
  };

  return (
    <div className='relative z-40 bg-gold text-background'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-2.5 flex items-center gap-3'>
        <HiSpeakerphone size={16} className='flex-shrink-0' />
        <p className='text-sm font-medium flex-1 text-center'>
          <span className='font-semibold'>{banner.title}</span>
          {banner.message && <span className='ml-2 font-normal opacity-90'>{banner.message}</span>}
        </p>
        <button onClick={() => dismiss(banner.id)} className='flex-shrink-0 p-1 hover:opacity-70 transition-opacity' aria-label='Dismiss banner'>
          <HiX size={16} />
        </button>
      </div>
    </div>
  );
}
