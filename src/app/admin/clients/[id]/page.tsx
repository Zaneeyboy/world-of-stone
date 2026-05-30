'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { getClient, getJobsByClientId } from '@/lib/firestore';
import type { Client, Job } from '@/types';
import { HiArrowLeft, HiPhone, HiMail, HiLocationMarker, HiAnnotation } from 'react-icons/hi';

const STATUS_COLORS: Record<string, string> = {
  quote: 'bg-yellow-900/40 text-yellow-300',
  accepted: 'bg-blue-900/40 text-blue-300',
  in_progress: 'bg-purple-900/40 text-purple-300',
  completed: 'bg-green-900/40 text-green-300',
  invoiced: 'bg-orange-900/40 text-orange-300',
  paid: 'bg-emerald-900/40 text-emerald-300',
  cancelled: 'bg-gray-800 text-gray-500',
};

const STATUS_LABELS: Record<string, string> = {
  quote: 'Quote',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  invoiced: 'Invoiced',
  paid: 'Paid',
  cancelled: 'Cancelled',
};

export default function ClientDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getClient(id), getJobsByClientId(id)])
      .then(([c, j]) => {
        setClient(c);
        setJobs(j);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const TTD_USD = Number(process.env.NEXT_PUBLIC_TTD_USD_RATE ?? '6.78');
  const paidJobs = jobs.filter((j) => j.status === 'paid' || j.status === 'invoiced');
  const totalRevenue = paidJobs.reduce((s, j) => s + j.totalAmountTTD, 0);
  const pipeline = jobs.filter((j) => !['paid', 'cancelled'].includes(j.status)).reduce((s, j) => s + j.totalAmountTTD, 0);

  return (
    <AdminShell title={client?.name ?? 'Client'}>
      <div className='p-6 space-y-6'>
        <Link href='/admin/clients' className='inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors'>
          <HiArrowLeft size={14} />
          All Clients
        </Link>

        {loading ? (
          <div className='text-foreground-muted text-sm'>Loading…</div>
        ) : !client ? (
          <div className='text-foreground-muted text-sm'>Client not found.</div>
        ) : (
          <>
            {/* Profile card */}
            <div className='bg-surface border border-border rounded-lg p-6 space-y-4'>
              <div className='flex items-start justify-between'>
                <div>
                  <h2 className='text-xl font-semibold text-foreground'>{client.name}</h2>
                  <p className='text-xs text-foreground-muted mt-0.5'>
                    Client since {new Date(client.createdAt).toLocaleDateString('en-TT', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <Link
                  href={`/admin/clients`}
                  className='text-sm text-gold hover:text-gold-light transition-colors'
                >
                  Edit
                </Link>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                <div className='flex items-center gap-2 text-foreground-muted'>
                  <HiPhone size={14} className='text-gold shrink-0' />
                  <span>{client.phone}</span>
                </div>
                {client.email && (
                  <div className='flex items-center gap-2 text-foreground-muted'>
                    <HiMail size={14} className='text-gold shrink-0' />
                    <span>{client.email}</span>
                  </div>
                )}
                {client.address && (
                  <div className='flex items-center gap-2 text-foreground-muted'>
                    <HiLocationMarker size={14} className='text-gold shrink-0' />
                    <span>{client.address}</span>
                  </div>
                )}
                {client.notes && (
                  <div className='flex items-start gap-2 text-foreground-muted col-span-full'>
                    <HiAnnotation size={14} className='text-gold shrink-0 mt-0.5' />
                    <span>{client.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-4'>
              {[
                { label: 'Total Jobs', value: jobs.length },
                { label: 'Revenue (TTD)', value: `$${totalRevenue.toLocaleString('en-TT', { minimumFractionDigits: 2 })}` },
                { label: 'Pipeline (TTD)', value: `$${pipeline.toLocaleString('en-TT', { minimumFractionDigits: 2 })}` },
              ].map((s) => (
                <div key={s.label} className='bg-surface border border-border rounded-lg p-4'>
                  <p className='text-xs text-foreground-muted uppercase tracking-wider mb-1'>{s.label}</p>
                  <p className='text-xl font-semibold text-foreground'>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Jobs table */}
            <div>
              <h3 className='text-sm font-semibold text-foreground mb-3'>Job History</h3>
              {jobs.length === 0 ? (
                <p className='text-sm text-foreground-muted'>No jobs linked to this client.</p>
              ) : (
                <div className='overflow-x-auto rounded border border-border'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b border-border bg-surface text-foreground-muted text-xs uppercase tracking-wider'>
                        <th className='text-left px-4 py-3'>Job #</th>
                        <th className='text-left px-4 py-3'>Title</th>
                        <th className='text-left px-4 py-3'>Status</th>
                        <th className='text-right px-4 py-3'>Total (TTD)</th>
                        <th className='text-right px-4 py-3'>Total (USD)</th>
                        <th className='text-left px-4 py-3'>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((j) => (
                        <tr key={j.id} className='border-b border-border/50 hover:bg-surface/60 transition-colors'>
                          <td className='px-4 py-3 text-foreground-muted font-mono text-xs'>{j.jobNumber}</td>
                          <td className='px-4 py-3 text-foreground font-medium'>
                            <Link href='/admin/jobs' className='hover:text-gold transition-colors'>{j.title}</Link>
                          </td>
                          <td className='px-4 py-3'>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_COLORS[j.status] ?? 'bg-gray-800 text-gray-400'}`}>
                              {STATUS_LABELS[j.status] ?? j.status}
                            </span>
                          </td>
                          <td className='px-4 py-3 text-right text-foreground'>${j.totalAmountTTD.toLocaleString('en-TT', { minimumFractionDigits: 2 })}</td>
                          <td className='px-4 py-3 text-right text-foreground-muted'>${(j.totalAmountTTD / TTD_USD).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className='px-4 py-3 text-foreground-muted text-xs'>{new Date(j.createdAt).toLocaleDateString('en-TT')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
