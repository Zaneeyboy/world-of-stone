'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Materials' },
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
    <header className={`fixed top-0 left-0 right-0 z-50 bg-[#0F0F10]/95 backdrop-blur-sm border-b border-white/[0.07] transition-all duration-300 ${scrolled ? 'shadow-xl shadow-black/30' : ''}`}>
      <nav className='max-w-7xl mx-auto px-6 lg:px-8 h-18 flex items-center justify-between'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-3 group'>
          <span className='w-8 h-8 bg-[#b08d57] flex items-center justify-center text-white font-bold text-sm font-display'>W</span>
          <span className='font-display text-xl font-semibold tracking-wide text-white group-hover:text-white/75 transition-colors'>World of Stone</span>
        </Link>

        {/* Desktop nav */}
        <ul className='hidden md:flex items-center gap-8'>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm tracking-wider uppercase font-medium transition-colors duration-200 ${pathname === link.href ? 'text-[#b08d57]' : 'text-white/45 hover:text-white'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className='hidden md:flex items-center gap-4'>
          <Link href='/contact' className='px-5 py-2 text-sm font-medium border border-[#b08d57]/60 text-[#b08d57] hover:bg-[#b08d57] hover:text-white transition-all duration-200 tracking-wider uppercase'>
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
            className='md:hidden bg-[#0F0F10] border-t border-white/[0.07] overflow-hidden'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <ul className='px-6 py-6 flex flex-col gap-5'>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`text-base tracking-wider uppercase font-medium transition-colors ${pathname === link.href ? 'text-[#b08d57]' : 'text-white/50 hover:text-white'}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href='/contact'
                  className='inline-block mt-2 px-5 py-2 text-sm font-medium border border-[#b08d57]/60 text-[#b08d57] hover:bg-[#b08d57] hover:text-white transition-all duration-200 tracking-wider uppercase'
                >
                  Get a Quote
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
