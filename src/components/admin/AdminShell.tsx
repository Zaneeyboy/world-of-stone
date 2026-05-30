'use client';

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from './AdminSidebar';
import { HiMenu, HiLogout } from 'react-icons/hi';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function AdminShell({ title, children }: Props) {
  return (
    <AdminGuard>
      <ShellInner title={title}>{children}</ShellInner>
    </AdminGuard>
  );
}

function ShellInner({ title, children }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/admin/login');
  };

  return (
    <div className='min-h-screen bg-background'>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content area — offset by sidebar width on desktop */}
      <div className='lg:pl-56'>
        {/* Top bar */}
        <header className='sticky top-0 z-30 h-16 bg-surface border-b border-border flex items-center justify-between px-6 flex-shrink-0'>
          <div className='flex items-center gap-3'>
            <button onClick={() => setSidebarOpen(true)} className='lg:hidden text-foreground-muted hover:text-foreground transition-colors' aria-label='Open menu'>
              <HiMenu size={20} />
            </button>
            <h1 className='font-display text-lg font-semibold'>{title}</h1>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-xs text-foreground-muted hidden sm:block truncate max-w-[200px]'>{user?.email}</span>
            <button onClick={handleLogout} className='flex items-center gap-2 px-3 py-1.5 border border-border hover:border-red-800 text-foreground-muted hover:text-red-400 text-xs transition-colors'>
              <HiLogout size={13} />
              <span className='hidden sm:inline'>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
