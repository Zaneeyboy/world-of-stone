import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '27000000000';
const waMessage = encodeURIComponent('Hi, I would like to discuss a stone project with your team.');

export default function ContactBanner() {
  return (
    <section className='relative py-24 overflow-hidden'>
      {/* Background pattern */}
      <div
        className='absolute inset-0 bg-surface-2'
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className='absolute inset-0 bg-gradient-to-r from-background via-transparent to-background' />

      {/* Gold accent lines */}
      <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent' />
      <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent' />

      <div className='relative max-w-4xl mx-auto px-6 lg:px-8 text-center'>
        <div className='flex items-center gap-3 justify-center mb-4'>
          <div className='h-px w-8 bg-gold' />
          <span className='text-xs font-semibold tracking-[0.2em] uppercase text-gold'>Start Your Project</span>
          <div className='h-px w-8 bg-gold' />
        </div>

        <h2 className='font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-5'>
          Ready to Transform
          <br />
          Your Space?
        </h2>

        <p className='text-foreground-muted text-base max-w-xl mx-auto leading-relaxed mb-10'>
          From material selection to professional installation — get in touch today for a quote tailored to your project.
        </p>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20bc5c] text-white font-semibold transition-colors duration-200 text-sm tracking-wider uppercase'
          >
            <FaWhatsapp size={20} />
            <span>Chat on WhatsApp</span>
          </a>
          <Link
            href='/contact'
            className='flex items-center gap-2 px-8 py-4 border border-gold text-gold hover:bg-gold hover:text-background font-semibold transition-all duration-200 text-sm tracking-wider uppercase'
          >
            <span>Contact Form</span>
            <HiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
