'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi';

const steps = [
  {
    number: '01',
    title: 'Global Sourcing',
    desc: 'We visit quarries across Brazil, Italy, India, Portugal, and Spain — personally selecting slabs that meet our quality threshold. Only the finest material makes it into our inventory.',
  },
  {
    number: '02',
    title: 'Expert Fabrication',
    desc: 'Each slab is precision-cut, edged, and finished by our craftsmen. We offer a full range of profiles and finishes — polished, honed, leathered, brushed, and sandblasted.',
  },
  {
    number: '03',
    title: 'Professional Installation',
    desc: 'Our dedicated installation teams carry decades of collective experience across residential, commercial, and hospitality projects. Every joint, every edge, placed with care.',
  },
  {
    number: '04',
    title: 'Final Finishing',
    desc: 'We seal, treat, and inspect every surface before handover. The result is a finished space that reflects the true character of the material — and lasts a lifetime.',
  },
];

export default function ProcessSection() {
  return (
    <section className='relative bg-background py-28 lg:py-36 overflow-hidden'>
      {/* Subtle vein lines */}
      <div
        className='absolute inset-0 opacity-[0.025]'
        style={{
          backgroundImage: `repeating-linear-gradient(
            -55deg,
            transparent,
            transparent 80px,
            rgba(201,168,76,1) 80px,
            rgba(201,168,76,1) 81px
          )`,
        }}
      />

      <div className='relative max-w-7xl mx-auto px-6 lg:px-8'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20'>
          <div>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className='flex items-center gap-3 mb-5'>
              <div className='h-px w-8 bg-gold' />
              <span className='text-[11px] font-semibold tracking-[0.28em] uppercase text-gold'>How We Work</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className='font-display text-4xl md:text-5xl font-light text-foreground leading-tight'
            >
              From Quarry to
              <br />
              <span className='text-gold-gradient italic'>Completed Space</span>
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link
              href='/contact'
              className='group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-foreground-muted hover:text-gold transition-colors duration-200'
            >
              <span>Start Your Project</span>
              <HiArrowRight size={14} className='group-hover:translate-x-1 transition-transform duration-200' />
            </Link>
          </motion.div>
        </div>

        {/* Steps */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-border'>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              className='group relative pt-10 pb-12 pr-8 border-b border-r border-border last:border-r-0 md:even:border-r-0 lg:even:border-r lg:last:border-r-0'
            >
              {/* Step number */}
              <div className='flex items-end gap-3 mb-7'>
                <span className='font-display text-[3rem] font-semibold text-gold/20 group-hover:text-gold/40 transition-colors duration-300 leading-none select-none'>{step.number}</span>
                {/* Connecting line (hidden on last) */}
                {i < steps.length - 1 && <div className='hidden lg:block flex-1 h-px bg-border mb-4' />}
              </div>

              {/* Gold accent bar */}
              <div className='w-8 h-px bg-gold/40 group-hover:bg-gold/80 mb-5 transition-colors duration-300' />

              <h3 className='font-display text-xl font-semibold text-foreground mb-4 group-hover:text-gold transition-colors duration-300'>{step.title}</h3>
              <p className='text-foreground-muted text-sm leading-[1.8] group-hover:text-foreground transition-colors duration-300'>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
