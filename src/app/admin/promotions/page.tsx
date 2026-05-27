'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard';
import { getAllPromotions, createPromotion, updatePromotion } from '@/lib/firestore';
import type { Promotion } from '@/types';
import { HiArrowLeft, HiPlus, HiX } from 'react-icons/hi';

const emptyForm = {
  title: '',
  message: '',
  type: 'banner' as Promotion['type'],
  active: true,
};

export default function AdminPromotionsPage() {
  return (
    <AdminGuard>
      <PromotionsContent />
    </AdminGuard>
  );
}

function PromotionsContent() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setPromotions(await getAllPromotions());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createPromotion({ title: form.title, message: form.message, type: form.type, active: form.active });
      setFormOpen(false);
      setForm(emptyForm);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p: Promotion) => {
    await updatePromotion(p.id, { active: !p.active });
    await load();
  };

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-40 bg-surface border-b border-border'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center gap-4'>
          <Link href='/admin' className='flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors text-sm'>
            <HiArrowLeft size={16} /> Dashboard
          </Link>
          <span className='text-border'>|</span>
          <h1 className='font-display text-lg font-semibold'>Promotions</h1>
          <button
            onClick={() => setFormOpen(true)}
            className='ml-auto flex items-center gap-2 px-4 py-2 bg-gold text-background text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors'
          >
            <HiPlus size={14} /> Add Promotion
          </button>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        {formOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4'>
            <div className='w-full max-w-md bg-surface border border-border'>
              <div className='flex items-center justify-between p-6 border-b border-border'>
                <h2 className='font-display text-xl font-semibold'>Add Promotion</h2>
                <button onClick={() => setFormOpen(false)}>
                  <HiX size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} className='p-6 space-y-4'>
                <div>
                  <label className='admin-label'>Title *</label>
                  <input name='title' value={form.title} onChange={handleChange} required className='admin-input' placeholder='New Marble Collection Available' />
                </div>
                <div>
                  <label className='admin-label'>Message *</label>
                  <textarea
                    name='message'
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={3}
                    className='admin-input resize-none'
                    placeholder="We've just received a limited supply of Italian Carrara marble slabs..."
                  />
                </div>
                <div>
                  <label className='admin-label'>Type</label>
                  <select name='type' value={form.type} onChange={handleChange} className='admin-input'>
                    <option value='banner'>Banner</option>
                    <option value='badge'>Badge</option>
                    <option value='popup'>Popup</option>
                  </select>
                </div>
                <label className='flex items-center gap-2 cursor-pointer text-sm'>
                  <input type='checkbox' name='active' checked={form.active} onChange={handleChange} className='accent-gold' />
                  Active immediately
                </label>
                <div className='flex gap-3 pt-2'>
                  <button type='submit' disabled={saving} className='px-6 py-2.5 bg-gold hover:bg-gold-light text-background text-sm font-semibold transition-colors disabled:opacity-60'>
                    {saving ? 'Saving...' : 'Create Promotion'}
                  </button>
                  <button type='button' onClick={() => setFormOpen(false)} className='px-6 py-2.5 border border-border text-sm'>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin' />
          </div>
        ) : promotions.length === 0 ? (
          <div className='py-20 text-center border border-border'>
            <p className='text-foreground-muted text-sm'>No promotions yet.</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {promotions.map((p) => (
              <div key={p.id} className={`border p-5 flex items-start justify-between gap-4 transition-colors ${p.active ? 'border-gold/30 bg-gold/5' : 'border-border bg-surface'}`}>
                <div>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='font-semibold text-sm'>{p.title}</p>
                    <span className='text-[10px] border border-border px-1.5 py-0.5 text-foreground-muted uppercase'>{p.type}</span>
                    {p.active && <span className='text-[10px] text-gold uppercase font-medium'>● Active</span>}
                  </div>
                  <p className='text-sm text-foreground-muted'>{p.message}</p>
                </div>
                <button
                  onClick={() => toggleActive(p)}
                  className={`flex-shrink-0 px-3 py-1.5 border text-xs font-medium transition-colors ${p.active ? 'border-red-900 text-red-400 hover:bg-red-950' : 'border-gold text-gold hover:bg-gold hover:text-background'}`}
                >
                  {p.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .admin-label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--foreground-muted); margin-bottom: 6px; }
        .admin-input { width: 100%; background: var(--background); border: 1px solid var(--border); color: var(--foreground); font-size: 14px; padding: 10px 14px; outline: none; transition: border-color 0.15s; }
        .admin-input:focus { border-color: var(--gold); }
        select.admin-input option { background: var(--surface); }
      `}</style>
    </div>
  );
}
