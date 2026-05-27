'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '27000000000';

export default function HeroSection() {
  return (
    <section className='relative min-h-screen flex items-center overflow-hidden bg-[#0F0F10]'>
      {/* Subtle stone-vein texture overlay */}
      <div
        className='absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              -30deg,
              transparent,
              transparent 60px,
              rgba(255,255,255,1) 60px,
              rgba(255,255,255,1) 61px
            ),
            repeating-linear-gradient(
              60deg,
              transparent,
              transparent 120px,
              rgba(255,255,255,0.5) 120px,
              rgba(255,255,255,0.5) 121px
            )
          `,
        }}
      />

      {/* Radial glow — top left */}
      <div className='absolute top-0 left-0 w-[600px] h-[600px] bg-[#b08d57] opacity-[0.04] rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none' />
      {/* Radial glow — bottom right */}
      <div className='absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#b08d57] opacity-[0.03] rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none' />

      {/* Gradient vignette */}
      <div className='absolute inset-0 bg-gradient-to-b from-[#0F0F10]/80 via-transparent to-[#0F0F10]' />

      {/* Right-side decorative stone panel */}
      <div className='absolute right-0 top-0 bottom-0 w-[42%] hidden lg:flex flex-col'>
        {/* Stone slab texture blocks */}
        <div className='flex-1 bg-gradient-to-br from-[#1a1916] to-[#0F0F10] border-l border-white/[0.06]'>
          <div
            className='w-full h-full opacity-40'
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 30% 40%, rgba(176,141,87,0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.04) 0%, transparent 50%)
              `,
            }}
          />
        </div>
        {/* Vertical gold line accent */}
        <div className='absolute left-0 top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-[#b08d57]/40 to-transparent' />
      </div>

      {/* Main content */}
      <div className='relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-0 lg:min-h-screen lg:flex lg:items-center'>
        <div className='max-w-2xl'>
          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className='flex items-center gap-3 mb-10'>
            <div className='h-px w-10 bg-[#b08d57]/60' />
            <span className='text-[11px] font-semibold tracking-[0.3em] uppercase text-[#b08d57]'>Premium Stone Supplier · South Africa</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className='font-display text-[3.2rem] md:text-[4.2rem] lg:text-[5rem] font-semibold leading-[1.02] tracking-[-0.01em] mb-6 text-white'
          >
            Imported Stone Surfaces <span className='text-stone-gradient italic'>Crafted</span>
            <br className='hidden md:block' /> for Exceptional <span className='text-stone-gradient italic'>Spaces</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className='text-[0.95rem] text-white/50 leading-[1.8] max-w-[480px] mb-12'
          >
            Over 20 years supplying premium granite, marble, quartz, and luxury stone materials for residential and commercial projects across South Africa.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.34 }}
            className='flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-20'
          >
            <Link
              href='/catalog'
              className='group flex items-center gap-3 px-8 py-4 bg-[#b08d57] hover:bg-[#c9a97a] text-white font-semibold text-sm tracking-[0.12em] uppercase transition-colors duration-250'
            >
              <span>Explore Materials</span>
              <HiArrowRight size={15} className='group-hover:translate-x-1 transition-transform duration-200' />
            </Link>
            <Link
              href='/contact'
              className='flex items-center gap-3 px-8 py-4 border border-white/20 text-white/80 hover:border-white/50 hover:text-white font-medium text-sm tracking-[0.12em] uppercase transition-all duration-250'
            >
              Request Consultation
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }} className='flex items-start gap-10 sm:gap-14'>
            {[
              { value: '200+', label: 'Colors Available' },
              { value: '500+', label: 'Projects Completed' },
              { value: '20+', label: 'Years Experience' },
            ].map((stat, i) => (
              <div key={stat.label} className='flex flex-col'>
                {i > 0 && <div className='hidden' />}
                <p className='font-display text-[2.2rem] font-semibold text-white leading-none mb-1.5'>{stat.value}</p>
                <p className='text-[10px] text-white/35 uppercase tracking-[0.18em]'>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2'>
        <span className='text-[9px] text-white/20 uppercase tracking-[0.25em]'>Scroll</span>
        <div className='w-px h-10 bg-gradient-to-b from-white/20 to-transparent' />
      </div>
    </section>
  );
}
