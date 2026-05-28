'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '200+', label: 'Stone Varieties' },
  { value: '500+', label: 'Projects Completed' },
  { value: '20+', label: 'Years of Excellence' },
  { value: '100%', label: 'In-House Installation' },
];

export default function StatsBanner() {
  return (
    <section className='bg-surface border-y border-border'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-0'>
        <div className='grid grid-cols-2 lg:grid-cols-4 divide-x divide-border'>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
              className='flex flex-col items-center justify-center py-10 px-4'
            >
              <p className='font-display text-[2.4rem] md:text-[2.8rem] font-light text-gold-light leading-none mb-2 tracking-tight'>
                {stat.value}
              </p>
              <p className='text-[10px] text-foreground-muted uppercase tracking-[0.22em] text-center'>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
