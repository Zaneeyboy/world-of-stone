'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Granite',
    slug: 'granite',
    desc: 'Durable, heat-resistant. Ideal for kitchen countertops and high-traffic floors.',
    icon: '◆',
  },
  {
    name: 'Marble',
    slug: 'marble',
    desc: 'Timeless elegance with natural veining. Perfect for bathrooms and feature walls.',
    icon: '◈',
  },
  {
    name: 'Quartz',
    slug: 'quartz',
    desc: 'Engineered for consistency. Low maintenance, scratch and stain resistant.',
    icon: '◇',
  },
  {
    name: 'Limestone',
    slug: 'limestone',
    desc: 'Warm, earthy tones. Great for flooring, cladding, and exterior applications.',
    icon: '○',
  },
  {
    name: 'Travertine',
    slug: 'travertine',
    desc: 'Natural porous texture with rustic luxury appeal for indoor and outdoor use.',
    icon: '□',
  },
  {
    name: 'Slate',
    slug: 'slate',
    desc: 'Rugged industrial character. Excellent for feature walls, flooring, and wet areas.',
    icon: '▲',
  },
];

export default function MaterialCategories() {
  return (
    <section className='py-24 bg-surface border-y border-border'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-14'>
          <div className='flex items-center gap-3 justify-center mb-3'>
            <div className='h-px w-8 bg-gold' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-gold'>Material Types</span>
            <div className='h-px w-8 bg-gold' />
          </div>
          <h2 className='font-display text-4xl md:text-5xl font-semibold'>Browse by Category</h2>
          <p className='text-foreground-muted mt-4 max-w-xl mx-auto text-sm leading-relaxed'>
            Each stone type has unique characteristics. Browse by category to find the perfect match for your project.
          </p>
        </div>

        {/* Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: 'easeOut' }}
            >
              <Link
                href={`/catalog?material=${cat.slug}`}
                className='group relative p-8 border border-border hover:border-gold/50 transition-all duration-300 bg-background/50 hover:bg-background flex flex-col gap-4 block'
              >
                {/* Icon */}
                <span className='text-2xl text-gold/40 group-hover:text-gold transition-colors duration-300 font-mono'>{cat.icon}</span>

                <div>
                  <h3 className='font-display text-2xl font-semibold mb-2 group-hover:text-gold transition-colors duration-200'>{cat.name}</h3>
                  <p className='text-sm text-foreground-muted leading-relaxed'>{cat.desc}</p>
                </div>

                {/* Hover arrow */}
                <div className='flex items-center gap-2 text-gold text-xs font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-auto'>
                  <span>Browse {cat.name}</span>
                  <span>→</span>
                </div>

                {/* Corner decoration */}
                <div className='absolute bottom-0 right-0 w-8 h-8 border-b border-r border-transparent group-hover:border-gold/30 transition-all duration-300' />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
