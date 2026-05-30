'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { getClients, createClient, updateClient, deleteClient, getJobs } from '@/lib/firestore';
import type { Client, Job } from '@/types';
import { HiPlus, HiPencil, HiTrash, HiX, HiUser, HiPhone, HiMail, HiLocationMarker, HiEye } from 'react-icons/hi';

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
};

type ClientForm = typeof emptyForm;

export default function AdminClientsPage() {
  return (
    <AdminShell title='Clients'>
      <ClientsContent />
    </AdminShell>
  );
}

function ClientsContent() {
  const [clients, setClients] = useState<Client[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ClientForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, j] = await Promise.all([getClients(), getJobs()]);
      setClients(c);
      setJobs(j);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function jobsForClient(clientId: string) {
    return jobs.filter((j) => j.clientId === clientId);
  }

  function revenueForClient(clientId: string) {
    return jobsForClient(clientId)
      .filter((j) => j.status === 'paid' || j.status === 'invoiced')
      .reduce((s, j) => s + j.totalAmountTTD, 0);
  }

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  }

  function openEdit(c: Client) {
    setForm({ name: c.name, phone: c.phone, email: c.email ?? '', address: c.address ?? '', notes: c.notes ?? '' });
    setEditingId(c.id);
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.phone.trim()) return;
    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        ...(form.email.trim() && { email: form.email.trim() }),
        ...(form.address.trim() && { address: form.address.trim() }),
        ...(form.notes.trim() && { notes: form.notes.trim() }),
      };
      if (editingId) {
        await updateClient(editingId, data);
      } else {
        await createClient(data);
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteClient(id);
      setDeleteConfirm(null);
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  const TTD_USD = Number(process.env.NEXT_PUBLIC_TTD_USD_RATE ?? '6.78');

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-foreground'>All Clients</h2>
          <p className='text-sm text-foreground-muted mt-0.5'>
            {clients.length} client{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={openAdd} className='flex items-center gap-2 px-4 py-2 bg-gold text-black text-sm font-semibold rounded hover:bg-gold-light transition-colors'>
          <HiPlus size={16} />
          Add Client
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className='text-foreground-muted text-sm'>Loading…</div>
      ) : clients.length === 0 ? (
        <div className='text-foreground-muted text-sm'>No clients yet.</div>
      ) : (
        <div className='overflow-x-auto rounded border border-border'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-border bg-surface text-foreground-muted text-xs uppercase tracking-wider'>
                <th className='text-left px-4 py-3'>Client</th>
                <th className='text-left px-4 py-3'>Phone</th>
                <th className='text-left px-4 py-3'>Email</th>
                <th className='text-right px-4 py-3'>Jobs</th>
                <th className='text-right px-4 py-3'>Revenue (TTD)</th>
                <th className='text-right px-4 py-3'>Revenue (USD)</th>
                <th className='px-4 py-3' />
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => {
                const clientJobs = jobsForClient(c.id);
                const rev = revenueForClient(c.id);
                return (
                  <tr key={c.id} className='border-b border-border/50 hover:bg-surface/60 transition-colors'>
                    <td className='px-4 py-3 font-medium text-foreground'>{c.name}</td>
                    <td className='px-4 py-3 text-foreground-muted'>{c.phone}</td>
                    <td className='px-4 py-3 text-foreground-muted'>{c.email ?? '—'}</td>
                    <td className='px-4 py-3 text-right text-foreground-muted'>{clientJobs.length}</td>
                    <td className='px-4 py-3 text-right text-foreground'>${rev.toLocaleString('en-TT', { minimumFractionDigits: 2 })}</td>
                    <td className='px-4 py-3 text-right text-foreground-muted'>${(rev / TTD_USD).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link href={`/admin/clients/${c.id}`} className='p-1.5 text-foreground-muted hover:text-gold transition-colors' title='View client'>
                          <HiEye size={16} />
                        </Link>
                        <button onClick={() => openEdit(c)} className='p-1.5 text-foreground-muted hover:text-gold transition-colors' title='Edit'>
                          <HiPencil size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirm(c.id)} className='p-1.5 text-foreground-muted hover:text-red-400 transition-colors' title='Delete'>
                          <HiTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {formOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
          <div className='bg-surface border border-border rounded-lg w-full max-w-md mx-4 p-6 space-y-5'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold text-foreground'>{editingId ? 'Edit Client' : 'Add Client'}</h3>
              <button onClick={() => setFormOpen(false)} className='text-foreground-muted hover:text-foreground'>
                <HiX size={20} />
              </button>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='admin-label'>
                  <HiUser size={13} className='inline mr-1' />
                  Name <span className='text-red-400'>*</span>
                </label>
                <input className='admin-input' value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder='e.g. John Smith' />
              </div>

              <div>
                <label className='admin-label'>
                  <HiPhone size={13} className='inline mr-1' />
                  Phone <span className='text-red-400'>*</span>
                </label>
                <input className='admin-input' value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder='e.g. +1-868-000-0000' />
              </div>

              <div>
                <label className='admin-label'>
                  <HiMail size={13} className='inline mr-1' />
                  Email
                </label>
                <input type='email' className='admin-input' value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder='client@example.com' />
              </div>

              <div>
                <label className='admin-label'>
                  <HiLocationMarker size={13} className='inline mr-1' />
                  Address
                </label>
                <input className='admin-input' value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder='Street, City' />
              </div>

              <div>
                <label className='admin-label'>Notes</label>
                <textarea className='admin-input resize-none' rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder='Internal notes…' />
              </div>
            </div>

            <div className='flex gap-3 pt-1'>
              <button onClick={() => setFormOpen(false)} className='flex-1 py-2 border border-border text-foreground-muted rounded text-sm hover:border-foreground-muted transition-colors'>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim() || !form.phone.trim()}
                className='flex-1 py-2 bg-gold text-black rounded text-sm font-semibold hover:bg-gold-light transition-colors disabled:opacity-50'
              >
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Client'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
          <div className='bg-surface border border-border rounded-lg w-full max-w-sm mx-4 p-6 space-y-4'>
            <h3 className='font-semibold text-foreground'>Delete Client?</h3>
            <p className='text-sm text-foreground-muted'>This only removes the client record. Their jobs will remain but will be unlinked.</p>
            <div className='flex gap-3'>
              <button onClick={() => setDeleteConfirm(null)} className='flex-1 py-2 border border-border text-foreground-muted rounded text-sm hover:border-foreground-muted transition-colors'>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className='flex-1 py-2 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-500 transition-colors'>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-label { display:block; font-size:0.75rem; font-weight:500; color:var(--foreground-muted); margin-bottom:0.35rem; }
        .admin-input { width:100%; background:var(--background); border:1px solid var(--border); color:var(--foreground); padding:0.5rem 0.75rem; border-radius:0.375rem; font-size:0.875rem; outline:none; }
        .admin-input:focus { border-color:var(--gold); }
      `}</style>
    </div>
  );
}
