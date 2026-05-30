'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { getAllProductsAdmin, getJobs, getClients, getRevenueByMonth, getJobStats } from '@/lib/firestore';
import type { RevenueMonth } from '@/lib/firestore';
import type { Product, Job, Client } from '@/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HiDownload } from 'react-icons/hi';

// ─── CSV helpers ──────────────────────────────────────────────────────────────

function downloadCSV(filename: string, rows: string[][]): void {
  const content = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportJobsCSV(jobs: Job[]) {
  const header = ['Job #', 'Client Name', 'Phone', 'Email', 'Address', 'Title', 'Status', 'Total (TTD)', 'Invoice #', 'Created'];
  const rows = jobs.map((j) => [
    j.jobNumber,
    j.clientName,
    j.clientPhone,
    j.clientEmail ?? '',
    j.clientAddress ?? '',
    j.title,
    j.status,
    j.totalAmountTTD.toFixed(2),
    j.invoiceNumber ?? '',
    new Date(j.createdAt).toLocaleDateString('en-TT'),
  ]);
  downloadCSV(`jobs-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...rows]);
}

function exportProductsCSV(products: Product[]) {
  const header = ['Name', 'Material', 'Color', 'Price/SqFt (TTD)', 'Price/Sheet (TTD)', 'Availability', 'Views', 'Inquiries', 'Featured', 'Hidden'];
  const rows = products.map((p) => [
    p.name,
    p.materialType,
    p.color,
    p.pricePerSqFt?.toFixed(2) ?? '',
    p.pricePerSheet?.toFixed(2) ?? '',
    p.availability,
    p.viewCount,
    p.inquiryCount,
    p.featured ? 'Yes' : 'No',
    p.hidden ? 'Yes' : 'No',
  ]);
  downloadCSV(`products-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...rows]);
}

function exportClientsCSV(clients: Client[]) {
  const header = ['Name', 'Phone', 'Email', 'Address', 'Notes', 'Created'];
  const rows = clients.map((c) => [
    c.name,
    c.phone,
    c.email ?? '',
    c.address ?? '',
    c.notes ?? '',
    new Date(c.createdAt).toLocaleDateString('en-TT'),
  ]);
  downloadCSV(`clients-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...rows]);
}

// ─── Component ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  quote: 'Quote',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  invoiced: 'Invoiced',
  paid: 'Paid',
  cancelled: 'Cancelled',
};

const TTD_USD = Number(process.env.NEXT_PUBLIC_TTD_USD_RATE ?? '6.78');

export default function AdminReportsPage() {
  return (
    <AdminShell title='Reports'>
      <ReportsContent />
    </AdminShell>
  );
}

function ReportsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueMonth[]>([]);
  const [jobStats, setJobStats] = useState<{ byStatus: Partial<Record<string, number>>; totalRevenueTTD: number; pipelineValueTTD: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, j, c, rev, stats] = await Promise.all([
        getAllProductsAdmin(),
        getJobs(),
        getClients(),
        getRevenueByMonth(6),
        getJobStats(),
      ]);
      setProducts(p);
      setJobs(j);
      setClients(c);
      setRevenueData(rev);
      setJobStats(stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const topProducts = [...products]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 10);

  const paidRevenue = jobStats?.totalRevenueTTD ?? 0;
  const pipeline = jobStats?.pipelineValueTTD ?? 0;

  return (
    <div className='p-6 space-y-8'>
      {loading ? (
        <div className='flex items-center justify-center py-20'>
          <div className='w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin' />
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
            {[
              { label: 'Revenue (TTD)', value: `$${paidRevenue.toLocaleString('en-TT', { minimumFractionDigits: 2 })}` },
              { label: 'Revenue (USD)', value: `$${(paidRevenue / TTD_USD).toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
              { label: 'Pipeline (TTD)', value: `$${pipeline.toLocaleString('en-TT', { minimumFractionDigits: 2 })}` },
              { label: 'Total Jobs', value: jobs.length },
              { label: 'Products', value: products.length },
              { label: 'Hidden Products', value: products.filter((p) => p.hidden).length },
              { label: 'Clients', value: clients.length },
              { label: 'Total Views', value: products.reduce((s, p) => s + p.viewCount, 0).toLocaleString() },
            ].map((k) => (
              <div key={k.label} className='bg-surface border border-border rounded-lg p-4'>
                <p className='text-xs text-foreground-muted uppercase tracking-wider mb-1'>{k.label}</p>
                <p className='text-xl font-semibold text-foreground'>{k.value}</p>
              </div>
            ))}
          </div>

          {/* Revenue chart */}
          <div className='bg-surface border border-border rounded-lg p-6'>
            <h3 className='text-sm font-semibold text-foreground mb-4'>Revenue — Last 6 Months (TTD)</h3>
            <ResponsiveContainer width='100%' height={220}>
              <LineChart data={revenueData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='rgba(201,168,76,0.1)' />
                <XAxis dataKey='month' tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--foreground-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={60} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)', fontSize: 12 }}
                  formatter={(v: number) => [`TTD ${v.toLocaleString('en-TT', { minimumFractionDigits: 2 })}`, 'Revenue']}
                />
                <Line type='monotone' dataKey='revenueTTD' stroke='var(--gold)' strokeWidth={2} dot={{ fill: 'var(--gold)', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Job pipeline */}
          <div className='bg-surface border border-border rounded-lg p-6'>
            <h3 className='text-sm font-semibold text-foreground mb-4'>Job Pipeline by Status</h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-border text-xs text-foreground-muted uppercase tracking-wider'>
                    <th className='text-left py-2'>Status</th>
                    <th className='text-right py-2'>Count</th>
                    <th className='text-right py-2'>Total Value (TTD)</th>
                    <th className='text-right py-2'>Total Value (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(jobStats?.byStatus ?? {}).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)).map(([status, count]) => {
                    const statusJobs = jobs.filter((j) => j.status === status);
                    const total = statusJobs.reduce((s, j) => s + j.totalAmountTTD, 0);
                    return (
                      <tr key={status} className='border-b border-border/50'>
                        <td className='py-2 text-foreground'>{STATUS_LABELS[status] ?? status}</td>
                        <td className='py-2 text-right text-foreground-muted'>{count}</td>
                        <td className='py-2 text-right text-foreground'>${total.toLocaleString('en-TT', { minimumFractionDigits: 2 })}</td>
                        <td className='py-2 text-right text-foreground-muted'>${(total / TTD_USD).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top products */}
          <div className='bg-surface border border-border rounded-lg p-6'>
            <h3 className='text-sm font-semibold text-foreground mb-4'>Top 10 Products by Views</h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-border text-xs text-foreground-muted uppercase tracking-wider'>
                    <th className='text-left py-2'>#</th>
                    <th className='text-left py-2'>Product</th>
                    <th className='text-left py-2'>Type</th>
                    <th className='text-right py-2'>Views</th>
                    <th className='text-right py-2'>Inquiries</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={p.id} className='border-b border-border/50'>
                      <td className='py-2 text-foreground-muted'>{i + 1}</td>
                      <td className='py-2 text-foreground font-medium'>{p.name}</td>
                      <td className='py-2 text-foreground-muted capitalize'>{p.materialType}</td>
                      <td className='py-2 text-right text-foreground'>{p.viewCount.toLocaleString()}</td>
                      <td className='py-2 text-right text-foreground-muted'>{p.inquiryCount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export */}
          <div className='bg-surface border border-border rounded-lg p-6'>
            <h3 className='text-sm font-semibold text-foreground mb-4'>Export Data</h3>
            <div className='flex flex-wrap gap-3'>
              <button
                onClick={() => exportJobsCSV(jobs)}
                className='flex items-center gap-2 px-4 py-2 border border-border text-foreground-muted hover:border-gold hover:text-gold text-sm rounded transition-colors'
              >
                <HiDownload size={15} />
                Jobs CSV
              </button>
              <button
                onClick={() => exportProductsCSV(products)}
                className='flex items-center gap-2 px-4 py-2 border border-border text-foreground-muted hover:border-gold hover:text-gold text-sm rounded transition-colors'
              >
                <HiDownload size={15} />
                Products CSV
              </button>
              <button
                onClick={() => exportClientsCSV(clients)}
                className='flex items-center gap-2 px-4 py-2 border border-border text-foreground-muted hover:border-gold hover:text-gold text-sm rounded transition-colors'
              >
                <HiDownload size={15} />
                Clients CSV
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
