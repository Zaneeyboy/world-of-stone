'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { getAllProductsAdmin, getProjects, getActivePromotions, getJobStats, getRevenueByMonth } from '@/lib/firestore';
import type { RevenueMonth } from '@/lib/firestore';
import { HiCollection, HiPhotograph, HiSpeakerphone, HiEye, HiPlus, HiClipboardList, HiChevronRight, HiCurrencyDollar } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  return (
    <AdminShell title='Dashboard'>
      <DashboardContent />
    </AdminShell>
  );
}

function DashboardContent() {
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
  const [revenueData, setRevenueData] = useState<RevenueMonth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [products, projects, promotions, jobStats, revenue] = await Promise.all([getAllProductsAdmin(), getProjects(), getActivePromotions(), getJobStats(), getRevenueByMonth(6)]);

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
        setRevenueData(revenue);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className='max-w-7xl mx-auto px-6 py-10'>
      <div className='mb-10'>
        <h1 className='font-display text-3xl font-semibold tracking-tight'>Dashboard</h1>
        <p className='text-foreground-muted text-sm mt-1'>Welcome back — here's an overview of your catalog and business.</p>
      </div>

      {/* Stats grid */}
      <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-10'>
        {[
          { label: 'Total Products', value: stats.totalProducts, icon: HiCollection, color: 'text-gold' },
          { label: 'Hidden Products', value: stats.hiddenProducts, icon: HiEye, color: 'text-foreground-muted' },
          { label: 'Projects', value: stats.totalProjects, icon: HiPhotograph, color: 'text-gold' },
          { label: 'Active Promotions', value: stats.activePromotions, icon: HiSpeakerphone, color: 'text-gold' },
          { label: 'Total Jobs', value: stats.totalJobs, icon: HiClipboardList, color: 'text-gold' },
          {
            label: 'Pipeline (TTD)',
            value: stats.pipelineValueTTD > 0 ? `$${Math.round(stats.pipelineValueTTD / 1000)}k` : '0',
            icon: HiCurrencyDollar,
            color: 'text-gold',
          },
        ].map((stat) => (
          <div key={stat.label} className='bg-surface border border-border p-4 flex flex-col gap-3 hover:border-gold/40 transition-colors'>
            <div className='flex items-start justify-between gap-2'>
              <p className='text-[10px] text-foreground-muted uppercase tracking-widest leading-snug'>{stat.label}</p>
              <div className='w-7 h-7 flex items-center justify-center bg-gold/10 shrink-0'>
                <stat.icon size={13} className='text-gold' />
              </div>
            </div>
            <p className={`font-display text-4xl font-bold tabular-nums ${loading ? 'opacity-20 text-foreground-muted' : stat.color}`}>{loading ? '—' : stat.value}</p>
          </div>
        ))}
      </div>

      {/* Total views */}
      <div className='bg-surface border border-border p-5 mb-10 flex items-center justify-between'>
        <div>
          <p className='text-[10px] text-foreground-muted uppercase tracking-widest mb-2'>Total Product Views (all time)</p>
          <p className={`font-display text-5xl font-bold text-gold tabular-nums ${loading ? 'opacity-20' : ''}`}>{loading ? '—' : stats.totalViews.toLocaleString()}</p>
        </div>
        <div className='w-12 h-12 flex items-center justify-center bg-gold/10'>
          <HiEye size={22} className='text-gold' />
        </div>
      </div>

      {/* Quick actions */}
      <div className='mb-10'>
        <h2 className='font-display text-xs font-semibold mb-4 text-foreground-muted uppercase tracking-widest'>Quick Actions</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
          <Link href='/admin/products' className='flex items-center gap-4 p-5 border border-border hover:border-gold/50 bg-surface hover:bg-gold/3 transition-all duration-200 group'>
            <div className='w-10 h-10 flex items-center justify-center bg-gold/10 group-hover:bg-gold/20 transition-colors shrink-0'>
              <HiCollection size={18} className='text-gold' />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-semibold group-hover:text-gold transition-colors'>Manage Products</p>
              <p className='text-xs text-foreground-muted'>Add, edit, or hide materials</p>
            </div>
            <HiChevronRight size={14} className='ml-auto text-foreground-muted group-hover:text-gold transition-colors shrink-0' />
          </Link>
          <Link href='/admin/projects' className='flex items-center gap-4 p-5 border border-border hover:border-gold/50 bg-surface hover:bg-gold/3 transition-all duration-200 group'>
            <div className='w-10 h-10 flex items-center justify-center bg-gold/10 group-hover:bg-gold/20 transition-colors shrink-0'>
              <HiPhotograph size={18} className='text-gold' />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-semibold group-hover:text-gold transition-colors'>Manage Projects</p>
              <p className='text-xs text-foreground-muted'>Client work &amp; portfolio</p>
            </div>
            <HiChevronRight size={14} className='ml-auto text-foreground-muted group-hover:text-gold transition-colors shrink-0' />
          </Link>
          <Link href='/admin/promotions' className='flex items-center gap-4 p-5 border border-border hover:border-gold/50 bg-surface hover:bg-gold/3 transition-all duration-200 group'>
            <div className='w-10 h-10 flex items-center justify-center bg-gold/10 group-hover:bg-gold/20 transition-colors shrink-0'>
              <HiSpeakerphone size={18} className='text-gold' />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-semibold group-hover:text-gold transition-colors'>Promotions</p>
              <p className='text-xs text-foreground-muted'>Banners &amp; discount offers</p>
            </div>
            <HiChevronRight size={14} className='ml-auto text-foreground-muted group-hover:text-gold transition-colors shrink-0' />
          </Link>
          <Link href='/admin/jobs' className='flex items-center gap-4 p-5 border border-border hover:border-gold/50 bg-surface hover:bg-gold/3 transition-all duration-200 group'>
            <div className='w-10 h-10 flex items-center justify-center bg-gold/10 group-hover:bg-gold/20 transition-colors shrink-0'>
              <HiClipboardList size={18} className='text-gold' />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-semibold group-hover:text-gold transition-colors'>Jobs &amp; Quotes</p>
              <p className='text-xs text-foreground-muted'>Create and track quotes</p>
            </div>
            <HiChevronRight size={14} className='ml-auto text-foreground-muted group-hover:text-gold transition-colors shrink-0' />
          </Link>
        </div>
      </div>

      {/* Revenue cards */}
      {!loading && stats.totalJobs > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10'>
          <div className='bg-surface border border-border p-6'>
            <div className='flex items-center justify-between mb-3'>
              <p className='text-[10px] text-foreground-muted uppercase tracking-widest'>Pipeline Value (TTD)</p>
              <div className='w-7 h-7 flex items-center justify-center bg-gold/10'>
                <HiCurrencyDollar size={14} className='text-gold' />
              </div>
            </div>
            <p className='font-display text-3xl font-bold text-gold'>TTD {stats.pipelineValueTTD.toLocaleString('en-TT', { minimumFractionDigits: 2 })}</p>
            <p className='text-xs text-foreground-muted mt-2'>Active quotes + accepted + in progress</p>
          </div>
          <div className='bg-surface border border-border p-6'>
            <div className='flex items-center justify-between mb-3'>
              <p className='text-[10px] text-foreground-muted uppercase tracking-widest'>Total Revenue (TTD)</p>
              <div className='w-7 h-7 flex items-center justify-center bg-gold/10'>
                <HiCurrencyDollar size={14} className='text-gold' />
              </div>
            </div>
            <p className='font-display text-3xl font-bold text-gold'>TTD {stats.totalRevenueTTD.toLocaleString('en-TT', { minimumFractionDigits: 2 })}</p>
            <p className='text-xs text-foreground-muted mt-2'>Completed + invoiced + paid jobs</p>
          </div>
        </div>
      )}

      {/* Job pipeline status breakdown */}
      {!loading && stats.totalJobs > 0 && (
        <div className='bg-surface border border-border p-6 mb-10'>
          <h2 className='font-display text-base font-semibold mb-5'>Job Pipeline</h2>
          <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2'>
            {[
              { key: 'quote', label: 'Quote', bg: 'bg-blue-400/10', text: 'text-blue-400' },
              { key: 'accepted', label: 'Accepted', bg: 'bg-teal-400/10', text: 'text-teal-400' },
              { key: 'in_progress', label: 'In Progress', bg: 'bg-amber-400/10', text: 'text-amber-400' },
              { key: 'completed', label: 'Completed', bg: 'bg-emerald-400/10', text: 'text-emerald-400' },
              { key: 'invoiced', label: 'Invoiced', bg: 'bg-purple-400/10', text: 'text-purple-400' },
              { key: 'paid', label: 'Paid', bg: 'bg-green-400/10', text: 'text-green-400' },
              { key: 'cancelled', label: 'Cancelled', bg: 'bg-red-400/10', text: 'text-red-400' },
            ].map((s) => (
              <div key={s.key} className={`text-center p-3 ${s.bg} rounded`}>
                <p className={`font-display text-2xl font-bold tabular-nums ${s.text}`}>{stats.jobsByStatus[s.key] ?? 0}</p>
                <p className='text-[10px] text-foreground-muted uppercase tracking-wider mt-1'>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top products */}
      {!loading && stats.topProducts.length > 0 && (
        <div className='bg-surface border border-border mb-8'>
          <div className='px-6 py-4 border-b border-border flex items-center justify-between'>
            <h2 className='font-display text-base font-semibold'>Top Products by Views</h2>
            <Link href='/admin/products' className='text-xs text-gold hover:text-gold-light transition-colors flex items-center gap-1'>
              View all <HiChevronRight size={12} />
            </Link>
          </div>
          <div className='divide-y divide-border'>
            {stats.topProducts.map((p, i) => (
              <div key={p.name} className='flex items-center gap-4 px-6 py-3 hover:bg-white/2 transition-colors'>
                <span className={`text-xs font-bold w-6 text-center tabular-nums shrink-0 ${i === 0 ? 'text-gold' : i === 1 ? 'text-foreground-muted' : 'text-foreground-muted/50'}`}>#{i + 1}</span>
                <span className='text-sm flex-1 truncate'>{p.name}</span>
                <div className='flex items-center gap-5 text-xs text-foreground-muted shrink-0'>
                  <span className='flex items-center gap-1'>
                    <HiEye size={12} /> {p.viewCount}
                  </span>
                  <span className='hidden sm:block'>{p.inquiryCount} inquiries</span>
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

      {/* 6-month revenue trend */}
      {!loading && revenueData.length > 0 && (
        <div className='mt-6 bg-surface border border-border p-6'>
          <h2 className='font-display text-lg font-semibold mb-6'>Revenue — Last 6 Months (TTD)</h2>
          <ResponsiveContainer width='100%' height={220}>
            <LineChart data={revenueData} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
              <CartesianGrid stroke='var(--border)' strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='month' tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 12 }}
                formatter={(value) => [`TTD ${Number(value).toLocaleString('en-TT', { minimumFractionDigits: 2 })}`, 'Revenue']}
              />
              <Line type='monotone' dataKey='revenueTTD' stroke='var(--gold)' strokeWidth={2} dot={{ fill: 'var(--gold)', r: 3 }} activeDot={{ r: 5 }} name='Revenue' />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
