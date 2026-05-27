'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/firestore';
import type { Project } from '@/types';
import { HiArrowLeft, HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import ImageUploader from '@/components/ImageUploader';

const emptyForm = {
  title: '',
  description: '',
  category: 'kitchen' as Project['category'],
  images: [] as string[],
  beforeImages: [] as string[],
  featured: false,
};

type FormData = typeof emptyForm;

export default function AdminProjectsPage() {
  return (
    <AdminGuard>
      <ProjectsContent />
    </AdminGuard>
  );
}

function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setProjects(await getProjects());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };
  const openEdit = (p: Project) => {
    setForm({
      title: p.title,
      description: p.description,
      category: p.category,
      images: p.images,
      beforeImages: p.beforeImages ?? [],
      featured: p.featured,
    });
    setEditingId(p.id);
    setFormOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        title: form.title,
        description: form.description,
        category: form.category,
        images: form.images,
        beforeImages: form.beforeImages,
        featured: form.featured,
      };
      if (editingId) {
        await updateProject(editingId, data);
      } else {
        await createProject(data);
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      console.error(err);
      alert('Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setDeleteConfirm(null);
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
          <h1 className='font-display text-lg font-semibold'>Projects</h1>
          <button onClick={openNew} className='ml-auto flex items-center gap-2 px-4 py-2 bg-gold text-background text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors'>
            <HiPlus size={14} /> Add Project
          </button>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        {formOpen && (
          <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4'>
            <div className='w-full max-w-xl bg-surface border border-border my-8'>
              <div className='flex items-center justify-between p-6 border-b border-border'>
                <h2 className='font-display text-xl font-semibold'>{editingId ? 'Edit Project' : 'Add Project'}</h2>
                <button onClick={() => setFormOpen(false)}>
                  <HiX size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} className='p-6 space-y-4'>
                <div>
                  <label className='admin-label'>Project Title *</label>
                  <input name='title' value={form.title} onChange={handleChange} required className='admin-input' placeholder='Modern Kitchen — Sandton' />
                </div>
                <div>
                  <label className='admin-label'>Category</label>
                  <select name='category' value={form.category} onChange={handleChange} className='admin-input'>
                    {['kitchen', 'flooring', 'commercial', 'bathroom', 'outdoor', 'other'].map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='admin-label'>Description</label>
                  <textarea name='description' value={form.description} onChange={handleChange} rows={3} className='admin-input resize-none' />
                </div>
                <div>
                  <ImageUploader label='Project Images (first is main image)' value={form.images} onChange={(urls) => setForm((prev) => ({ ...prev, images: urls }))} />
                </div>
                <div>
                  <ImageUploader label='Before Images (optional — for before/after comparison)' value={form.beforeImages} onChange={(urls) => setForm((prev) => ({ ...prev, beforeImages: urls }))} />
                </div>
                <label className='flex items-center gap-2 cursor-pointer text-sm'>
                  <input type='checkbox' name='featured' checked={form.featured} onChange={handleChange} className='accent-gold' />
                  Featured on homepage
                </label>
                <div className='flex gap-3 pt-2'>
                  <button type='submit' disabled={saving} className='px-6 py-2.5 bg-gold hover:bg-gold-light text-background text-sm font-semibold transition-colors disabled:opacity-60'>
                    {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                  </button>
                  <button type='button' onClick={() => setFormOpen(false)} className='px-6 py-2.5 border border-border text-sm hover:border-foreground-muted transition-colors'>
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
        ) : projects.length === 0 ? (
          <div className='py-20 text-center border border-border'>
            <p className='text-foreground-muted text-sm mb-4'>No projects yet.</p>
            <button onClick={openNew} className='px-5 py-2 border border-gold text-gold hover:bg-gold hover:text-background text-sm transition-colors'>
              Add First Project
            </button>
          </div>
        ) : (
          <div className='border border-border overflow-hidden'>
            <table className='w-full text-sm'>
              <thead className='bg-surface border-b border-border'>
                <tr>
                  <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Title</th>
                  <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted hidden sm:table-cell'>Category</th>
                  <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted hidden md:table-cell'>Featured</th>
                  <th className='text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {projects.map((p) => (
                  <tr key={p.id} className='hover:bg-surface transition-colors'>
                    <td className='px-4 py-3 font-medium'>{p.title}</td>
                    <td className='px-4 py-3 text-foreground-muted capitalize hidden sm:table-cell'>{p.category}</td>
                    <td className='px-4 py-3 hidden md:table-cell'>
                      <span className={`text-[11px] ${p.featured ? 'text-gold' : 'text-foreground-muted'}`}>{p.featured ? 'Yes' : 'No'}</span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2 justify-end'>
                        <button onClick={() => openEdit(p)} className='p-1.5 text-foreground-muted hover:text-gold transition-colors'>
                          <HiPencil size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirm(p.id)} className='p-1.5 text-foreground-muted hover:text-red-400 transition-colors'>
                          <HiTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {deleteConfirm && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4'>
            <div className='bg-surface border border-border p-6 max-w-sm w-full'>
              <h3 className='font-display text-xl font-semibold mb-2'>Delete Project?</h3>
              <p className='text-sm text-foreground-muted mb-6'>This cannot be undone.</p>
              <div className='flex gap-3'>
                <button onClick={() => handleDelete(deleteConfirm)} className='px-5 py-2 bg-red-900 hover:bg-red-800 text-red-100 text-sm font-semibold'>
                  Delete
                </button>
                <button onClick={() => setDeleteConfirm(null)} className='px-5 py-2 border border-border text-sm'>
                  Cancel
                </button>
              </div>
            </div>
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
