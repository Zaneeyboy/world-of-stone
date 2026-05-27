import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PageWrapper from '@/components/PageWrapper';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about World of Stone — our story, experience, and commitment to premium stone materials across South Africa.',
};

const milestones = [
  { year: '2012', desc: 'Founded in Johannesburg as a local stone reseller.' },
  { year: '2015', desc: 'Expanded into full installation services for residential clients.' },
  { year: '2018', desc: 'Entered commercial contracts — retail stores, hotels, and office lobbies.' },
  { year: '2022', desc: 'Reached 400+ projects milestone with a growing team of specialist installers.' },
  { year: '2025', desc: 'Launched expanded online catalog for nationwide supply and inquiry.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PageWrapper>
        {/* Hero */}
        <div className='border-b border-border bg-surface'>
          <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-8 bg-gold' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-gold'>Our Story</span>
            </div>
            <h1 className='font-display text-5xl md:text-6xl font-semibold leading-tight max-w-2xl'>
              Built on Stone. <br />
              <span className='text-gold-gradient'>Built to Last.</span>
            </h1>
          </div>
        </div>

        {/* Body */}
        <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
            {/* Story */}
            <div>
              <h2 className='font-display text-3xl font-semibold mb-6'>Who We Are</h2>
              <div className='space-y-4 text-foreground-muted text-sm leading-relaxed'>
                <p>
                  World of Stone is a premium supplier and installer of natural stone materials based in South Africa. We source granite, marble, quartz, limestone, travertine, sandstone, and slate
                  from trusted quarries and partners — and supply them directly to homeowners, contractors, architects, and developers.
                </p>
                <p>
                  What started in 2012 as a local stone reseller has grown into a full-service stone company capable of handling projects from a single kitchen countertop to entire commercial floor
                  installations.
                </p>
                <p>
                  We believe that great stone is not just a surface — it is a statement. Every slab we supply is selected for its quality, consistency, and visual character. We take pride in matching
                  the right material to the right project.
                </p>
              </div>

              {/* Stats */}
              <div className='grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-border'>
                {[
                  { value: '500+', label: 'Projects' },
                  { value: '12+', label: 'Years' },
                  { value: '50+', label: 'Stone Varieties' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className='font-display text-4xl font-semibold text-gold'>{stat.value}</p>
                    <p className='text-xs text-foreground-muted uppercase tracking-wider mt-1'>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h2 className='font-display text-3xl font-semibold mb-8'>Our Journey</h2>
              <div className='relative pl-6 border-l border-border'>
                {milestones.map((m, i) => (
                  <div key={m.year} className={`relative pb-8 ${i === milestones.length - 1 ? '' : ''}`}>
                    {/* Dot */}
                    <div className='absolute -left-[25px] top-0 w-3 h-3 rounded-full bg-gold border-2 border-background' />
                    <p className='text-xs font-semibold text-gold uppercase tracking-widest mb-1'>{m.year}</p>
                    <p className='text-sm text-foreground-muted leading-relaxed'>{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className='mt-20 pt-16 border-t border-border'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
              <div>
                <h2 className='font-display text-3xl font-semibold mb-4'>Where We Are</h2>
                <p className='text-foreground-muted text-sm leading-relaxed mb-6'>
                  Our showroom and yard is based in Johannesburg, Gauteng. We supply and install across Johannesburg, Pretoria, and the wider Gauteng region. Enquire for out-of-region delivery.
                </p>
                <div className='space-y-2 text-sm text-foreground-muted'>
                  <p>
                    <span className='text-foreground font-medium'>Location:</span> Johannesburg, Gauteng, South Africa
                  </p>
                  <p>
                    <span className='text-foreground font-medium'>Service Area:</span> Gauteng, with nationwide supply
                  </p>
                  <p>
                    <span className='text-foreground font-medium'>Hours:</span> Mon–Fri: 8am–5pm, Sat: 9am–1pm
                  </p>
                </div>
              </div>

              {/* Map placeholder */}
              <div className='aspect-video border border-border bg-surface-2 flex items-center justify-center stone-texture'>
                <span className='text-xs text-foreground-muted uppercase tracking-widest'>Map — Johannesburg, SA</span>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
      <Footer />
      <WhatsAppButton variant='floating' />
    </>
  );
}
