'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Granite',
    slug: 'granite',
    desc: "Quarried from the earth's depths — extraordinarily durable, heat-resistant, and available in over 60 unique colorways.",
    detail: 'Kitchens · Flooring · Feature Walls',
  },
  {
    name: 'Marble',
    slug: 'marble',
    desc: 'Timeless veined elegance formed over millennia. The material of choice for luxury interiors and architectural statements.',
    detail: 'Bathrooms · Vanities · Staircases',
  },
  {
    name: 'Quartz',
    slug: 'quartz',
    desc: 'Precision-engineered for modern living — consistent colour, non-porous surface, and virtually zero maintenance.',
    detail: 'Countertops · Worksurfaces · Retail',
  },
  {
    name: 'Exotic Stone',
    slug: 'exotic',
    desc: 'Rare imported varieties — onyx, quartzite, semi-precious slabs, and collector-grade stones sourced from around the world.',
    detail: 'Feature Pieces · Bespoke Projects',
  },
];

export default function MaterialCategories() {
  return (
    <section className='bg-[#0F0F10]'>
      {/* Header */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-14'>
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6'>
          <div>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-8 bg-[#b08d57]' />
              <span className='text-[11px] font-semibold tracking-[0.28em] uppercase text-[#b08d57]'>Our Materials</span>
            </div>
            <h2 className='font-display text-4xl md:text-5xl font-semibold text-white leading-tight'>Browse by Category</h2>
          </div>
          <p className='text-white/40 text-sm leading-relaxed max-w-xs md:text-right'>Each material type carries its own character. Discover the one that defines your space.</p>
        </div>
      </div>

      {/* Category grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
          >
            <Link
              href={`/catalog?material=${cat.slug}`}
              className='group relative flex flex-col justify-end h-64 lg:h-80 p-8 border-r border-t border-white/[0.07] last:border-r-0 overflow-hidden transition-all duration-500'
            >
              {/* Background shimmer on hover */}
              <div className='absolute inset-0 bg-gradient-to-br from-[#b08d57]/0 to-[#b08d57]/0 group-hover:from-[#b08d57]/8 group-hover:to-[#b08d57]/4 transition-all duration-500' />

              {/* Index number */}
              <span className='absolute top-6 right-6 font-display text-5xl font-semibold text-white/[0.04] group-hover:text-white/[0.07] transition-colors duration-300 select-none leading-none'>
                0{i + 1}
              </span>

              {/* Content */}
              <div className='relative z-10'>
                {/* Gold line that expands on hover */}
                <div className='h-px bg-[#b08d57]/30 group-hover:bg-[#b08d57]/70 mb-5 transition-colors duration-300 w-8 group-hover:w-12' style={{ transitionProperty: 'width, background-color' }} />

                <h3 className='font-display text-3xl font-semibold text-white mb-3 group-hover:text-[#b08d57] transition-colors duration-300'>{cat.name}</h3>
                <p className='text-white/40 text-[0.8rem] leading-relaxed mb-4 group-hover:text-white/60 transition-colors duration-300'>{cat.desc}</p>
                <p className='text-[10px] text-[#b08d57]/60 uppercase tracking-[0.2em] group-hover:text-[#b08d57] transition-colors duration-300'>{cat.detail}</p>
              </div>

              {/* Bottom border accent */}
              <div className='absolute bottom-0 left-0 right-0 h-px bg-[#b08d57]/0 group-hover:bg-[#b08d57]/40 transition-colors duration-500' />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className='border-t border-white/[0.07]' />
    </section>
  );
}
