import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PageWrapper from '@/components/PageWrapper';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'World of Stone offers professional stone installation services across Trinidad & Tobago — kitchen tops, vanities, staircases, pool edge coping, wall cladding, waterfall edges, fountains, and more.',
  openGraph: {
    title: 'Services | World of Stone',
    description: 'Professional stone installation services across Trinidad & Tobago.',
  },
};

const services = [
  {
    title: 'Kitchen Tops & Backsplashes',
    desc: 'Custom-fabricated granite, marble, and quartz surfaces for kitchens of every style. Straight edges, waterfall drops, and full backsplash panels — all precision-cut and professionally installed.',
    icon: '🍽',
  },
  {
    title: 'Waterfall Edges',
    desc: 'Dramatic stone panels cascading floor-to-ceiling alongside kitchen islands and counters. A hallmark of modern luxury design, fabricated seamlessly from a single slab match.',
    icon: '💧',
  },
  {
    title: 'Vanities & Bathrooms',
    desc: 'Bathroom vanity tops, shower niches, tub surrounds, and feature walls in marble, granite, or travertine. We template on-site for a perfect fit every time.',
    icon: '🛁',
  },
  {
    title: 'Staircase Cladding',
    desc: 'Stone treads, risers, and side panels that transform staircases into architectural statements. Available in honed, polished, or leathered finishes.',
    icon: '🪜',
  },
  {
    title: 'Wall Cladding',
    desc: 'Interior and exterior stone cladding for feature walls, entrances, columns, and facades. Adds texture, depth, and a timeless quality to any space.',
    icon: '🧱',
  },
  {
    title: 'Pool Edge Coping',
    desc: 'Slip-resistant marble and granite coping around pool perimeters, cantilevered or bullnose edge profiles. Designed for the tropical climate of Trinidad & Tobago.',
    icon: '🏊',
  },
  {
    title: 'Fountains & Water Features',
    desc: 'Custom stone surrounds, basins, and cladding for garden fountains, courtyard water features, and commercial lobby installations.',
    icon: '⛲',
  },
  {
    title: 'Flooring',
    desc: 'Large-format stone floor tiles for living areas, lobbies, patios, and commercial spaces. Granite, marble, limestone, and travertine available in a range of finishes.',
    icon: '🏛',
  },
];

const clientTypes = [
  {
    type: 'Residential',
    desc: 'Homeowners looking for premium finishes — from kitchen renovations to full interior stone packages.',
    items: ['Kitchen countertops & backsplashes', 'Bathroom vanities & feature walls', 'Staircases & flooring', 'Outdoor entertainment areas'],
  },
  {
    type: 'Hospitality',
    desc: 'Hotels, restaurants, bars, and event venues across Trinidad & Tobago seeking distinctive stone interiors.',
    items: ['Restaurant bar tops & feature walls', 'Hotel lobby flooring & cladding', 'Pool deck coping & surrounds', 'Nightclub & lounge feature elements'],
  },
  {
    type: 'Commercial',
    desc: 'Office buildings, retail spaces, and commercial developments requiring high-specification stone finishes.',
    items: ['Office lobby feature walls', 'Reception desk cladding', 'Commercial bathroom stone', 'Retail display surfaces'],
  },
  {
    type: 'Housing Developments',
    desc: 'Property developers and contractors fitting out multiple units efficiently and to a consistent standard.',
    items: ['Bulk kitchen top supply & installation', 'Bathroom vanity packages', 'Consistent finish across all units', 'Project management support'],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <PageWrapper>
        {/* Hero */}
        <div className='border-b border-border bg-surface'>
          <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-8 bg-gold' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-gold'>What We Do</span>
            </div>
            <h1 className='font-display text-5xl md:text-6xl font-semibold leading-tight max-w-2xl'>
              Stone, Supplied &<br />
              <span className='text-gold-gradient'>Expertly Installed.</span>
            </h1>
            <p className='mt-6 text-foreground-muted text-base leading-relaxed max-w-xl'>
              From a single kitchen countertop to a complete hospitality fit-out — World of Stone handles every aspect of stone supply, fabrication, and installation across Trinidad & Tobago.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <section className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='h-px w-8 bg-gold' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-gold'>Installation Services</span>
          </div>
          <h2 className='font-display text-4xl font-light text-foreground mb-14 leading-tight'>What We Install</h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border'>
            {services.map((svc) => (
              <div key={svc.title} className='bg-background p-8 group hover:bg-surface transition-colors duration-200'>
                <div className='text-3xl mb-5'>{svc.icon}</div>
                <div className='w-8 h-px bg-gold/40 group-hover:bg-gold mb-5 transition-colors duration-300' />
                <h3 className='font-display text-xl font-semibold text-foreground mb-3 group-hover:text-gold transition-colors duration-300'>{svc.title}</h3>
                <p className='text-foreground-muted text-sm leading-relaxed'>{svc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Client Types */}
        <section className='bg-surface border-t border-border'>
          <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-8 bg-gold' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-gold'>Who We Serve</span>
            </div>
            <h2 className='font-display text-4xl font-light text-foreground mb-14 leading-tight'>Built for Every Client</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {clientTypes.map((ct) => (
                <div key={ct.type} className='border border-border p-8 group hover:border-gold/40 transition-colors duration-200'>
                  <h3 className='font-display text-2xl font-semibold text-gold mb-2'>{ct.type}</h3>
                  <p className='text-foreground-muted text-sm leading-relaxed mb-6'>{ct.desc}</p>
                  <ul className='space-y-2'>
                    {ct.items.map((item) => (
                      <li key={item} className='flex items-start gap-3 text-sm text-foreground-muted'>
                        <HiCheckCircle size={16} className='text-gold/70 mt-0.5 shrink-0' />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className='max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center'>
          <div className='h-px w-12 bg-gold mx-auto mb-8' />
          <h2 className='font-display text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight'>
            Ready to Start
            <br />
            <span className='text-gold-gradient italic'>Your Project?</span>
          </h2>
          <p className='text-foreground-muted text-sm leading-relaxed max-w-md mx-auto mb-10'>
            Contact us to discuss your project, request a quote, or visit our showroom. We work with clients across Trinidad & Tobago.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link href='/contact' className='px-8 py-3 text-sm font-medium border border-gold/60 bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all duration-200 tracking-wider uppercase inline-flex items-center gap-2'>
              Get a Quote
              <HiArrowRight size={14} />
            </Link>
            <Link href='/catalog' className='px-8 py-3 text-sm font-medium border border-border text-foreground-muted hover:text-foreground hover:border-foreground/30 transition-all duration-200 tracking-wider uppercase'>
              Browse Materials
            </Link>
          </div>
        </section>
      </PageWrapper>
      <Footer />
      <WhatsAppButton variant='floating' />
    </>
  );
}
