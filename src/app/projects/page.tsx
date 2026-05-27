import type { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PageWrapper from '@/components/PageWrapper';
import { getProjects } from '@/lib/firestore';
import type { Project } from '@/types';

export const metadata: Metadata = {
  title: 'Our Projects',
  description: 'Browse our portfolio of completed stone installation projects — kitchens, flooring, commercial spaces, and more.',
};

export const revalidate = 60;

const categoryLabel: Record<Project['category'], string> = {
  kitchen: 'Kitchen',
  flooring: 'Flooring',
  commercial: 'Commercial',
  bathroom: 'Bathroom',
  outdoor: 'Outdoor',
  other: 'Other',
};

const categoryFilters = ['All', 'Kitchen', 'Flooring', 'Commercial', 'Bathroom', 'Outdoor'];

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => []);

  return (
    <>
      <Navbar />
      <PageWrapper>
        {/* Header */}
        <div className='border-b border-border bg-surface'>
          <div className='max-w-7xl mx-auto px-6 lg:px-8 py-16'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-8 bg-gold' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-gold'>Our Work</span>
            </div>
            <h1 className='font-display text-4xl md:text-5xl font-semibold mb-3'>Client Projects</h1>
            <p className='text-foreground-muted max-w-xl text-sm leading-relaxed'>
              Real stone installations completed for residential and commercial clients. Each project is a testament to the quality of our materials and craftsmanship.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className='max-w-7xl mx-auto px-6 lg:px-8 py-16'>
          {projects.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {projects.map((project) => (
                <article key={project.id} className='group relative overflow-hidden border border-border hover:border-gold/40 transition-all duration-300'>
                  {/* Image */}
                  <div className='relative aspect-[4/3] overflow-hidden bg-surface-2'>
                    {project.images[0] ? (
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                        className='object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                    ) : (
                      <div className='absolute inset-0 bg-surface-2 stone-texture' />
                    )}
                    <span className='absolute top-3 left-3 px-2 py-0.5 bg-background/80 backdrop-blur-sm text-[10px] font-medium uppercase tracking-wider text-gold border border-gold/30'>
                      {categoryLabel[project.category]}
                    </span>
                  </div>

                  {/* Content */}
                  <div className='p-6'>
                    <h2 className='font-display text-2xl font-semibold mb-2 group-hover:text-gold transition-colors duration-200'>{project.title}</h2>
                    <p className='text-sm text-foreground-muted leading-relaxed'>{project.description}</p>

                    {/* Before/after if available */}
                    {project.beforeImages && project.beforeImages.length > 0 && (
                      <div className='mt-4 grid grid-cols-2 gap-2'>
                        <div className='relative aspect-video overflow-hidden border border-border'>
                          <Image src={project.beforeImages[0]} alt='Before' fill sizes='200px' className='object-cover' />
                          <span className='absolute bottom-1 left-1 text-[10px] bg-background/80 px-1 text-foreground-muted'>Before</span>
                        </div>
                        <div className='relative aspect-video overflow-hidden border border-border'>
                          <Image src={project.images[0]} alt='After' fill sizes='200px' className='object-cover' />
                          <span className='absolute bottom-1 left-1 text-[10px] bg-background/80 px-1 text-foreground-muted'>After</span>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className='py-32 text-center border border-border'>
              <p className='font-display text-3xl font-semibold mb-3'>Projects Coming Soon</p>
              <p className='text-foreground-muted text-sm'>We are currently loading our portfolio. Check back shortly.</p>
            </div>
          )}
        </div>
      </PageWrapper>
      <Footer />
      <WhatsAppButton variant='floating' />
    </>
  );
}
