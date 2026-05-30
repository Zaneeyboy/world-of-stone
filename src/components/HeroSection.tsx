'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '27000000000';
const waMessage = encodeURIComponent('Hi, I would like to request a quote for a stone project.');

export default function HeroSection() {
  return (
    <section className='relative min-h-screen flex items-center overflow-hidden'>
      {/* Background image */}
      <Image
        src='https://imagedelivery.net/ecdEo-DBm7G7aeUYmdFLBA/ddc0ec99-84aa-4f56-47bc-8dda5d8ea700/w=800'
        alt='Luxury stone slab'
        fill
        className='object-cover object-center'
        priority
        sizes='100vw'
      />

      {/* Left reading-zone panel — creates contrast behind text regardless of image brightness */}
      <div className='absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10' />
      {/* Vertical vignette */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/65' />
      {/* Site-color footer blend */}
      <div className='absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0c0b09]/95 to-transparent' />

      {/* Main content */}
      <div className='relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-40 lg:py-0 lg:min-h-screen lg:flex lg:items-center'>
        <div className='max-w-2xl'>
          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className='flex items-center gap-3 mb-10'>
            <div className='h-px w-10 bg-gold/70' />
            <span className='text-[11px] font-semibold tracking-[0.3em] uppercase text-gold'>Premium Stone Supplier · Trinidad & Tobago</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className='font-display text-[3.2rem] md:text-[4.2rem] lg:text-[5rem] font-light leading-[1.02] tracking-[-0.01em] mb-6 text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.85)]'
          >
            Imported Stone Surfaces <span className='italic text-gold-light'>Crafted</span>
            <br className='hidden md:block' /> for Exceptional <span className='italic text-gold-light'>Spaces</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className='text-[0.95rem] text-white/70 leading-[1.8] max-w-[480px] mb-12 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]'
          >
            Over 20 years supplying premium granite, marble, quartz, and luxury stone materials for residential and commercial projects across Trinidad & Tobago.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.34 }}
            className='flex flex-col sm:flex-row items-start sm:items-center gap-4'
          >
            <Link
              href='/catalog'
              className='group flex items-center gap-3 px-9 py-[1.05rem] bg-gold-light hover:bg-[#f0dfa0] text-black font-bold text-sm tracking-[0.15em] uppercase transition-all duration-200 shadow-[0_0_32px_rgba(226,201,126,0.45)] hover:shadow-[0_0_48px_rgba(226,201,126,0.75)] hover:scale-[1.02]'
            >
              <span>Explore Materials</span>
              <HiArrowRight size={15} className='group-hover:translate-x-1.5 transition-transform duration-200' />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
              target='_blank'
              rel='noopener noreferrer'
              className='group flex items-center gap-3 px-9 py-[1.05rem] border border-white/35 text-white/80 hover:text-white hover:border-white/70 font-medium text-sm tracking-[0.15em] uppercase transition-all duration-200'
            >
              <FaWhatsapp size={18} className='text-[#4ade80] group-hover:scale-110 transition-transform duration-200' />
              <span>WhatsApp Us</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className='absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5'
      >
        <span className='text-[9px] text-white/30 uppercase tracking-[0.3em]'>Scroll</span>
        <div className='w-px h-10 bg-gradient-to-b from-white/30 to-transparent' />
      </motion.div>
    </section>
  );
}
