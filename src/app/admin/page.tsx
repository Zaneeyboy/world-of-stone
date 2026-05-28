'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import { getAllProductsAdmin, getProjects, getActivePromotions, getJobStats } from '@/lib/firestore';
import { HiCollection, HiPhotograph, HiSpeakerphone, HiEye, HiLogout, HiPlus, HiClipboardList } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    hiddenProducts: 0,
    totalProjects: 0,
    activePromotions: 0,
    totalViews: 0,
    topProducts: [] as { name: string; viewCount: number; inquiryCount: number }[],
    totalJobs: 0,
    pipelineValueTTD: 0,
    totalRevenueTTD: 0,
    jobsByStatus: {} as Record<string, number>,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [products, projects, promotions, jobStats] = await Promise.all([getAllProductsAdmin(), getProjects(), getActivePromotions(), getJobStats()]);

        const totalViews = products.reduce((s, p) => s + (p.viewCount ?? 0), 0);
        const topProducts = [...products]
          .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
          .slice(0, 10)
          .map((p) => ({ name: p.name, viewCount: p.viewCount, inquiryCount: p.inquiryCount }));

        setStats({
          totalProducts: products.length,
          hiddenProducts: products.filter((p) => p.hidden).length,
          totalProjects: projects.length,
          activePromotions: promotions.length,
          totalViews,
          topProducts,
          totalJobs: Object.values(jobStats.byStatus).reduce((a, b) => a + b, 0),
          pipelineValueTTD: jobStats.pipelineValueTTD,
          totalRevenueTTD: jobStats.totalRevenueTTD,
          jobsByStatus: jobStats.byStatus,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/admin/login');
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Admin Nav */}
      <header className='sticky top-0 z-40 bg-surface border-b border-border'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link href='/' className='flex items-center gap-2'>
              <span className='w-7 h-7 rounded bg-gold flex items-center justify-center text-background font-bold text-xs font-display'>W</span>
              <span className='font-display font-semibold hidden sm:block'>World of Stone</span>
            </Link>
            <span className='text-border'>|</span>
            <span className='text-xs text-foreground-muted uppercase tracking-widest'>Admin</span>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-xs text-foreground-muted hidden sm:block'>{user?.email}</span>
            <button onClick={handleLogout} className='flex items-center gap-2 px-3 py-1.5 border border-border hover:border-red-800 text-foreground-muted hover:text-red-400 text-xs transition-colors'>
              <HiLogout size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-6 py-10'>
        <h1 className='font-display text-3xl font-semibold mb-2'>Dashboard</h1>
        <p className='text-foreground-muted text-sm mb-10'>Overview of your catalog and activity.</p>

        {/* Stats */}
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10'>
          {[
            { label: 'Total Products', value: stats.totalProducts, icon: HiCollection, color: 'text-gold' },
            { label: 'Hidden Products', value: stats.hiddenProducts, icon: HiCollection, color: 'text-foreground-muted' },
            { label: 'Projects', value: stats.totalProjects, icon: HiPhotograph, color: 'text-gold' },
            { label: 'Active Promotions', value: stats.activePromotions, icon: HiSpeakerphone, color: 'text-gold' },
            { label: 'Total Jobs', value: stats.totalJobs, icon: HiClipboardList, color: 'text-gold' },
            { label: 'Pipeline (TTD)', value: stats.pipelineValueTTD > 0 ? `$${Math.round(stats.pipelineValueTTD / 1000)}k` : '0', icon: HiClipboardList, color: 'text-gold' },
          ].map((stat) => (
            <div key={stat.label} className='bg-surface border border-border p-5'>
              <div className='flex items-center justify-between mb-3'>
                <p className='text-xs text-foreground-muted uppercase tracking-wider'>{stat.label}</p>
                <stat.icon size={16} className={stat.color} />
              </div>
              <p className={`font-display text-3xl font-semibold ${loading ? 'opacity-20' : ''} ${stat.color}`}>{loading ? '—' : stat.value}</p>
            </div>
          ))}
        </div>

        {/* Total views stat */}
        <div className='bg-surface border border-border p-5 mb-10'>
          <div className='flex items-center justify-between mb-1'>
            <p className='text-xs text-foreground-muted uppercase tracking-wider'>Total Product Views</p>
            <HiEye size={16} className='text-gold' />
          </div>
          <p className={`font-display text-4xl font-semibold text-gold ${loading ? 'opacity-20' : ''}`}>{loading ? '—' : stats.totalViews.toLocaleString()}</p>
        </div>

        {/* Quick actions */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10'>
          <Link href='/admin/products' className='flex items-center gap-3 p-5 border border-border hover:border-gold bg-surface transition-all duration-200 group'>
            <HiCollection size={20} className='text-gold' />
            <div>
              <p className='text-sm font-semibold group-hover:text-gold transition-colors'>Manage Products</p>
              <p className='text-xs text-foreground-muted'>Add, edit, or hide materials</p>
            </div>
          </Link>
          <Link href='/admin/projects' className='flex items-center gap-3 p-5 border border-border hover:border-gold bg-surface transition-all duration-200 group'>
            <HiPhotograph size={20} className='text-gold' />
            <div>
              <p className='text-sm font-semibold group-hover:text-gold transition-colors'>Manage Projects</p>
              <p className='text-xs text-foreground-muted'>Add client work & portfolio</p>
            </div>
          </Link>
          <Link href='/admin/promotions' className='flex items-center gap-3 p-5 border border-border hover:border-gold bg-surface transition-all duration-200 group'>
            <HiSpeakerphone size={20} className='text-gold' />
            <div>
              <p className='text-sm font-semibold group-hover:text-gold transition-colors'>Promotions</p>
              <p className='text-xs text-foreground-muted'>Manage banners & offers</p>
            </div>
          </Link>
          <Link href='/admin/jobs' className='flex items-center gap-3 p-5 border border-border hover:border-gold bg-surface transition-all duration-200 group'>
            <HiClipboardList size={20} className='text-gold' />
            <div>
              <p className='text-sm font-semibold group-hover:text-gold transition-colors'>Jobs & Quotes</p>
              <p className='text-xs text-foreground-muted'>Create and manage client quotes</p>
            </div>
          </Link>
        </div>

        {/* Revenue cards */}
        {!loading && stats.totalJobs > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10'>
            <div className='bg-surface border border-border p-6'>
              <p className='text-xs text-foreground-muted uppercase tracking-wider mb-2'>Pipeline Value (TTD)</p>
              <p className='font-display text-3xl font-semibold text-gold'>
                TTD {stats.pipelineValueTTD.toLocaleString('en-TT', { minimumFractionDigits: 2 })}
              </p>
              <p className='text-xs text-foreground-muted mt-1'>Active quotes + accepted + in progress</p>
            </div>
            <div className='bg-surface border border-border p-6'>
              <p className='text-xs text-foreground-muted uppercase tracking-wider mb-2'>Total Revenue (TTD)</p>
              <p className='font-display text-3xl font-semibold text-gold'>
                TTD {stats.totalRevenueTTD.toLocaleString('en-TT', { minimumFractionDigits: 2 })}
              </p>
              <p className='text-xs text-foreground-muted mt-1'>Completed + invoiced + paid jobs</p>
            </div>
          </div>
        )}

        {/* Job pipeline status breakdown */}
        {!loading && stats.totalJobs > 0 && (
          <div className='bg-surface border border-border p-6 mb-10'>
            <h2 className='font-display text-lg font-semibold mb-5'>Job Pipeline</h2>
            <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3'>
              {[
                { key: 'quote', label: 'Quote', color: 'text-blue-400' },
                { key: 'accepted', label: 'Accepted', color: 'text-teal-400' },
                { key: 'in_progress', label: 'In Progress', color: 'text-amber-400' },
                { key: 'completed', label: 'Completed', color: 'text-emerald-400' },
                { key: 'invoiced', label: 'Invoiced', color: 'text-purple-400' },
                { key: 'paid', label: 'Paid', color: 'text-green-400' },
                { key: 'cancelled', label: 'Cancelled', color: 'text-red-400' },
              ].map((s) => (
                <div key={s.key} className='text-center p-3 border border-border'>
                  <p className={`font-display text-2xl font-semibold ${s.color}`}>{stats.jobsByStatus[s.key] ?? 0}</p>
                  <p className='text-[10px] text-foreground-muted uppercase tracking-wider mt-1'>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top products */}
        {!loading && stats.topProducts.length > 0 && (
          <div className='bg-surface border border-border p-6 mb-8'>
            <h2 className='font-display text-xl font-semibold mb-5'>Top Products by Views</h2>
            <div className='space-y-3'>
              {stats.topProducts.map((p, i) => (
                <div key={p.name} className='flex items-center justify-between py-2 border-b border-border last:border-0'>
                  <div className='flex items-center gap-3'>
                    <span className='text-xs text-foreground-muted w-5'>#{i + 1}</span>
                    <span className='text-sm'>{p.name}</span>
                  </div>
                  <div className='flex items-center gap-6 text-xs text-foreground-muted'>
                    <span>{p.viewCount} views</span>
                    <span>{p.inquiryCount} inquiries</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics charts */}
        {!loading && stats.topProducts.length > 0 && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Views chart */}
            <div className='bg-surface border border-border p-6'>
              <h2 className='font-display text-lg font-semibold mb-6'>Views by Product</h2>
              <ResponsiveContainer width='100%' height={260}>
                <BarChart data={stats.topProducts} margin={{ top: 4, right: 8, left: -20, bottom: 60 }}>
                  <XAxis dataKey='name' tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }} angle={-35} textAnchor='end' interval={0} />
                  <YAxis tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 12 }} cursor={{ fill: 'rgba(201,168,76,0.06)' }} />
                  <Bar dataKey='viewCount' name='Views' radius={[2, 2, 0, 0]}>
                    {stats.topProducts.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? 'var(--gold)' : 'var(--stone)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Inquiries chart */}
            <div className='bg-surface border border-border p-6'>
              <h2 className='font-display text-lg font-semibold mb-6'>Inquiries by Product</h2>
              <ResponsiveContainer width='100%' height={260}>
                <BarChart data={stats.topProducts} margin={{ top: 4, right: 8, left: -20, bottom: 60 }}>
                  <XAxis dataKey='name' tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }} angle={-35} textAnchor='end' interval={0} />
                  <YAxis tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 12 }} cursor={{ fill: 'rgba(201,168,76,0.06)' }} />
                  <Bar dataKey='inquiryCount' name='Inquiries' radius={[2, 2, 0, 0]}>
                    {stats.topProducts.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? '#e8c97a' : '#4a4840'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
