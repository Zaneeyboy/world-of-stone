'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HiArrowLeft } from 'react-icons/hi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/admin');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className='min-h-screen flex items-center justify-center bg-background px-6 pt-24 pb-16'>
        <div className='w-full max-w-sm'>
          {/* Back link */}
          <Link href='/' className='inline-flex items-center gap-2 text-xs text-foreground-muted hover:text-gold transition-colors uppercase tracking-widest mb-8'>
            <HiArrowLeft size={14} />
            Back to Site
          </Link>

          {/* Logo */}
          <div className='flex items-center gap-3 mb-10'>
            <span className='w-10 h-10 bg-gold flex items-center justify-center text-background font-bold font-display text-lg'>W</span>
            <div>
              <p className='font-display text-xl font-semibold'>World of Stone</p>
              <p className='text-xs text-foreground-muted uppercase tracking-widest'>Admin Portal</p>
            </div>
          </div>

          {/* Card */}
          <div className='border border-border bg-surface p-8'>
            <h1 className='font-display text-2xl font-semibold mb-6'>Sign In</h1>

            {error && <div className='mb-5 px-4 py-3 border border-red-900 bg-red-950/30 text-red-400 text-sm'>{error}</div>}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-2 block'>Email</label>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete='email'
                  placeholder='admin@worldofstone.co.za'
                  className='w-full bg-background border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-gold placeholder-foreground-muted/50 transition-colors'
                />
              </div>

              <div>
                <label className='text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-2 block'>Password</label>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete='current-password'
                  placeholder='••••••••'
                  className='w-full bg-background border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-gold placeholder-foreground-muted/50 transition-colors'
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full py-3 bg-gold hover:bg-gold-light text-background font-semibold text-sm tracking-wider uppercase transition-colors mt-2 disabled:opacity-60'
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
