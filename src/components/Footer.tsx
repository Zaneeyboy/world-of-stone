import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '27000000000';

export default function Footer() {
  return (
    <footer className='bg-surface-2 border-t border-border mt-auto'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
          {/* Brand */}
          <div className='lg:col-span-2'>
            <div className='flex items-center gap-3 mb-4'>
              <span className='w-8 h-8 bg-gold flex items-center justify-center text-black font-bold text-sm font-display'>W</span>
              <span className='font-display text-xl font-semibold tracking-wide text-foreground'>World of Stone</span>
            </div>
            <p className='text-foreground-muted text-sm leading-relaxed max-w-xs'>
              Premium granite, marble, and natural stone materials for construction, kitchens, interiors, and commercial projects across South Africa.
            </p>
            <div className='flex items-center gap-4 mt-6'>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 flex items-center justify-center border border-border hover:border-gold hover:text-gold text-foreground-muted transition-colors'
                aria-label='WhatsApp'
              >
                <FaWhatsapp size={18} />
              </a>
              <a href='#' className='w-10 h-10 flex items-center justify-center border border-border hover:border-gold hover:text-gold text-foreground-muted transition-colors' aria-label='Instagram'>
                <FaInstagram size={18} />
              </a>
              <a href='#' className='w-10 h-10 flex items-center justify-center border border-border hover:border-gold hover:text-gold text-foreground-muted transition-colors' aria-label='Facebook'>
                <FaFacebookF size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className='text-xs font-semibold tracking-widest uppercase text-foreground-muted mb-5'>Navigation</h3>
            <ul className='flex flex-col gap-3'>
              {[
                { href: '/catalog', label: 'Material Catalog' },
                { href: '/projects', label: 'Our Projects' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/admin', label: 'Admin' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className='text-sm text-foreground-muted hover:text-foreground transition-colors'>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          <div>
            <h3 className='text-xs font-semibold tracking-widest uppercase text-foreground-muted mb-5'>Materials</h3>
            <ul className='flex flex-col gap-3'>
              {['Granite', 'Marble', 'Quartz', 'Exotic Stone', 'Sandstone', 'Slate'].map((mat) => (
                <li key={mat}>
                  <Link href={`/catalog?material=${mat.toLowerCase()}`} className='text-sm text-foreground-muted hover:text-foreground transition-colors'>
                    {mat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-xs text-foreground-muted/50'>&copy; {new Date().getFullYear()} World of Stone. All rights reserved.</p>
          <p className='text-xs text-foreground-muted/50'>
            Built by{' '}
            <a href='https://xenoviatech.com' target='_blank' rel='noopener noreferrer' className='text-foreground-muted hover:text-foreground transition-colors'>
              Xenovia Tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
