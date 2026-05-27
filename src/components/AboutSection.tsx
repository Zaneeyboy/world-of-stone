'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

const pillars = [
  {
    label: 'Global Sourcing',
    desc: 'We travel to quarries across Brazil, Italy, India, and Spain — selecting only the finest slabs that meet our exacting standards.',
  },
  {
    label: 'Master Fabrication',
    desc: 'Precision cutting, profiling, and finishing by craftsmen who treat every slab as a singular work.',
  },
  {
    label: 'Expert Installation',
    desc: 'Our installation teams bring decades of experience to every project — from residential kitchens to landmark commercial builds.',
  },
];

export default function AboutSection() {
  return (
    <section className='relative py-28 lg:py-36 overflow-hidden bg-background'>
      {/* Subtle background pattern */}
      <div
        className='absolute inset-0 opacity-[0.018]'
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className='relative max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center'>
          {/* Left — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='flex items-center gap-3 mb-6'
            >
              <div className='h-px w-8 bg-gold' />
              <span className='text-[11px] font-semibold tracking-[0.28em] uppercase text-gold'>Our Legacy</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className='font-display text-4xl md:text-5xl lg:text-[3.4rem] font-semibold leading-[1.08] mb-6'
            >
              Twenty Years of
              <br />
              <span className='text-gold-gradient'>Uncompromising</span>
              <br />
              Craftsmanship
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className='text-foreground-muted text-[0.95rem] leading-[1.85] mb-8 max-w-lg'
            >
              World of Stone was built on a single conviction: that exceptional spaces deserve
              exceptional materials. Since our founding, we have partnered with architects,
              designers, and homeowners who share that belief — delivering over 500 projects
              without ever compromising on quality.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className='text-foreground-muted text-[0.95rem] leading-[1.85] mb-12 max-w-lg'
            >
              We source directly from the world's finest quarries, maintain an inventory of
              200+ stone varieties, and handle every step — from slab selection to final
              installation — in-house.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href='/about'
                className='group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-foreground hover:text-gold transition-colors duration-200'
              >
                <span>Our Story</span>
                <HiArrowRight size={15} className='group-hover:translate-x-1 transition-transform duration-200' />
              </Link>
            </motion.div>
          </div>

          {/* Right — pillars + stat block */}
          <div className='flex flex-col gap-6'>
            {/* Stat row */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className='grid grid-cols-3 border border-border'
            >
              {[
                { value: '20+', label: 'Years' },
                { value: '500+', label: 'Projects' },
                { value: '200+', label: 'Varieties' },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`py-8 text-center ${i < 2 ? 'border-r border-border' : ''}`}
                >
                  <p className='font-display text-[2.4rem] font-semibold text-foreground leading-none mb-1.5'>
                    {s.value}
                  </p>
                  <p className='text-[10px] text-foreground-muted uppercase tracking-[0.2em]'>{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Pillars */}
            <div className='flex flex-col divide-y divide-border border border-border'>
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.label}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  className='group px-7 py-6 hover:bg-surface transition-colors duration-300'
                >
                  <div className='flex items-start gap-5'>
                    <div className='w-px self-stretch bg-gold/25 group-hover:bg-gold/70 transition-colors duration-300 shrink-0' />
                    <div>
                      <h4 className='font-display text-lg font-semibold mb-1.5 group-hover:text-gold transition-colors duration-200'>
                        {pillar.label}
                      </h4>
                      <p className='text-sm text-foreground-muted leading-relaxed'>{pillar.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
