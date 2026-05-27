'use client';

import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import type { Promotion } from '@/types';

interface PromotionPopupProps {
  promotions: Promotion[];
}

const STORAGE_KEY = 'wos_popup_seen';

export default function PromotionPopup({ promotions }: PromotionPopupProps) {
  const popups = promotions.filter((p) => p.type === 'popup' && p.active);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Promotion | null>(null);

  useEffect(() => {
    if (popups.length === 0) return;
    try {
      const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
      const unseen = popups.find((p) => !seen.includes(p.id));
      if (!unseen) return;

      // Small delay so it feels intentional
      const timer = setTimeout(() => {
        setCurrent(unseen);
        setOpen(true);
      }, 1800);
      return () => clearTimeout(timer);
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => {
    if (!current) return;
    try {
      const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, current.id]));
    } catch {}
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && current && (
        <>
          {/* Backdrop */}
          <motion.div className='fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />

          {/* Modal */}
          <motion.div
            className='fixed inset-0 z-[61] flex items-center justify-center p-6 pointer-events-none'
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className='relative pointer-events-auto w-full max-w-md bg-surface border border-gold/40 p-8 shadow-2xl'>
              {/* Gold top border accent */}
              <div className='absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent' />

              <button onClick={close} className='absolute top-4 right-4 p-1.5 text-foreground-muted hover:text-foreground transition-colors' aria-label='Close'>
                <HiX size={18} />
              </button>

              <div className='flex items-center gap-3 mb-1'>
                <div className='h-px w-6 bg-gold' />
                <span className='text-[10px] font-semibold tracking-[0.2em] uppercase text-gold'>Special Offer</span>
              </div>

              <h2 className='font-display text-2xl font-semibold mb-3 mt-1'>{current.title}</h2>
              <p className='text-sm text-foreground-muted leading-relaxed'>{current.message}</p>

              <button onClick={close} className='mt-6 w-full py-3 bg-gold hover:bg-gold-light text-background text-sm font-semibold uppercase tracking-wider transition-colors duration-200'>
                Learn More
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
