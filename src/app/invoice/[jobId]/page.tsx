'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getJobByToken } from '@/lib/firestore';
import type { Job } from '@/types';
import { HiDownload, HiCheckCircle, HiClock, HiExclamationCircle } from 'react-icons/hi';

interface PageProps {
  params: Promise<{ jobId: string }>;
}

function fmtTTD(n: number) {
  return n.toLocaleString('en-TT', { minimumFractionDigits: 2 });
}

function fmtDate(ms: number) {
  return new Date(ms).toLocaleDateString('en-TT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function InvoicePage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setJobId(p.jobId));
  }, [params]);

  const load = useCallback(async () => {
    if (!jobId) return;
    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid link — missing access token.');
      setLoading(false);
      return;
    }

    try {
      const found = await getJobByToken(jobId, token);
      if (!found) {
        setError('Invoice not found or access link is invalid.');
      } else if (!found.invoiceNumber) {
        setError('No invoice has been generated for this job yet.');
      } else {
        setJob(found);
      }
    } catch {
      setError('Failed to load invoice. Please try again.');
    }
    setLoading(false);
  }, [jobId, searchParams]);

  useEffect(() => {
    load();
  }, [load]);

  const pdfUrl = job && searchParams.get('token') ? `/api/invoice/${jobId}/pdf?token=${searchParams.get('token')}` : null;

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Top bar */}
      <header className='border-b border-border'>
        <div className='max-w-2xl mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='w-7 h-7 rounded bg-gold flex items-center justify-center text-background font-bold text-xs font-display'>W</span>
            <span className='font-display font-semibold text-sm'>World of Stone</span>
          </div>
          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              className='flex items-center gap-2 px-4 py-2 border border-gold text-gold text-xs font-semibold uppercase tracking-wider hover:bg-gold hover:text-background transition-colors'
            >
              <HiDownload size={14} />
              Download PDF
            </a>
          )}
        </div>
      </header>

      <main className='max-w-2xl mx-auto px-6 py-12'>
        {loading && (
          <div className='flex justify-center py-24'>
            <div className='w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin' />
          </div>
        )}

        {error && (
          <div className='flex flex-col items-center py-24 text-center gap-4'>
            <HiExclamationCircle size={40} className='text-foreground-muted' />
            <p className='text-foreground-muted'>{error}</p>
          </div>
        )}

        {job && (
          <div className='space-y-8'>
            {/* Status banner */}
            <div
              className={`flex items-center gap-3 px-5 py-3 border ${
                job.status === 'paid' ? 'border-emerald-800 bg-emerald-950/30' : job.status === 'invoiced' ? 'border-gold/40 bg-gold/5' : 'border-border'
              }`}
            >
              {job.status === 'paid' ? <HiCheckCircle size={18} className='text-emerald-400 flex-shrink-0' /> : <HiClock size={18} className='text-gold flex-shrink-0' />}
              <div>
                <p className='text-sm font-semibold'>{job.status === 'paid' ? 'Payment Received' : 'Awaiting Payment'}</p>
                {job.paymentDueDate && job.status !== 'paid' && (
                  <p className='text-xs text-foreground-muted mt-0.5'>
                    Due by {fmtDate(job.paymentDueDate)}
                    {job.paymentTermsDays ? ` · Net ${job.paymentTermsDays}` : ''}
                  </p>
                )}
                {job.paidAt && job.status === 'paid' && <p className='text-xs text-foreground-muted mt-0.5'>Paid on {fmtDate(job.paidAt)}</p>}
              </div>
            </div>

            {/* Invoice header */}
            <div className='flex items-start justify-between pb-6 border-b border-border'>
              <div>
                <p className='text-xs text-foreground-muted uppercase tracking-widest mb-1'>Invoice</p>
                <p className='font-display text-2xl font-semibold text-gold'>{job.invoiceNumber}</p>
                <p className='text-sm text-foreground-muted mt-1'>Issued {fmtDate(job.invoicedAt ?? job.createdAt)}</p>
              </div>
              {pdfUrl && (
                <a href={pdfUrl} download className='flex items-center gap-2 px-3 py-1.5 border border-border hover:border-gold text-foreground-muted hover:text-gold text-xs transition-colors'>
                  <HiDownload size={13} />
                  PDF
                </a>
              )}
            </div>

            {/* Bill to */}
            <div className='grid grid-cols-2 gap-8'>
              <div>
                <p className='text-[10px] text-gold uppercase tracking-widest font-semibold mb-2'>Bill To</p>
                <p className='font-semibold'>{job.clientName}</p>
                <p className='text-sm text-foreground-muted'>{job.clientPhone}</p>
                {job.clientEmail && <p className='text-sm text-foreground-muted'>{job.clientEmail}</p>}
                {job.clientAddress && <p className='text-sm text-foreground-muted'>{job.clientAddress}</p>}
              </div>
              <div>
                <p className='text-[10px] text-gold uppercase tracking-widest font-semibold mb-2'>Project</p>
                <p className='font-semibold'>{job.title}</p>
                <p className='text-sm text-foreground-muted'>Ref: {job.jobNumber}</p>
              </div>
            </div>

            {/* Line items */}
            <div>
              <div className='grid grid-cols-[1fr_auto] border-b border-border pb-2 mb-2'>
                <p className='text-[10px] text-foreground-muted uppercase tracking-wider font-semibold'>Description</p>
                <p className='text-[10px] text-foreground-muted uppercase tracking-wider font-semibold text-right'>Amount (TTD)</p>
              </div>
              {job.lineItems.map((item) => (
                <div key={item.id} className='grid grid-cols-[1fr_auto] py-3 border-b border-border/50'>
                  <div>
                    <p className='text-sm font-semibold'>{item.description}</p>
                    {item.materialName && <p className='text-xs text-foreground-muted mt-0.5'>{item.materialName}</p>}
                    {item.notes && <p className='text-xs text-foreground-muted'>{item.notes}</p>}
                  </div>
                  <p className='text-sm font-semibold text-right self-start'>{fmtTTD(item.lineTotal)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className='flex flex-col items-end gap-2'>
              {(job.vatPercent ?? 0) > 0 && (
                <>
                  <div className='flex justify-between w-64'>
                    <p className='text-sm text-foreground-muted'>Subtotal</p>
                    <p className='text-sm'>TTD {fmtTTD(job.totalAmountTTD)}</p>
                  </div>
                  <div className='flex justify-between w-64'>
                    <p className='text-sm text-foreground-muted'>VAT ({job.vatPercent}%)</p>
                    <p className='text-sm'>TTD {fmtTTD(job.totalAmountTTD * ((job.vatPercent ?? 0) / 100))}</p>
                  </div>
                </>
              )}
              <div className='flex justify-between w-64 pt-2 border-t border-gold/30'>
                <p className='text-sm text-foreground-muted'>Total Due</p>
                <p className='text-lg font-semibold text-gold'>TTD {fmtTTD(job.totalAmountTTD * (1 + (job.vatPercent ?? 0) / 100))}</p>
              </div>
            </div>

            {/* Notes */}
            {job.notes && (
              <div className='p-4 border border-border'>
                <p className='text-[10px] text-gold uppercase tracking-widest font-semibold mb-2'>Notes</p>
                <p className='text-sm text-foreground-muted whitespace-pre-line'>{job.notes}</p>
              </div>
            )}

            {/* Payment instructions */}
            <div className='p-4 border border-gold/30'>
              <p className='text-[10px] text-gold uppercase tracking-widest font-semibold mb-2'>Payment Instructions</p>
              <p className='text-sm text-foreground-muted'>
                Please make payment within the specified due date. Bank transfer details will be provided upon request. Contact us at{' '}
                <a href='mailto:info@worldofstone.tt' className='text-gold hover:underline'>
                  info@worldofstone.tt
                </a>{' '}
                or WhatsApp for any queries.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
