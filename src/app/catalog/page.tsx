'use client';

import { Suspense, useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard from '@/components/ProductCard';
import type { Product, MaterialType, FilterState, SortOption } from '@/types';
import { getProducts } from '@/lib/firestore';
import { HiAdjustments, HiX, HiSearch } from 'react-icons/hi';
import { motion } from 'framer-motion';

const MATERIAL_TYPES: { value: MaterialType; label: string }[] = [
  { value: 'granite', label: 'Granite' },
  { value: 'marble', label: 'Marble' },
  { value: 'quartz', label: 'Quartz' },
  { value: 'quartzite', label: 'Quartzite' },
  { value: 'limestone', label: 'Limestone' },
  { value: 'travertine', label: 'Travertine' },
  { value: 'sandstone', label: 'Sandstone' },
  { value: 'slate', label: 'Slate' },
  { value: 'onyx', label: 'Onyx' },
  { value: 'coral_stone', label: 'Coral Stone' },
  { value: 'flagstone', label: 'Flagstone' },
  { value: 'other', label: 'Other' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'most_viewed', label: 'Most Popular' },
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

const defaultFilters: FilterState = {
  materialType: '',
  color: '',
  priceMin: '',
  priceMax: '',
  availability: '',
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    materialType: (searchParams.get('material') as MaterialType) || '',
  });
  const [sort, setSort] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'newest');
  const [colorTagFilter, setColorTagFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts(filters, sort, 48);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setColorTagFilter('');
    setCountryFilter('');
  };

  const hasFilters = Object.values(filters).some((v) => v !== '') || !!colorTagFilter || !!countryFilter;

  const uniqueColorTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colorTags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [products]);

  const uniqueCountries = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.countryOfOrigin) set.add(p.countryOfOrigin);
    });
    return Array.from(set).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.colorTags?.some((t) => t.toLowerCase().includes(q)) ||
          p.materialType.toLowerCase().includes(q) ||
          (p.countryOfOrigin?.toLowerCase().includes(q) ?? false),
      );
    }
    if (colorTagFilter) result = result.filter((p) => p.colorTags?.includes(colorTagFilter));
    if (countryFilter) result = result.filter((p) => p.countryOfOrigin === countryFilter);
    return result;
  }, [products, searchQuery, colorTagFilter, countryFilter]);

  return (
    <>
      <Navbar />
      <motion.main className='min-h-screen pt-24' initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
        {/* Header */}
        <div className='border-b border-border bg-surface'>
          <div className='max-w-7xl mx-auto px-6 lg:px-8 py-12'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-8 bg-gold' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-gold'>Our Collection</span>
            </div>
            <h1 className='font-display text-4xl md:text-5xl font-semibold'>Stone Material Catalog</h1>
            <p className='text-foreground-muted mt-2 max-w-xl text-sm'>Browse our full selection of premium natural stone and engineered materials. Filter by type, color, and availability.</p>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-6 lg:px-8 py-8'>
          {/* Search bar */}
          <div className='relative mb-6'>
            <HiSearch size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by name, material, or color...'
              className='w-full bg-surface border border-border text-foreground text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-gold placeholder-foreground-muted/50 transition-colors'
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className='absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground'>
                <HiX size={14} />
              </button>
            )}
          </div>

          {/* Toolbar */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8'>
            {/* Left: filter toggle + active chips */}
            <div className='flex items-center gap-3 flex-wrap'>
              <button onClick={() => setFiltersOpen(!filtersOpen)} className='flex items-center gap-2 px-4 py-2 border border-border hover:border-gold text-sm font-medium transition-colors'>
                <HiAdjustments size={16} />
                Filters
                {hasFilters && <span className='w-4 h-4 rounded-full bg-gold text-background text-[10px] flex items-center justify-center font-bold'>✓</span>}
              </button>
              {filters.materialType && (
                <span className='flex items-center gap-1 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-xs'>
                  {filters.materialType}
                  <button onClick={() => updateFilter('materialType', '')}>
                    <HiX size={12} />
                  </button>
                </span>
              )}
              {colorTagFilter && (
                <span className='flex items-center gap-1 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-xs'>
                  {colorTagFilter}
                  <button onClick={() => setColorTagFilter('')}>
                    <HiX size={12} />
                  </button>
                </span>
              )}
              {countryFilter && (
                <span className='flex items-center gap-1 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-xs'>
                  {countryFilter}
                  <button onClick={() => setCountryFilter('')}>
                    <HiX size={12} />
                  </button>
                </span>
              )}
              {hasFilters && (
                <button onClick={clearFilters} className='text-xs text-foreground-muted hover:text-foreground underline'>
                  Clear all
                </button>
              )}
            </div>

            {/* Right: sort + count */}
            <div className='flex items-center gap-4'>
              <span className='text-xs text-foreground-muted'>{filteredProducts.length} materials</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className='bg-surface border border-border text-foreground text-sm px-3 py-2 focus:outline-none focus:border-gold'
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter panel */}
          {filtersOpen && (
            <div className='mb-8 p-6 border border-border bg-surface grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {/* Material type */}
              <div>
                <label className='text-xs font-semibold uppercase tracking-wider text-gold mb-3 block'>Material Type</label>
                <div className='flex flex-col gap-2'>
                  {MATERIAL_TYPES.map((type) => (
                    <label key={type.value} className='flex items-center gap-2 cursor-pointer text-sm text-foreground-muted hover:text-foreground'>
                      <input type='radio' name='materialType' checked={filters.materialType === type.value} onChange={() => updateFilter('materialType', type.value)} className='accent-gold' />
                      {type.label}
                    </label>
                  ))}
                  <label className='flex items-center gap-2 cursor-pointer text-sm text-foreground-muted hover:text-foreground'>
                    <input type='radio' name='materialType' checked={filters.materialType === ''} onChange={() => updateFilter('materialType', '')} className='accent-gold' />
                    All Types
                  </label>
                </div>
              </div>

              {/* Color Tags */}
              <div>
                <label className='text-xs font-semibold uppercase tracking-wider text-gold mb-3 block'>Color</label>
                {uniqueColorTags.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {uniqueColorTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setColorTagFilter(colorTagFilter === tag ? '' : tag)}
                        className={`px-2.5 py-1 text-xs border transition-colors ${
                          colorTagFilter === tag ? 'border-gold bg-gold/15 text-gold' : 'border-border text-foreground-muted hover:border-gold/50 hover:text-foreground'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className='text-xs text-foreground-muted'>No color tags yet</p>
                )}
              </div>

              {/* Country of Origin */}
              <div>
                <label className='text-xs font-semibold uppercase tracking-wider text-gold mb-3 block'>Country of Origin</label>
                {uniqueCountries.length > 0 ? (
                  <div className='flex flex-col gap-2'>
                    <label className='flex items-center gap-2 cursor-pointer text-sm text-foreground-muted hover:text-foreground'>
                      <input type='radio' name='country' checked={countryFilter === ''} onChange={() => setCountryFilter('')} className='accent-gold' />
                      All Countries
                    </label>
                    {uniqueCountries.map((c) => (
                      <label key={c} className='flex items-center gap-2 cursor-pointer text-sm text-foreground-muted hover:text-foreground'>
                        <input type='radio' name='country' checked={countryFilter === c} onChange={() => setCountryFilter(c)} className='accent-gold' />
                        {c}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className='text-xs text-foreground-muted'>No country data yet</p>
                )}
              </div>

              {/* Availability */}
              <div>
                <label className='text-xs font-semibold uppercase tracking-wider text-gold mb-3 block'>Availability</label>
                <div className='flex flex-col gap-2'>
                  {[
                    { value: '', label: 'Any' },
                    { value: 'in_stock', label: 'In Stock' },
                    { value: 'limited', label: 'Limited Stock' },
                    { value: 'by_order', label: 'By Order' },
                  ].map((opt) => (
                    <label key={opt.value} className='flex items-center gap-2 cursor-pointer text-sm text-foreground-muted hover:text-foreground'>
                      <input
                        type='radio'
                        name='availability'
                        checked={filters.availability === opt.value}
                        onChange={() => updateFilter('availability', opt.value as FilterState['availability'])}
                        className='accent-gold'
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products grid */}
          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className='bg-surface border border-border animate-pulse'>
                  <div className='aspect-[4/3] bg-surface-2' />
                  <div className='p-4 space-y-3'>
                    <div className='h-4 bg-surface-2 rounded w-3/4' />
                    <div className='h-3 bg-surface-2 rounded w-1/2' />
                    <div className='h-3 bg-surface-2 rounded w-full' />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              initial='hidden'
              animate='visible'
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className='py-24 text-center border border-border'>
              <p className='font-display text-2xl font-semibold mb-2'>No materials found</p>
              <p className='text-foreground-muted text-sm mb-6'>Try adjusting your filters or browse all materials.</p>
              <button onClick={clearFilters} className='px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-background text-sm font-medium transition-colors'>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </motion.main>
      <Footer />
      <WhatsAppButton variant='floating' />
    </>
  );
}

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogContent />
    </Suspense>
  );
}
