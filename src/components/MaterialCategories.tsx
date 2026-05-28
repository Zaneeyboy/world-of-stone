'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Granite',
    slug: 'granite',
    desc: 'Extraordinarily durable, heat-resistant, and available in over 60 unique colorways.',
    detail: 'Kitchen Tops · Feature Walls · Flooring',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76aa7a84?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Marble',
    slug: 'marble',
    desc: 'Timeless veined elegance — the material of choice for luxury interiors and architectural statements.',
    detail: 'Vanities · Staircases · Pool Edges · Waterfall Edges',
    image: 'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Quartz',
    slug: 'quartz',
    desc: 'Precision-engineered for modern living — consistent colour and virtually zero maintenance.',
    detail: 'Kitchen Tops · Backsplashes · Countertops',
    image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Exotic Stone',
    slug: 'exotic',
    desc: 'Rare imported varieties — onyx, quartzite, and semi-precious slabs from around the world.',
    detail: 'Feature Walls · Fountains · Bespoke Cladding',
    image: 'https://images.unsplash.com/photo-1614292253389-bd2c1f89cd0e?auto=format&fit=crop&w=800&q=80',
  },
];

export default function MaterialCategories() {
  return (
    <section className='bg-background'>
      {/* Header */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-14'>
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6'>
          <div>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-8 bg-gold' />
              <span className='text-[11px] font-semibold tracking-[0.28em] uppercase text-gold'>Our Materials</span>
            </div>
            <h2 className='font-display text-4xl md:text-5xl font-light text-foreground leading-tight'>Browse by Category</h2>
          </div>
          <p className='text-foreground-muted text-sm leading-relaxed max-w-xs md:text-right'>
            Each material type carries its own character. Discover the one that defines your space.
          </p>
        </div>
      </div>

      {/* Category grid */}
      <div className='max-w-7xl mx-auto'>
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
              className='group relative flex flex-col justify-end h-72 lg:h-96 overflow-hidden border-r border-t border-border last:border-r-0'
            >
              {/* Stone image */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className='object-cover object-center transition-transform duration-700 group-hover:scale-105'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              />

              {/* Permanent dark gradient so text is always legible */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/70 transition-all duration-500' />

              {/* Gold shimmer on hover */}
              <div className='absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/10 group-hover:to-gold/0 transition-all duration-500' />

              {/* Content */}
              <div className='relative z-10 p-7'>
                {/* Gold accent line */}
                <div className='h-px bg-gold/50 group-hover:bg-gold mb-4 transition-colors duration-300 w-8 group-hover:w-14' style={{ transitionProperty: 'width, background-color' }} />

                <h3 className='font-display text-2xl font-semibold text-white mb-1.5 group-hover:text-gold-light transition-colors duration-300'>{cat.name}</h3>
                <p className='text-white/55 text-xs leading-relaxed mb-3 group-hover:text-white/75 transition-colors duration-300'>{cat.desc}</p>
                <p className='text-[10px] text-gold/60 uppercase tracking-[0.2em] group-hover:text-gold transition-colors duration-300'>{cat.detail}</p>
              </div>

              {/* Bottom border accent */}
              <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-gold/0 group-hover:bg-gold/60 transition-colors duration-500' />
            </Link>
          </motion.div>
        ))}
      </div>      </div>
      <div className='border-t border-border' />
    </section>
  );
}

