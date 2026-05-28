import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getJobByToken } from '@/lib/firestore';
import type { Job, JobLineItem, JobStatus, ServiceType } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const STATUS_LABELS: Record<JobStatus, string> = {
  quote: 'Quote Pending',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  invoiced: 'Invoice Issued',
  paid: 'Paid',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<JobStatus, string> = {
  quote: 'text-blue-400 bg-blue-400/10 border-blue-800',
  accepted: 'text-teal-400 bg-teal-400/10 border-teal-800',
  in_progress: 'text-amber-400 bg-amber-400/10 border-amber-800',
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-800',
  invoiced: 'text-purple-400 bg-purple-400/10 border-purple-800',
  paid: 'text-green-400 bg-green-400/10 border-green-800',
  cancelled: 'text-red-400 bg-red-400/10 border-red-900',
};

const SERVICE_LABELS: Record<ServiceType, string> = {
  kitchen_top: 'Kitchen Top',
  backsplash: 'Backsplash',
  waterfall_edge: 'Waterfall Edge',
  vanity: 'Vanity',
  staircase: 'Staircase',
  wall_cladding: 'Wall Cladding',
  pool_edge: 'Pool Edge',
  fountain: 'Fountain',
  flooring: 'Flooring',
  other: 'Other',
};

function fmtTTD(n: number) {
  return n.toLocaleString('en-TT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtUSD(n: number, rate: number) {
  return (n / rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function LineItemRow({ item, rate }: { item: JobLineItem; rate: number }) {
  let qtyDesc = '';
  if (item.sqft && item.pricePerSqFt) qtyDesc = `${item.sqft} sq ft @ TTD ${fmtTTD(item.pricePerSqFt)}/sq ft`;
  else if (item.sheets && item.pricePerSheet) qtyDesc = `${item.sheets} sheet${item.sheets > 1 ? 's' : ''} @ TTD ${fmtTTD(item.pricePerSheet)}/sheet`;
  else if (item.quantity && item.unitPrice) qtyDesc = `${item.quantity} × TTD ${fmtTTD(item.unitPrice)}`;

  return (
    <tr className='border-b border-border'>
      <td className='py-4 pr-4'>
        <p className='text-foreground text-sm font-medium'>{item.description}</p>
        {item.materialName && <p className='text-foreground-muted text-xs mt-0.5'>{item.materialName}</p>}
        {item.notes && <p className='text-foreground-muted text-xs mt-0.5 italic'>{item.notes}</p>}
        <p className='text-xs text-foreground-muted mt-1 uppercase tracking-wider'>{SERVICE_LABELS[item.serviceType]}</p>
      </td>
      <td className='py-4 px-4 text-sm text-foreground-muted whitespace-nowrap'>{qtyDesc}</td>
      <td className='py-4 pl-4 text-right whitespace-nowrap'>
        <p className='text-foreground font-semibold text-sm'>TTD {fmtTTD(item.lineTotal)}</p>
        <p className='text-foreground-muted text-xs'>≈ USD {fmtUSD(item.lineTotal, rate)}</p>
      </td>
    </tr>
  );
}

interface PageProps {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { jobId } = await params;
  const { token } = await searchParams;
  if (!token) return { title: 'Quote' };
  const job = await getJobByToken(jobId, token);
  if (!job) return { title: 'Quote Not Found' };
  return {
    title: `Quote ${job.jobNumber} — ${job.clientName}`,
    robots: { index: false, follow: false },
  };
}

export default async function QuotePage({ params, searchParams }: PageProps) {
  const { jobId } = await params;
  const { token } = await searchParams;

  if (!token) notFound();

  const job = await getJobByToken(jobId, token);
  if (!job) notFound();

  const TTD_USD = Number(process.env.NEXT_PUBLIC_TTD_USD_RATE) || 6.78;
  const dateStr = new Date(job.createdAt).toLocaleDateString('en-TT', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <Navbar />
      <main className='min-h-screen bg-background pt-24 pb-20'>
        <div className='max-w-3xl mx-auto px-6'>
          {/* Header */}
          <div className='border border-border p-8 mb-6'>
            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8'>
              {/* Brand */}
              <div>
                <p className='font-display text-2xl font-light'>
                  World <span className='text-gold-light italic'>of Stone</span>
                </p>
                <p className='text-foreground-muted text-xs mt-1'>Trinidad & Tobago</p>
              </div>

              {/* Quote number + status */}
              <div className='text-left sm:text-right'>
                <p className='font-mono text-sm text-foreground-muted'>Quote Reference</p>
                <p className='font-display text-xl font-semibold mt-0.5'>{job.jobNumber}</p>
                <p className='text-foreground-muted text-xs mt-1'>{dateStr}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 border text-[10px] font-medium uppercase tracking-wider ${STATUS_COLORS[job.status]}`}>
                  {STATUS_LABELS[job.status]}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className='h-px bg-gold/30 mb-8' />

            {/* Client + title */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-2'>Prepared For</p>
                <p className='text-foreground font-medium'>{job.clientName}</p>
                <p className='text-foreground-muted text-sm'>{job.clientPhone}</p>
                {job.clientEmail && <p className='text-foreground-muted text-sm'>{job.clientEmail}</p>}
                {job.clientAddress && <p className='text-foreground-muted text-sm mt-1'>{job.clientAddress}</p>}
              </div>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-2'>Project</p>
                <p className='text-foreground font-medium'>{job.title}</p>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className='border border-border overflow-hidden mb-6'>
            <div className='p-5 border-b border-border bg-surface'>
              <p className='text-xs font-semibold uppercase tracking-[0.15em] text-gold'>Scope of Work</p>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full px-5'>
                <thead>
                  <tr className='border-b border-border'>
                    <th className='text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Description</th>
                    <th className='text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Qty / Rate</th>
                    <th className='text-right py-3 pl-4 pr-5 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Amount</th>
                  </tr>
                </thead>
                <tbody className='px-5'>
                  {job.lineItems.map((item) => (
                    <tr key={item.id} className='border-b border-border last:border-0'>
                      <td className='py-4 px-5'>
                        <p className='text-foreground text-sm font-medium'>{item.description}</p>
                        {item.materialName && <p className='text-foreground-muted text-xs mt-0.5'>{item.materialName}</p>}
                        {item.notes && <p className='text-foreground-muted text-xs mt-0.5 italic'>{item.notes}</p>}
                        <p className='text-xs text-foreground-muted mt-1 uppercase tracking-wider'>{SERVICE_LABELS[item.serviceType]}</p>
                      </td>
                      <td className='py-4 px-4 text-sm text-foreground-muted whitespace-nowrap'>
                        {item.sqft && item.pricePerSqFt && `${item.sqft} sq ft @ TTD ${fmtTTD(item.pricePerSqFt)}/sq ft`}
                        {item.sheets && item.pricePerSheet && `${item.sheets} sheet${item.sheets > 1 ? 's' : ''} @ TTD ${fmtTTD(item.pricePerSheet)}/sheet`}
                        {item.quantity && item.unitPrice && `${item.quantity} × TTD ${fmtTTD(item.unitPrice)}`}
                      </td>
                      <td className='py-4 pl-4 pr-5 text-right whitespace-nowrap'>
                        <p className='text-foreground font-semibold text-sm'>TTD {fmtTTD(item.lineTotal)}</p>
                        <p className='text-foreground-muted text-xs'>≈ USD {fmtUSD(item.lineTotal, TTD_USD)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className='border-t border-border p-5 bg-surface flex flex-col items-end gap-2'>
              <div className='flex items-center justify-between w-full max-w-xs'>
                <span className='text-foreground-muted text-sm'>Total (TTD)</span>
                <span className='font-display text-2xl font-semibold text-gold'>TTD {fmtTTD(job.totalAmountTTD)}</span>
              </div>
              <div className='flex items-center justify-between w-full max-w-xs'>
                <span className='text-foreground-muted text-xs'>USD equivalent</span>
                <span className='text-foreground-muted text-sm'>≈ USD {fmtUSD(job.totalAmountTTD, TTD_USD)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {job.notes && (
            <div className='border border-border p-6 mb-6'>
              <p className='text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-3'>Notes</p>
              <p className='text-foreground-muted text-sm leading-relaxed whitespace-pre-line'>{job.notes}</p>
            </div>
          )}

          {/* Footer CTA */}
          <div className='border border-border p-6 text-center'>
            <p className='text-foreground-muted text-sm mb-4'>Questions about this quote? Contact us directly.</p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Link
                href='/contact'
                className='px-6 py-2.5 border border-gold/60 bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all duration-200 text-sm font-medium uppercase tracking-wider'
              >
                Contact Us
              </Link>
              <a
                href={`/api/quote/${job.id}/pdf?token=${token}`}
                target='_blank'
                rel='noopener noreferrer'
                className='px-6 py-2.5 border border-border text-foreground-muted hover:text-foreground hover:border-foreground/30 transition-all duration-200 text-sm font-medium uppercase tracking-wider'
              >
                Download PDF
              </a>
            </div>
          </div>

          <p className='text-center text-xs text-foreground-muted mt-8'>
            This quote is valid for 30 days from the date of issue. Prices are in Trinidad & Tobago Dollars (TTD).
            Exchange rate used: 1 USD ≈ {TTD_USD} TTD.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
