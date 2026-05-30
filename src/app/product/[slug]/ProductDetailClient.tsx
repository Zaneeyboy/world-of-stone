'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiEye } from 'react-icons/hi';
import type { Product } from '@/types';
import { incrementProductView, trackEvent } from '@/lib/firestore';
import WhatsAppButton from '@/components/WhatsAppButton';

const materialLabel: Record<Product['materialType'], string> = {
  granite: 'Granite',
  marble: 'Marble',
  quartz: 'Quartz',
  limestone: 'Limestone',
  travertine: 'Travertine',
  sandstone: 'Sandstone',
  slate: 'Slate',
  other: 'Other',
};

const availabilityLabel: Record<Product['availability'], string> = {
  in_stock: 'In Stock',
  limited: 'Limited Stock',
  out_of_stock: 'Out of Stock',
  by_order: 'By Order',
};

const availabilityColor: Record<Product['availability'], string> = {
  in_stock: 'text-emerald-400',
  limited: 'text-amber-400',
  out_of_stock: 'text-red-400',
  by_order: 'text-stone-light',
};

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    incrementProductView(product.id).catch(() => {});
    trackEvent('product_view', product.id);
  }, [product.id]);

  const prevImage = () => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length);
  const nextImage = () => setActiveImage((i) => (i + 1) % product.images.length);

  return (
    <motion.main className='min-h-screen pt-24 pb-20' initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
      {/* Breadcrumb */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-4'>
        <nav className='flex items-center gap-2 text-xs text-foreground-muted'>
          <Link href='/' className='hover:text-foreground transition-colors'>
            Home
          </Link>
          <span>/</span>
          <Link href='/catalog' className='hover:text-foreground transition-colors'>
            Catalog
          </Link>
          <span>/</span>
          <span className='text-foreground'>{product.name}</span>
        </nav>
      </div>

      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16'>
          {/* Image Gallery */}
          <div>
            {/* Main image */}
            <div className='relative aspect-square overflow-hidden bg-surface border border-border mb-4'>
              {product.images.length > 0 ? (
                <>
                  <Image src={product.images[activeImage]} alt={`${product.name} — image ${activeImage + 1}`} fill sizes='(max-width: 1024px) 100vw, 50vw' className='object-cover' priority />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className='absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm border border-border hover:border-gold flex items-center justify-center transition-colors'
                        aria-label='Previous image'
                      >
                        <HiChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className='absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm border border-border hover:border-gold flex items-center justify-center transition-colors'
                        aria-label='Next image'
                      >
                        <HiChevronRight size={20} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className='absolute inset-0 bg-surface-2 stone-texture flex items-center justify-center'>
                  <span className='text-foreground-muted text-xs uppercase tracking-widest'>No images</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className='flex gap-3 overflow-x-auto'>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative flex-shrink-0 w-20 h-20 border-2 overflow-hidden transition-all duration-200 ${activeImage === i ? 'border-gold' : 'border-border hover:border-stone'}`}
                  >
                    <Image src={img} alt={`${product.name} thumbnail ${i + 1}`} fill sizes='80px' className='object-cover' />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className='flex flex-col'>
            {/* Type + availability */}
            <div className='flex items-center gap-3 mb-4'>
              <span className='text-xs font-semibold uppercase tracking-widest border border-border px-2 py-1 text-foreground-muted'>{materialLabel[product.materialType]}</span>
              <span className={`text-xs font-medium uppercase tracking-wider ${availabilityColor[product.availability]}`}>● {availabilityLabel[product.availability]}</span>
              {product.viewCount > 0 && (
                <span className='flex items-center gap-1 text-[11px] text-foreground-muted ml-auto'>
                  <HiEye size={12} />
                  {product.viewCount} views
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className='font-display text-4xl md:text-5xl font-semibold leading-tight mb-4'>{product.name}</h1>

            {/* Color */}
            <div className='flex items-center gap-2 mb-5'>
              <span className='text-xs text-foreground-muted uppercase tracking-wider'>Color:</span>
              <span className='text-sm'>{product.color}</span>
              <div className='flex gap-1.5 ml-2'>
                {product.colorTags.map((tag) => (
                  <span key={tag} className='text-[10px] bg-surface-2 text-foreground-muted px-2 py-0.5 rounded-sm'>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className='py-5 border-y border-border mb-6'>
              {product.price ? (
                <div>
                  <p className='font-display text-3xl font-semibold text-gold'>
                    R{product.price.toLocaleString()}
                    <span className='text-foreground-muted text-base font-normal ml-2'>{product.priceUnit ?? 'per m²'}</span>
                  </p>
                  <p className='text-xs text-foreground-muted mt-1'>Price excludes installation. Contact us for a full quote.</p>
                </div>
              ) : (
                <div>
                  <p className='font-display text-2xl font-semibold text-stone-light'>Price on Inquiry</p>
                  <p className='text-xs text-foreground-muted mt-1'>Contact us via WhatsApp for current pricing.</p>
                </div>
              )}
            </div>

            {/* Description */}
            <p className='text-foreground-muted text-sm leading-relaxed mb-6'>{product.description}</p>

            {/* Use cases */}
            {product.useCases.length > 0 && (
              <div className='mb-8'>
                <h3 className='text-xs font-semibold uppercase tracking-widest text-gold mb-3'>Ideal For</h3>
                <div className='flex flex-wrap gap-2'>
                  {product.useCases.map((use) => (
                    <span key={use} className='px-3 py-1 border border-border text-xs text-foreground-muted capitalize'>
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <WhatsAppButton variant='cta' productId={product.id} productName={product.name} productSlug={product.slug} label='Request a Quote' />
              <Link
                href='/contact'
                className='flex items-center justify-center gap-2 px-8 py-4 border border-border hover:border-gold text-foreground-muted hover:text-foreground font-semibold transition-all duration-200 text-sm tracking-wider uppercase'
              >
                Contact Form
              </Link>
            </div>

            {/* Share note */}
            <p className='text-[11px] text-foreground-muted mt-4'>
              Share this product:{' '}
              <button onClick={() => navigator.clipboard.writeText(window.location.href)} className='text-gold hover:text-gold-light transition-colors underline'>
                Copy link
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}
