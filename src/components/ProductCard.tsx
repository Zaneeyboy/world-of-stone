import Link from 'next/link';
import Image from 'next/image';
import type { Product, Promotion } from '@/types';
import { FaWhatsapp } from 'react-icons/fa';
import { HiEye } from 'react-icons/hi';
import { motion } from 'framer-motion';

const availabilityLabel: Record<Product['availability'], string> = {
  in_stock: 'In Stock',
  limited: 'Limited Stock',
  out_of_stock: 'Out of Stock',
  by_order: 'By Order',
};

const availabilityColor: Record<Product['availability'], string> = {
  in_stock: 'text-emerald-400 border-emerald-800',
  limited: 'text-amber-400 border-amber-800',
  out_of_stock: 'text-red-400 border-red-900',
  by_order: 'text-stone border-border',
};

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

interface ProductCardProps {
  product: Product;
  promotions?: Promotion[];
}

export default function ProductCard({ product, promotions = [] }: ProductCardProps) {
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '18686204109';
  const TTD_USD = Number(process.env.NEXT_PUBLIC_TTD_USD_RATE) || 6.78;

  const waMessage = encodeURIComponent(`Hi, I'm interested in *${product.name}*.\nhttps://worldofstone.tt/product/${product.slug}\n\nCould you please send pricing and availability?`);

  const hasPromo = promotions.some((p) => p.active && (p.productIds?.length === 0 || p.productIds?.includes(product.id)));

  function PriceDisplay() {
    if (product.pricePerSqFt) {
      return (
        <div>
          <p className='text-gold font-semibold text-sm'>
            TTD {product.pricePerSqFt.toLocaleString()}<span className='text-foreground-muted font-normal text-xs'>/sq ft</span>
          </p>
          <p className='text-foreground-muted text-[10px]'>≈ USD {(product.pricePerSqFt / TTD_USD).toFixed(2)}/sq ft</p>
        </div>
      );
    }
    if (product.pricePerSheet) {
      return (
        <div>
          <p className='text-gold font-semibold text-sm'>
            TTD {product.pricePerSheet.toLocaleString()}<span className='text-foreground-muted font-normal text-xs'>/sheet</span>
          </p>
          <p className='text-foreground-muted text-[10px]'>≈ USD {(product.pricePerSheet / TTD_USD).toFixed(2)}/sheet</p>
        </div>
      );
    }
    if (product.price) {
      return (
        <div>
          <p className='text-gold font-semibold text-sm'>
            TTD {product.price.toLocaleString()}
            {product.priceUnit && <span className='text-foreground-muted font-normal text-xs ml-1'>{product.priceUnit}</span>}
          </p>
          <p className='text-foreground-muted text-[10px]'>≈ USD {(product.price / TTD_USD).toFixed(2)}</p>
        </div>
      );
    }
    return <p className='text-foreground-muted text-sm'>Price on inquiry</p>;
  }

  return (
    <motion.article
      className='group relative bg-surface border border-border overflow-hidden flex flex-col'
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'rgba(201,168,76,0.4)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <Link href={`/product/${product.slug}`} className='relative block aspect-[4/3] overflow-hidden bg-surface-2'>
        {product.images[0] ? (
          <motion.div className='relative w-full h-full' whileHover={{ scale: 1.06 }} transition={{ duration: 0.45 }}>
            <Image src={product.images[0]} alt={product.name} fill sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' className='object-cover' />
          </motion.div>
        ) : (
          <div className='absolute inset-0 flex items-center justify-center bg-surface-2 stone-texture'>
            <span className='text-foreground-muted text-xs uppercase tracking-widest'>No image</span>
          </div>
        )}

        {/* Badges */}
        <div className='absolute top-3 left-3 flex flex-col gap-1.5'>
          {hasPromo && <span className='px-2 py-0.5 bg-gold text-background text-[10px] font-semibold uppercase tracking-wider'>Promo</span>}
          {product.featured && !hasPromo && <span className='px-2 py-0.5 bg-gold text-background text-[10px] font-semibold uppercase tracking-wider'>Featured</span>}
          <span className={`px-2 py-0.5 border text-[10px] font-medium uppercase tracking-wider bg-background/80 ${availabilityColor[product.availability]}`}>
            {availabilityLabel[product.availability]}
          </span>
        </div>

        {/* View count */}
        {product.viewCount > 0 && (
          <div className='absolute bottom-3 right-3 flex items-center gap-1 bg-background/70 backdrop-blur-sm px-2 py-1 text-[10px] text-foreground-muted'>
            <HiEye size={12} />
            <span>{product.viewCount}</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className='flex flex-col flex-1 p-4'>
        <div className='flex items-start justify-between gap-2 mb-2'>
          <Link href={`/product/${product.slug}`}>
            <h3 className='font-display text-lg font-semibold leading-tight hover:text-gold transition-colors'>{product.name}</h3>
          </Link>
          <span className='text-[10px] uppercase tracking-widest text-foreground-muted border border-border px-1.5 py-0.5 whitespace-nowrap'>{materialLabel[product.materialType]}</span>
        </div>

        {/* Color tags */}
        {product.colorTags.length > 0 && (
          <div className='flex flex-wrap gap-1.5 mb-3'>
            {product.colorTags.slice(0, 3).map((tag) => (
              <span key={tag} className='text-[10px] bg-surface-2 text-foreground-muted px-2 py-0.5 rounded-sm'>
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className='text-sm text-foreground-muted line-clamp-2 flex-1 mb-4'>{product.description}</p>

        <div className='flex items-center justify-between mt-auto pt-3 border-t border-border'>
          {/* Price */}
          <div>
            <PriceDisplay />
          </div>

          {/* WhatsApp inquiry */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1.5 px-3 py-1.5 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-white text-xs font-medium transition-all duration-200'
            aria-label={`Inquire about ${product.name} on WhatsApp`}
          >
            <FaWhatsapp size={14} />
            <span>Inquire</span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}
