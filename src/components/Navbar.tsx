'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HiMenu, HiX, HiLockClosed } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Materials' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-[rgba(11,11,11,0.92)] backdrop-blur-md border-b border-border transition-all duration-300 ${scrolled ? 'shadow-xl shadow-black/40' : ''}`}>
      <nav className='max-w-7xl mx-auto px-6 lg:px-8 h-18 flex items-center justify-between'>
        {/* Logo */}
        <Link href='/' className='flex items-center group'>
          <span className='font-display text-xl font-light tracking-wide text-white group-hover:text-white/80 transition-colors'>
            World <span className='text-gold-light italic'>of Stone</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className='hidden md:flex items-center gap-8'>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm tracking-wider uppercase font-medium transition-colors duration-200 ${pathname === link.href ? 'text-gold' : 'text-white/45 hover:text-white'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className='hidden md:flex items-center gap-3'>
          <Link href='/admin/login' className='p-2 text-white/20 hover:text-white/55 transition-colors' aria-label='Admin'>
            <HiLockClosed size={15} />
          </Link>
          <Link
            href='/contact'
            className='px-5 py-2 text-sm font-medium border border-gold/60 bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all duration-200 tracking-wider uppercase'
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className='md:hidden p-2 text-white/70 hover:text-white transition-colors' aria-label='Toggle menu'>
          {open ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className='md:hidden bg-[rgba(11,11,11,0.97)] border-t border-border overflow-hidden'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <ul className='px-6 py-6 flex flex-col gap-5'>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`text-base tracking-wider uppercase font-medium transition-colors ${pathname === link.href ? 'text-gold' : 'text-white/50 hover:text-white'}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href='/contact'
                  className='inline-block mt-2 px-5 py-2 text-sm font-medium border border-gold/60 bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all duration-200 tracking-wider uppercase'
                >
                  Get a Quote
                </Link>
              </li>
              <li className='pt-2 border-t border-border'>
                <Link href='/admin/login' className='flex items-center gap-2 text-xs text-white/25 hover:text-white/50 transition-colors uppercase tracking-wider'>
                  <HiLockClosed size={12} />
                  Admin
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
