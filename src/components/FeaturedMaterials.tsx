'use client';

import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi';
import type { Product } from '@/types';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

interface FeaturedMaterialsProps {
  products: Product[];
}

export default function FeaturedMaterials({ products }: FeaturedMaterialsProps) {
  return (
    <section className='py-24 px-6 lg:px-8 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14'>
        <div>
          <div className='flex items-center gap-3 mb-3'>
            <div className='h-px w-8 bg-gold' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-gold'>Featured Collection</span>
          </div>
          <h2 className='font-display text-4xl md:text-5xl font-semibold leading-tight'>Premium Stone Materials</h2>
        </div>
        <Link href='/catalog' className='flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors font-medium uppercase tracking-wider whitespace-nowrap'>
          View All Materials
          <HiArrowRight size={16} />
        </Link>
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <motion.div
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-80px' }}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className='py-20 text-center border border-border'>
          <p className='text-foreground-muted text-sm'>Products coming soon.</p>
        </div>
      )}
    </section>
  );
}
