'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AdminGuard from '@/components/AdminGuard';
import { getJobs, createJob, updateJob, deleteJob } from '@/lib/firestore';
import type { Job, JobLineItem, JobStatus, ServiceType } from '@/types';
import { HiArrowLeft, HiPlus, HiX, HiPencil, HiTrash, HiClipboardCopy, HiDownload, HiCheck } from 'react-icons/hi';

const STATUS_LABELS: Record<JobStatus, string> = {
  quote: 'Quote',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  invoiced: 'Invoiced',
  paid: 'Paid',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<JobStatus, string> = {
  quote: 'text-blue-400 border-blue-800',
  accepted: 'text-teal-400 border-teal-800',
  in_progress: 'text-amber-400 border-amber-800',
  completed: 'text-emerald-400 border-emerald-800',
  invoiced: 'text-purple-400 border-purple-800',
  paid: 'text-green-400 border-green-800',
  cancelled: 'text-red-400 border-red-900',
};

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
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

const TTD_USD = Number(process.env.NEXT_PUBLIC_TTD_USD_RATE) || 6.78;

function generateJobNumber(): string {
  const year = new Date().getFullYear();
  const suffix = Date.now().toString().slice(-4);
  return `WOS-${year}-${suffix}`;
}

function generateToken(): string {
  return crypto.randomUUID();
}

function calcLineTotal(item: Partial<JobLineItem>): number {
  if (item.sqft && item.pricePerSqFt) return item.sqft * item.pricePerSqFt;
  if (item.sheets && item.pricePerSheet) return item.sheets * item.pricePerSheet;
  if (item.quantity && item.unitPrice) return item.quantity * item.unitPrice;
  return 0;
}

const emptyLine = (): JobLineItem => ({
  id: crypto.randomUUID(),
  description: '',
  serviceType: 'kitchen_top',
  materialName: '',
  sqft: undefined,
  pricePerSqFt: undefined,
  sheets: undefined,
  pricePerSheet: undefined,
  quantity: undefined,
  unitPrice: undefined,
  lineTotal: 0,
  notes: '',
});

type JobForm = {
  jobNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  title: string;
  status: JobStatus;
  notes: string;
  lineItems: JobLineItem[];
};

const emptyJobForm = (): JobForm => ({
  jobNumber: generateJobNumber(),
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientAddress: '',
  title: '',
  status: 'quote',
  notes: '',
  lineItems: [emptyLine()],
});

export default function AdminJobsPage() {
  return (
    <AdminGuard>
      <JobsContent />
    </AdminGuard>
  );
}

function JobsContent() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JobForm>(emptyJobForm());
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const openNew = () => {
    setForm(emptyJobForm());
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (job: Job) => {
    setForm({
      jobNumber: job.jobNumber,
      clientName: job.clientName,
      clientPhone: job.clientPhone,
      clientEmail: job.clientEmail ?? '',
      clientAddress: job.clientAddress ?? '',
      title: job.title,
      status: job.status,
      notes: job.notes ?? '',
      lineItems: job.lineItems.length > 0 ? job.lineItems : [emptyLine()],
    });
    setEditingId(job.id);
    setFormOpen(true);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLineChange = (index: number, field: string, value: string) => {
    setForm((prev) => {
      const items = prev.lineItems.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value === '' ? undefined : isNaN(Number(value)) ? value : field === 'description' || field === 'serviceType' || field === 'materialName' || field === 'notes' ? value : Number(value) };
        return { ...updated, lineTotal: calcLineTotal(updated) };
      });
      return { ...prev, lineItems: items };
    });
  };

  const addLine = () => setForm((prev) => ({ ...prev, lineItems: [...prev.lineItems, emptyLine()] }));

  const removeLine = (index: number) =>
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));

  const totalTTD = form.lineItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> = {
        jobNumber: form.jobNumber,
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        clientEmail: form.clientEmail || undefined,
        clientAddress: form.clientAddress || undefined,
        title: form.title,
        status: form.status,
        lineItems: form.lineItems,
        notes: form.notes || undefined,
        totalAmountTTD: totalTTD,
        totalAmountUSD: parseFloat((totalTTD / TTD_USD).toFixed(2)),
        accessToken: editingId ? jobs.find((j) => j.id === editingId)?.accessToken ?? generateToken() : generateToken(),
      };

      if (editingId) {
        await updateJob(editingId, payload);
      } else {
        await createJob(payload);
      }

      setFormOpen(false);
      await loadJobs();
    } catch (err) {
      console.error(err);
      alert('Failed to save job.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteJob(id);
    setDeleteConfirm(null);
    await loadJobs();
  };

  const copyClientLink = (job: Job) => {
    const url = `${window.location.origin}/quote/${job.id}?token=${job.accessToken}`;
    navigator.clipboard.writeText(url);
    setCopied(job.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='sticky top-0 z-40 bg-surface border-b border-border'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center gap-4'>
          <Link href='/admin' className='flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors'>
            <HiArrowLeft size={16} />
            <span className='text-sm'>Dashboard</span>
          </Link>
          <span className='text-border'>|</span>
          <h1 className='font-display text-lg font-semibold'>Jobs & Quotes</h1>
          <button onClick={openNew} className='ml-auto flex items-center gap-2 px-4 py-2 bg-gold text-background text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors'>
            <HiPlus size={14} />
            New Job
          </button>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Job Form Modal */}
        {formOpen && (
          <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4'>
            <div className='w-full max-w-3xl bg-surface border border-border my-8'>
              <div className='flex items-center justify-between p-6 border-b border-border'>
                <h2 className='font-display text-xl font-semibold'>{editingId ? 'Edit Job' : 'New Job'}</h2>
                <button onClick={() => setFormOpen(false)} className='text-foreground-muted hover:text-foreground'>
                  <HiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className='p-6 space-y-6'>
                {/* Job details */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='admin-label'>Job Number *</label>
                    <input name='jobNumber' value={form.jobNumber} onChange={handleFieldChange} required className='admin-input' />
                  </div>
                  <div>
                    <label className='admin-label'>Status</label>
                    <select name='status' value={form.status} onChange={handleFieldChange} className='admin-input'>
                      {(Object.keys(STATUS_LABELS) as JobStatus[]).map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                  <div className='sm:col-span-2'>
                    <label className='admin-label'>Job Title *</label>
                    <input name='title' value={form.title} onChange={handleFieldChange} required className='admin-input' placeholder='Kitchen renovation — marble tops & backsplash' />
                  </div>
                </div>

                {/* Client info */}
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-4'>Client Information</p>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='admin-label'>Client Name *</label>
                      <input name='clientName' value={form.clientName} onChange={handleFieldChange} required className='admin-input' />
                    </div>
                    <div>
                      <label className='admin-label'>Phone *</label>
                      <input name='clientPhone' value={form.clientPhone} onChange={handleFieldChange} required className='admin-input' placeholder='+1 868 ...' />
                    </div>
                    <div>
                      <label className='admin-label'>Email</label>
                      <input name='clientEmail' value={form.clientEmail} onChange={handleFieldChange} className='admin-input' type='email' />
                    </div>
                    <div>
                      <label className='admin-label'>Address</label>
                      <input name='clientAddress' value={form.clientAddress} onChange={handleFieldChange} className='admin-input' />
                    </div>
                  </div>
                </div>

                {/* Line items */}
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <p className='text-xs font-semibold uppercase tracking-[0.15em] text-gold'>Line Items</p>
                    <button type='button' onClick={addLine} className='flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors'>
                      <HiPlus size={12} /> Add Line
                    </button>
                  </div>

                  <div className='space-y-4'>
                    {form.lineItems.map((item, i) => (
                      <div key={item.id} className='border border-border p-4 space-y-3'>
                        <div className='flex items-center justify-between'>
                          <span className='text-xs text-foreground-muted uppercase tracking-wider'>Item {i + 1}</span>
                          {form.lineItems.length > 1 && (
                            <button type='button' onClick={() => removeLine(i)} className='text-foreground-muted hover:text-red-400 transition-colors'>
                              <HiTrash size={14} />
                            </button>
                          )}
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                          <div className='sm:col-span-2'>
                            <label className='admin-label'>Description *</label>
                            <input
                              value={item.description}
                              onChange={(e) => handleLineChange(i, 'description', e.target.value)}
                              required
                              className='admin-input'
                              placeholder='Bianco Carrara marble kitchen top'
                            />
                          </div>
                          <div>
                            <label className='admin-label'>Service Type</label>
                            <select value={item.serviceType} onChange={(e) => handleLineChange(i, 'serviceType', e.target.value)} className='admin-input'>
                              {(Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]).map((t) => (
                                <option key={t} value={t}>{SERVICE_TYPE_LABELS[t]}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className='admin-label'>Material Name</label>
                            <input value={item.materialName ?? ''} onChange={(e) => handleLineChange(i, 'materialName', e.target.value)} className='admin-input' placeholder='Bianco Carrara' />
                          </div>

                          {/* Pricing mode: sq ft */}
                          <div>
                            <label className='admin-label'>Sq Ft</label>
                            <input type='number' value={item.sqft ?? ''} onChange={(e) => handleLineChange(i, 'sqft', e.target.value)} className='admin-input' placeholder='12.5' />
                          </div>
                          <div>
                            <label className='admin-label'>TTD / sq ft</label>
                            <input type='number' value={item.pricePerSqFt ?? ''} onChange={(e) => handleLineChange(i, 'pricePerSqFt', e.target.value)} className='admin-input' placeholder='120' />
                          </div>

                          {/* Pricing mode: sheets */}
                          <div>
                            <label className='admin-label'>Sheets</label>
                            <input type='number' value={item.sheets ?? ''} onChange={(e) => handleLineChange(i, 'sheets', e.target.value)} className='admin-input' placeholder='2' />
                          </div>
                          <div>
                            <label className='admin-label'>TTD / sheet</label>
                            <input type='number' value={item.pricePerSheet ?? ''} onChange={(e) => handleLineChange(i, 'pricePerSheet', e.target.value)} className='admin-input' placeholder='4500' />
                          </div>

                          {/* Pricing mode: flat */}
                          <div>
                            <label className='admin-label'>Qty</label>
                            <input type='number' value={item.quantity ?? ''} onChange={(e) => handleLineChange(i, 'quantity', e.target.value)} className='admin-input' placeholder='1' />
                          </div>
                          <div>
                            <label className='admin-label'>Unit Price (TTD)</label>
                            <input type='number' value={item.unitPrice ?? ''} onChange={(e) => handleLineChange(i, 'unitPrice', e.target.value)} className='admin-input' placeholder='2500' />
                          </div>

                          <div className='sm:col-span-2'>
                            <label className='admin-label'>Notes</label>
                            <input value={item.notes ?? ''} onChange={(e) => handleLineChange(i, 'notes', e.target.value)} className='admin-input' placeholder='Edge profile: bullnose' />
                          </div>
                        </div>

                        <p className='text-right text-sm text-gold font-semibold'>
                          TTD {item.lineTotal.toLocaleString('en-TT', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className='mt-4 pt-4 border-t border-border flex flex-col items-end gap-1'>
                    <p className='text-sm text-foreground-muted'>Total (TTD)</p>
                    <p className='font-display text-2xl font-semibold text-gold'>
                      TTD {totalTTD.toLocaleString('en-TT', { minimumFractionDigits: 2 })}
                    </p>
                    <p className='text-xs text-foreground-muted'>
                      ≈ USD {(totalTTD / TTD_USD).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className='admin-label'>Job Notes</label>
                  <textarea name='notes' value={form.notes} onChange={handleFieldChange} rows={3} className='admin-input resize-none' placeholder='Internal notes, site access, special requirements...' />
                </div>

                <div className='flex gap-3 pt-2'>
                  <button type='submit' disabled={saving} className='px-6 py-2.5 bg-gold hover:bg-gold-light text-background text-sm font-semibold transition-colors disabled:opacity-60'>
                    {saving ? 'Saving...' : editingId ? 'Update Job' : 'Create Job'}
                  </button>
                  <button type='button' onClick={() => setFormOpen(false)} className='px-6 py-2.5 border border-border hover:border-foreground-muted text-sm transition-colors'>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Jobs table */}
        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin' />
          </div>
        ) : jobs.length === 0 ? (
          <div className='py-20 text-center border border-border'>
            <p className='text-foreground-muted text-sm mb-4'>No jobs yet.</p>
            <button onClick={openNew} className='px-5 py-2 border border-gold text-gold hover:bg-gold hover:text-background text-sm transition-colors'>
              Create First Job
            </button>
          </div>
        ) : (
          <div className='border border-border overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-surface border-b border-border'>
                <tr>
                  <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Job #</th>
                  <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Client</th>
                  <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Title</th>
                  <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Status</th>
                  <th className='text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Total (TTD)</th>
                  <th className='text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {jobs.map((job) => (
                  <tr key={job.id} className='hover:bg-surface/60 transition-colors'>
                    <td className='px-4 py-3 font-mono text-xs text-foreground-muted'>{job.jobNumber}</td>
                    <td className='px-4 py-3'>
                      <p className='font-medium text-foreground'>{job.clientName}</p>
                      <p className='text-xs text-foreground-muted'>{job.clientPhone}</p>
                    </td>
                    <td className='px-4 py-3 text-foreground-muted max-w-[200px] truncate'>{job.title}</td>
                    <td className='px-4 py-3'>
                      <span className={`px-2 py-0.5 border text-[10px] font-medium uppercase tracking-wider ${STATUS_COLORS[job.status]}`}>
                        {STATUS_LABELS[job.status]}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-right font-semibold text-gold'>
                      TTD {job.totalAmountTTD.toLocaleString('en-TT', { minimumFractionDigits: 2 })}
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-end gap-2'>
                        {/* Copy client link */}
                        <button
                          onClick={() => copyClientLink(job)}
                          className='p-1.5 text-foreground-muted hover:text-gold transition-colors'
                          title='Copy client quote link'
                        >
                          {copied === job.id ? <HiCheck size={16} className='text-emerald-400' /> : <HiClipboardCopy size={16} />}
                        </button>
                        {/* Download PDF */}
                        <a
                          href={`/api/quote/${job.id}/pdf?token=${job.accessToken}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='p-1.5 text-foreground-muted hover:text-gold transition-colors'
                          title='Download PDF'
                        >
                          <HiDownload size={16} />
                        </a>
                        {/* Edit */}
                        <button onClick={() => openEdit(job)} className='p-1.5 text-foreground-muted hover:text-gold transition-colors' title='Edit'>
                          <HiPencil size={16} />
                        </button>
                        {/* Delete */}
                        {deleteConfirm === job.id ? (
                          <div className='flex items-center gap-1'>
                            <button onClick={() => handleDelete(job.id)} className='text-xs px-2 py-1 bg-red-900/60 text-red-300 hover:bg-red-800 transition-colors'>
                              Confirm
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className='text-xs px-2 py-1 border border-border hover:border-foreground-muted transition-colors'>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(job.id)} className='p-1.5 text-foreground-muted hover:text-red-400 transition-colors' title='Delete'>
                            <HiTrash size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
