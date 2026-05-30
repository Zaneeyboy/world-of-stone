'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiViewGrid, HiCollection, HiPhotograph, HiSpeakerphone, HiClipboardList, HiUserGroup, HiChartBar, HiX, HiExternalLink } from 'react-icons/hi';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: HiViewGrid, exact: true, soon: false },
  { href: '/admin/products', label: 'Products', icon: HiCollection, exact: false, soon: false },
  { href: '/admin/projects', label: 'Projects', icon: HiPhotograph, exact: false, soon: false },
  { href: '/admin/promotions', label: 'Promotions', icon: HiSpeakerphone, exact: false, soon: false },
  { href: '/admin/jobs', label: 'Jobs & Quotes', icon: HiClipboardList, exact: false, soon: false },
  { href: '/admin/clients', label: 'Clients', icon: HiUserGroup, exact: false, soon: false },
  { href: '/admin/reports', label: 'Reports', icon: HiChartBar, exact: false, soon: false },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className='fixed inset-0 z-40 bg-black/60 lg:hidden' onClick={onClose} />}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-56 bg-surface border-r border-border flex flex-col transition-transform duration-200 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className='h-16 flex items-center justify-between px-5 border-b border-border flex-shrink-0'>
          <Link href='/' className='flex items-center gap-2.5 group'>
            <span className='w-7 h-7 rounded bg-gold flex items-center justify-center text-background font-bold text-xs font-display'>W</span>
            <span className='font-display font-semibold text-sm group-hover:text-gold transition-colors duration-150'>World of Stone</span>
          </Link>
          <button onClick={onClose} className='lg:hidden text-foreground-muted hover:text-foreground transition-colors' aria-label='Close menu'>
            <HiX size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className='flex-1 overflow-y-auto py-5'>
          <p className='px-5 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted'>Navigation</p>
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            if (item.soon) {
              return (
                <span key={item.href} className='flex items-center gap-3 px-5 py-2.5 text-sm text-foreground-muted/40 cursor-not-allowed select-none'>
                  <item.icon size={15} />
                  <span className='flex-1'>{item.label}</span>
                  <span className='text-[9px] uppercase tracking-wider bg-border/50 text-foreground-muted/60 px-1.5 py-0.5 rounded'>Soon</span>
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors duration-150 ${
                  active ? 'text-gold bg-gold/8 border-r-2 border-gold font-medium' : 'text-foreground-muted hover:text-foreground hover:bg-white/4'
                }`}
              >
                <item.icon size={15} className={active ? 'text-gold' : ''} />
                <span className='flex-1'>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className='px-5 py-4 border-t border-border flex-shrink-0'>
          <Link href='/' className='flex items-center gap-2 text-xs text-foreground-muted hover:text-foreground transition-colors duration-150'>
            <HiExternalLink size={12} />
            View Live Site
          </Link>
        </div>
      </aside>
    </>
  );
}
