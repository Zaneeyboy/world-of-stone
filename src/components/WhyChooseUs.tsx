'use client';

import { motion } from 'framer-motion';

const reasons = [
  {
    number: '01',
    title: 'Premium Quality Sourcing',
    desc: 'We source only the finest natural stones, inspecting every slab for consistency, density, and finish quality.',
  },
  {
    number: '02',
    title: 'Expert Installation',
    desc: 'Our installation team has 12+ years of experience placing stone in kitchens, commercial spaces, and high-end interiors.',
  },
  {
    number: '03',
    title: 'Full Project Support',
    desc: "From material selection to final installation, we manage the process end-to-end so you don't have to coordinate multiple suppliers.",
  },
  {
    number: '04',
    title: 'Competitive Pricing',
    desc: 'Direct supplier relationships mean better pricing for you — without compromising on the grade of material.',
  },
  {
    number: '05',
    title: 'Wide Selection',
    desc: '50+ stone varieties across granite, marble, quartz, limestone, travertine, and slate — for any project aesthetic.',
  },
  {
    number: '06',
    title: 'Proven Track Record',
    desc: '500+ completed projects from residential renovations to major commercial builds. Results speak for themselves.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className='py-24 px-6 lg:px-8 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='text-center mb-16'>
        <div className='flex items-center gap-3 justify-center mb-3'>
          <div className='h-px w-8 bg-gold' />
          <span className='text-xs font-semibold tracking-[0.2em] uppercase text-gold'>Why Choose Us</span>
          <div className='h-px w-8 bg-gold' />
        </div>
        <h2 className='font-display text-4xl md:text-5xl font-semibold mb-4'>The World of Stone Difference</h2>
        <p className='text-foreground-muted max-w-xl mx-auto text-sm leading-relaxed'>We are not just a supplier. We are your full-service stone partner from selection through to installation.</p>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {reasons.map((reason, i) => (
          <motion.div
            key={reason.number}
            className='group relative flex flex-col gap-4 p-6 border border-border hover:border-gold/30 transition-all duration-300'
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
          >
            {/* Number */}
            <span className='font-display text-5xl font-semibold text-gold/15 group-hover:text-gold/25 transition-colors duration-300 leading-none select-none'>{reason.number}</span>

            <div>
              <h3 className='font-display text-xl font-semibold mb-2'>{reason.title}</h3>
              <p className='text-sm text-foreground-muted leading-relaxed'>{reason.desc}</p>
            </div>

            {/* Top-left gold corner */}
            <div className='absolute top-0 left-0 w-6 h-6 border-t border-l border-transparent group-hover:border-gold/40 transition-all duration-300' />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
