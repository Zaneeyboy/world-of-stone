'use client';

import Link from 'next/link';
import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import type { Project } from '@/types';
import { motion } from 'framer-motion';

const categoryLabel: Record<Project['category'], string> = {
  kitchen: 'Kitchen',
  flooring: 'Flooring',
  commercial: 'Commercial',
  bathroom: 'Bathroom',
  outdoor: 'Outdoor',
  other: 'Other',
};

interface RecentProjectsProps {
  projects: Project[];
}

export default function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <section className='py-24 bg-surface border-y border-border'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14'>
          <div>
            <div className='flex items-center gap-3 mb-3'>
              <div className='h-px w-8 bg-gold' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-gold'>Our Work</span>
            </div>
            <h2 className='font-display text-4xl md:text-5xl font-semibold'>Recent Projects</h2>
          </div>
          <Link href='/projects' className='flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors font-medium uppercase tracking-wider whitespace-nowrap'>
            View All Projects
            <HiArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        {projects.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {projects.map((project, i) => (
              <motion.article
                key={project.id}
                className='group relative overflow-hidden border border-border hover:border-gold/40 transition-all duration-300'
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
              >
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
                  {/* Category badge */}
                  <span className='absolute top-3 left-3 px-2 py-0.5 bg-background/80 backdrop-blur-sm text-[10px] font-medium uppercase tracking-wider text-gold border border-gold/30'>
                    {categoryLabel[project.category]}
                  </span>
                </div>

                {/* Content */}
                <div className='p-5'>
                  <h3 className='font-display text-xl font-semibold mb-2 group-hover:text-gold transition-colors duration-200'>{project.title}</h3>
                  <p className='text-sm text-foreground-muted line-clamp-2'>{project.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className='py-20 text-center border border-border'>
            <p className='text-foreground-muted text-sm'>Projects coming soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}
