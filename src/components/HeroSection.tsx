'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '27000000000';
const waMessage = encodeURIComponent("Hi, I'm interested in your stone materials. Could you please tell me more?");

export default function HeroSection() {
  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F0E0C]'>
      {/* Background grid pattern */}
      <div
        className='absolute inset-0'
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Gradient overlays */}
      <div className='absolute inset-0 bg-gradient-to-b from-[#0F0E0C] via-[#0F0E0C]/80 to-[#0F0E0C]' />
      <div className='absolute inset-0 bg-gradient-to-r from-[#0F0E0C]/60 via-transparent to-[#0F0E0C]/60' />

      {/* Decorative stone slab visual */}
      <div className='absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[70%] hidden lg:block opacity-10'>
        <div className='w-full h-full bg-gradient-to-br from-white/20 via-white/5 to-transparent' />
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className='relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center lg:text-left'>
        <div className='max-w-3xl'>
          {/* Tag line */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='flex items-center gap-3 justify-center lg:justify-start mb-8'>
            <div className='h-px w-12 bg-white/25' />
            <span className='text-xs font-semibold tracking-[0.25em] uppercase text-white/45'>Premium Stone Supplier &amp; Installer · South Africa</span>
            <div className='h-px w-12 bg-white/25' />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className='font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight mb-6 text-white'
          >
            The World&apos;s Finest <span className='text-stone-gradient'>Natural Stone</span>
            <br />
            Materials &amp; <span className='text-stone-gradient'>Installation</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-base text-white/55 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10'
          >
            Rare granites, marbles, and natural stone surfaces — curated from quarries worldwide. Over 200 varieties available. Supplied and installed for kitchens, flooring, interiors, and commercial
            projects across South Africa.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start'
          >
            <Link href='/catalog' className='flex items-center gap-2 px-8 py-4 bg-white text-[#0F0E0C] font-semibold hover:bg-white/90 transition-colors duration-200 text-sm tracking-wider uppercase'>
              <span>View Materials</span>
              <HiArrowRight size={16} />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 px-8 py-4 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-semibold transition-all duration-200 text-sm tracking-wider uppercase'
            >
              <FaWhatsapp size={18} />
              <span>WhatsApp Us</span>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className='flex items-center gap-8 mt-16 justify-center lg:justify-start'>
            {[
              { value: '500+', label: 'Projects Completed' },
              { value: '20+', label: 'Years of Excellence' },
              { value: '200+', label: 'Stone Varieties' },
            ].map((stat) => (
              <div key={stat.label} className='text-center lg:text-left'>
                <p className='font-display text-3xl font-semibold text-white'>{stat.value}</p>
                <p className='text-xs text-white/40 uppercase tracking-wider mt-0.5'>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30'>
        <div className='w-px h-12 bg-gradient-to-b from-transparent to-white animate-pulse' />
      </div>
    </section>
  );
}
