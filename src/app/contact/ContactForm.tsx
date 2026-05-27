'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { FaWhatsapp } from 'react-icons/fa';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import { motion } from 'framer-motion';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '18686204109';

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
  subject: string;
}

const defaultForm: FormState = {
  name: '',
  phone: '',
  email: '',
  message: '',
  subject: 'General Inquiry',
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Build pre-filled WhatsApp message and open it directly
    const waText = encodeURIComponent(
      `*New Inquiry — World of Stone*\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email || '—'}\nSubject: ${form.subject}\n\n*Message:*\n${form.message}`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`, '_blank', 'noopener,noreferrer');

    setStatus('success');
    setTimeout(() => {
      setForm(defaultForm);
      setStatus('idle');
    }, 3500);
  };

  return (
    <>
      <Navbar />
      <motion.main className='min-h-screen pt-24' initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
        {/* Header */}
        <div className='border-b border-border bg-surface'>
          <div className='max-w-7xl mx-auto px-6 lg:px-8 py-16'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-8 bg-gold' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-gold'>Get in Touch</span>
            </div>
            <h1 className='font-display text-4xl md:text-5xl font-semibold mb-3'>Contact Us</h1>
            <p className='text-foreground-muted max-w-md text-sm leading-relaxed'>Request a quote, ask about materials, or plan your project — our team is ready to assist.</p>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-6 lg:px-8 py-16'>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-16'>
            {/* Contact info */}
            <motion.div className='lg:col-span-2 flex flex-col gap-8' initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}>
              <div>
                <h2 className='font-display text-2xl font-semibold mb-6'>Reach Us Directly</h2>

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I would like to inquire about stone materials.')}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-4 p-5 border border-[#25D366]/30 hover:border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-all duration-200 mb-6 group'
                >
                  <div className='w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0'>
                    <FaWhatsapp size={22} className='text-white' />
                  </div>
                  <div>
                    <p className='text-sm font-semibold group-hover:text-[#25D366] transition-colors'>Chat on WhatsApp</p>
                    <p className='text-xs text-foreground-muted'>Fastest way to reach us — typically reply within minutes</p>
                  </div>
                </a>

                {/* Other contacts */}
                <div className='space-y-4'>
                  <div className='flex items-start gap-3'>
                    <div className='w-8 h-8 border border-border flex items-center justify-center flex-shrink-0 mt-0.5'>
                      <HiPhone size={14} className='text-gold' />
                    </div>
                    <div>
                      <p className='text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-0.5'>Phone</p>
                      <a href='tel:+18686204109' className='text-sm hover:text-gold transition-colors'>
                        +1 (868) 620-4109
                      </a>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='w-8 h-8 border border-border flex items-center justify-center flex-shrink-0 mt-0.5'>
                      <HiMail size={14} className='text-gold' />
                    </div>
                    <div>
                      <p className='text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-0.5'>Email</p>
                      <a href='mailto:info@worldofstone.co.za' className='text-sm hover:text-gold transition-colors'>
                        info@worldofstone.co.za
                      </a>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='w-8 h-8 border border-border flex items-center justify-center flex-shrink-0 mt-0.5'>
                      <HiLocationMarker size={14} className='text-gold' />
                    </div>
                    <div>
                      <p className='text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-0.5'>Location</p>
                      <p className='text-sm'>Johannesburg, Gauteng, SA</p>
                      <p className='text-xs text-foreground-muted mt-0.5'>Mon–Fri 8am–5pm · Sat 9am–1pm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className='aspect-video border border-border bg-surface-2 stone-texture flex items-center justify-center'>
                <span className='text-xs text-foreground-muted uppercase tracking-widest'>Map Coming Soon</span>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div className='lg:col-span-3' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}>
              <h2 className='font-display text-2xl font-semibold mb-6'>Send a Message</h2>

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div>
                    <label className='text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-2 block'>Your Name *</label>
                    <input
                      type='text'
                      name='name'
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder='John Smith'
                      className='w-full bg-surface border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-gold placeholder-foreground-muted/50 transition-colors'
                    />
                  </div>
                  <div>
                    <label className='text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-2 block'>Phone Number *</label>
                    <input
                      type='tel'
                      name='phone'
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder='+1 868 000 0000'
                      className='w-full bg-surface border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-gold placeholder-foreground-muted/50 transition-colors'
                    />
                  </div>
                </div>

                <div>
                  <label className='text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-2 block'>Email Address</label>
                  <input
                    type='email'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                    placeholder='john@example.com'
                    className='w-full bg-surface border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-gold placeholder-foreground-muted/50 transition-colors'
                  />
                </div>

                <div>
                  <label className='text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-2 block'>Subject</label>
                  <select
                    name='subject'
                    value={form.subject}
                    onChange={handleChange}
                    className='w-full bg-surface border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors'
                  >
                    <option>General Inquiry</option>
                    <option>Request a Quote</option>
                    <option>Product Availability</option>
                    <option>Installation Query</option>
                    <option>Bulk Order</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className='text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-2 block'>Message *</label>
                  <textarea
                    name='message'
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder='Describe your project or inquiry...'
                    className='w-full bg-surface border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-gold placeholder-foreground-muted/50 transition-colors resize-none'
                  />
                </div>

                <button
                  type='submit'
                  disabled={status === 'sending'}
                  className='w-full flex items-center justify-center gap-3 px-8 py-4 bg-gold hover:bg-gold-light text-background font-semibold transition-colors duration-200 text-sm tracking-wider uppercase disabled:opacity-60'
                >
                  {status === 'sending' ? (
                    <span className='flex items-center gap-2'>
                      <span className='w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin' />
                      Sending...
                    </span>
                  ) : status === 'success' ? (
                    '✓ Message Sent'
                  ) : (
                    <>
                      <FaWhatsapp size={18} />
                      Send Message
                    </>
                  )}
                </button>

                <p className='text-[11px] text-foreground-muted text-center'>Your details will open WhatsApp pre-filled — just hit send for instant delivery.</p>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.main>
      <Footer />
      <WhatsAppButton variant='floating' />
    </>
  );
}
