import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '27000000000';
const waMessage = encodeURIComponent('Hi, I would like to request a consultation for a stone project.');

export default function ContactBanner() {
  return (
    <section className='relative bg-[#0F0F10] py-28 lg:py-36 overflow-hidden'>
      {/* Warm gold radial glow */}
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
        <div className='w-[700px] h-[400px] bg-[#b08d57] opacity-[0.05] rounded-full blur-3xl' />
      </div>

      {/* Top & bottom gold hairlines */}
      <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b08d57]/40 to-transparent' />
      <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b08d57]/40 to-transparent' />

      <div className='relative max-w-4xl mx-auto px-6 lg:px-8 text-center'>
        <div className='flex items-center gap-3 justify-center mb-6'>
          <div className='h-px w-8 bg-[#b08d57]' />
          <span className='text-[11px] font-semibold tracking-[0.28em] uppercase text-[#b08d57]'>Start Your Project</span>
          <div className='h-px w-8 bg-[#b08d57]' />
        </div>

        <h2 className='font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.08] mb-5'>
          Ready to Transform
          <br />
          Your Space?
        </h2>

        <p className='text-white/45 text-[0.95rem] max-w-lg mx-auto leading-[1.8] mb-12'>
          From material selection to professional installation — speak with our team today for a consultation and quote tailored to your project.
        </p>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
          <Link
            href='/contact'
            className='flex items-center gap-3 px-8 py-4 bg-[#b08d57] hover:bg-[#c9a97a] text-white font-semibold transition-colors duration-200 text-sm tracking-[0.12em] uppercase'
          >
            <span>Request Consultation</span>
            <HiArrowRight size={15} />
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-3 px-8 py-4 border border-white/20 text-white/70 hover:border-white/40 hover:text-white font-medium transition-all duration-200 text-sm tracking-[0.12em] uppercase'
          >
            <FaWhatsapp size={18} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
