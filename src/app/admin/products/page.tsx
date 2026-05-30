'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { getAllProductsAdmin, updateProduct, deleteProduct, createProduct, generateSlug } from '@/lib/firestore';
import type { Product, MaterialType, AvailabilityStatus } from '@/types';
import { HiPencil, HiTrash, HiEye, HiEyeOff, HiPlus, HiX, HiSearch } from 'react-icons/hi';
import ImageUploader from '@/components/ImageUploader';

const MATERIAL_TYPES: MaterialType[] = ['granite', 'marble', 'quartz', 'limestone', 'travertine', 'sandstone', 'slate', 'other'];

const emptyForm = {
  name: '',
  description: '',
  materialType: 'granite' as MaterialType,
  color: '',
  colorTags: '',
  price: '',
  pricePerSqFt: '',
  pricePerSheet: '',
  priceUnit: 'per sq ft',
  availability: 'in_stock' as Product['availability'],
  useCases: '',
  featured: false,
  hidden: false,
  images: [] as string[],
  rankOrder: '0',
};

type FormData = typeof emptyForm;

export default function AdminProductsPage() {
  return (
    <AdminShell title='Products'>
      <ProductsContent />
    </AdminShell>
  );
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [filterMaterial, setFilterMaterial] = useState<MaterialType | ''>('');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'visible' | 'hidden'>('all');

  // Bulk select
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Derived filtered list
  const filteredProducts = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterMaterial && p.materialType !== filterMaterial) return false;
    if (filterVisibility === 'visible' && p.hidden) return false;
    if (filterVisibility === 'hidden' && !p.hidden) return false;
    return true;
  });

  const allSelected = filteredProducts.length > 0 && filteredProducts.every((p) => selected.has(p.id));

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredProducts.map((p) => p.id)));
    }
  }

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProductsAdmin();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      materialType: product.materialType,
      color: product.color,
      colorTags: product.colorTags.join(', '),
      price: product.price?.toString() ?? '',
      pricePerSqFt: product.pricePerSqFt?.toString() ?? '',
      pricePerSheet: product.pricePerSheet?.toString() ?? '',
      priceUnit: product.priceUnit ?? 'per sq ft',
      availability: product.availability,
      useCases: product.useCases.join(', '),
      featured: product.featured,
      hidden: product.hidden,
      images: product.images,
      rankOrder: product.rankOrder?.toString() ?? '0',
    });
    setEditingId(product.id);
    setFormOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = generateSlug(form.name);
      const data = {
        name: form.name,
        slug,
        description: form.description,
        materialType: form.materialType,
        color: form.color,
        colorTags: form.colorTags
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        price: form.price ? Number(form.price) : null,
        pricePerSqFt: form.pricePerSqFt ? Number(form.pricePerSqFt) : null,
        pricePerSheet: form.pricePerSheet ? Number(form.pricePerSheet) : null,
        priceUnit: form.priceUnit || 'per sq ft',
        availability: form.availability,
        useCases: form.useCases
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        featured: form.featured,
        hidden: form.hidden,
        images: form.images,
        rankOrder: Number(form.rankOrder) || 0,
      };

      if (editingId) {
        await updateProduct(editingId, data);
      } else {
        await createProduct(data);
      }

      setFormOpen(false);
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to save product. Check console.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleHide = async (product: Product) => {
    await updateProduct(product.id, { hidden: !product.hidden });
    await loadProducts();
  };

  const handleAvailabilityChange = async (product: Product, availability: AvailabilityStatus) => {
    await updateProduct(product.id, { availability });
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, availability } : p)));
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirm(null);
    await loadProducts();
  };

  const handleBulkHide = async () => {
    await Promise.all([...selected].map((id) => updateProduct(id, { hidden: true })));
    setSelected(new Set());
    await loadProducts();
  };

  const handleBulkShow = async () => {
    await Promise.all([...selected].map((id) => updateProduct(id, { hidden: false })));
    setSelected(new Set());
    await loadProducts();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} product${selected.size !== 1 ? 's' : ''}? This cannot be undone.`)) return;
    setBulkDeleting(true);
    try {
      await Promise.all([...selected].map((id) => deleteProduct(id)));
      setSelected(new Set());
      await loadProducts();
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-6 py-8'>
      {/* Page header */}
      <div className='flex items-center justify-between mb-8'>
        <p className='text-foreground-muted text-sm'>Add, edit, and manage your stone catalog.</p>
        <button onClick={openNew} className='flex items-center gap-2 px-4 py-2 bg-gold text-background text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors'>
          <HiPlus size={14} />
          Add Product
        </button>
      </div>
      {/* Product form modal */}
      {formOpen && (
        <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4'>
          <div className='w-full max-w-2xl bg-surface border border-border my-8'>
            <div className='flex items-center justify-between p-6 border-b border-border'>
              <h2 className='font-display text-xl font-semibold'>{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setFormOpen(false)} className='text-foreground-muted hover:text-foreground'>
                <HiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className='p-6 space-y-5'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='sm:col-span-2'>
                  <label className='admin-label'>Product Name *</label>
                  <input name='name' value={form.name} onChange={handleChange} required className='admin-input' placeholder='Black Galaxy Granite' />
                </div>

                <div>
                  <label className='admin-label'>Material Type *</label>
                  <select name='materialType' value={form.materialType} onChange={handleChange} className='admin-input'>
                    {MATERIAL_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='admin-label'>Availability</label>
                  <select name='availability' value={form.availability} onChange={handleChange} className='admin-input'>
                    <option value='in_stock'>In Stock</option>
                    <option value='limited'>Limited Stock</option>
                    <option value='by_order'>By Order</option>
                    <option value='out_of_stock'>Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className='admin-label'>Color</label>
                  <input name='color' value={form.color} onChange={handleChange} className='admin-input' placeholder='Black with gold flecks' />
                </div>

                <div>
                  <label className='admin-label'>Color Tags (comma-separated)</label>
                  <input name='colorTags' value={form.colorTags} onChange={handleChange} className='admin-input' placeholder='black, gold, dark' />
                </div>

                <div>
                  <label className='admin-label'>Price per Sq Ft (TTD, optional)</label>
                  <input type='number' name='pricePerSqFt' value={form.pricePerSqFt} onChange={handleChange} className='admin-input' placeholder='120' />
                </div>

                <div>
                  <label className='admin-label'>Price per Sheet (TTD, optional)</label>
                  <input type='number' name='pricePerSheet' value={form.pricePerSheet} onChange={handleChange} className='admin-input' placeholder='4500' />
                </div>

                <div>
                  <label className='admin-label'>Custom Price (TTD, optional)</label>
                  <input type='number' name='price' value={form.price} onChange={handleChange} className='admin-input' placeholder='850' />
                </div>

                <div>
                  <label className='admin-label'>Custom Price Unit</label>
                  <input name='priceUnit' value={form.priceUnit} onChange={handleChange} className='admin-input' placeholder='per sq ft' />
                </div>

                <div>
                  <label className='admin-label'>Rank Order</label>
                  <input type='number' name='rankOrder' value={form.rankOrder} onChange={handleChange} className='admin-input' placeholder='0' />
                </div>

                <div className='flex items-center gap-6 pt-2'>
                  <label className='flex items-center gap-2 cursor-pointer text-sm'>
                    <input type='checkbox' name='featured' checked={form.featured} onChange={handleChange} className='accent-gold' />
                    Featured
                  </label>
                  <label className='flex items-center gap-2 cursor-pointer text-sm'>
                    <input type='checkbox' name='hidden' checked={form.hidden} onChange={handleChange} className='accent-gold' />
                    Hidden
                  </label>
                </div>

                <div className='sm:col-span-2'>
                  <label className='admin-label'>Use Cases (comma-separated)</label>
                  <input name='useCases' value={form.useCases} onChange={handleChange} className='admin-input' placeholder='kitchen, flooring, walls, bathroom' />
                </div>

                <div className='sm:col-span-2'>
                  <label className='admin-label'>Description *</label>
                  <textarea
                    name='description'
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className='admin-input resize-none'
                    placeholder="Describe the stone's characteristics, finish, and qualities..."
                  />
                </div>

                <div className='sm:col-span-2'>
                  <ImageUploader label='Product Images (first is main image)' value={form.images} onChange={(urls) => setForm((prev) => ({ ...prev, images: urls }))} />
                </div>
              </div>

              <div className='flex gap-3 pt-2'>
                <button type='submit' disabled={saving} className='px-6 py-2.5 bg-gold hover:bg-gold-light text-background text-sm font-semibold transition-colors disabled:opacity-60'>
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button type='button' onClick={() => setFormOpen(false)} className='px-6 py-2.5 border border-border hover:border-foreground-muted text-sm transition-colors'>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className='flex flex-wrap items-center gap-3 mb-6'>
        <div className='relative flex-1 min-w-45'>
          <HiSearch size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none' />
          <input className='admin-input pl-8' placeholder='Search products…' value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className='admin-input w-auto' value={filterMaterial} onChange={(e) => setFilterMaterial(e.target.value as MaterialType | '')}>
          <option value=''>All materials</option>
          {MATERIAL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <div className='flex border border-border rounded overflow-hidden text-xs'>
          {(['all', 'visible', 'hidden'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilterVisibility(v)}
              className={`px-3 py-2 capitalize transition-colors ${filterVisibility === v ? 'bg-gold text-black font-semibold' : 'text-foreground-muted hover:text-foreground'}`}
            >
              {v}
            </button>
          ))}
        </div>
        <span className='text-xs text-foreground-muted ml-auto'>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className='flex items-center gap-3 px-4 py-2.5 bg-surface border border-gold/30 rounded mb-4'>
          <span className='text-sm text-foreground-muted'>{selected.size} selected</span>
          <div className='flex gap-2 ml-auto'>
            <button onClick={handleBulkShow} className='px-3 py-1.5 text-xs border border-border hover:border-gold text-foreground-muted hover:text-gold rounded transition-colors'>
              Show
            </button>
            <button onClick={handleBulkHide} className='px-3 py-1.5 text-xs border border-border hover:border-gold text-foreground-muted hover:text-gold rounded transition-colors'>
              Hide
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className='px-3 py-1.5 text-xs border border-red-800 text-red-400 hover:bg-red-900/30 rounded transition-colors disabled:opacity-50'
            >
              {bulkDeleting ? 'Deleting…' : 'Delete'}
            </button>
            <button onClick={() => setSelected(new Set())} className='px-3 py-1.5 text-xs text-foreground-muted hover:text-foreground transition-colors'>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Products table */}
      {loading ? (
        <div className='flex items-center justify-center py-20'>
          <div className='w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin' />
        </div>
      ) : products.length === 0 ? (
        <div className='py-20 text-center border border-border'>
          <p className='text-foreground-muted text-sm mb-4'>No products yet.</p>
          <button onClick={openNew} className='px-5 py-2 border border-gold text-gold hover:bg-gold hover:text-background text-sm transition-colors'>
            Add First Product
          </button>
        </div>
      ) : (
        <div className='border border-border overflow-hidden'>
          <table className='w-full text-sm'>
            <thead className='bg-surface border-b border-border'>
              <tr>
                <th className='px-4 py-3 w-10'>
                  <input type='checkbox' checked={allSelected} onChange={toggleSelectAll} className='accent-gold cursor-pointer' />
                </th>
                <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Name</th>
                <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted hidden md:table-cell'>Type</th>
                <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted hidden lg:table-cell'>Availability</th>
                <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted hidden sm:table-cell'>Views</th>
                <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Status</th>
                <th className='text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredProducts.map((product) => (
                <tr key={product.id} className={`hover:bg-surface transition-colors ${product.hidden ? 'opacity-50' : ''}`}>
                  <td className='px-4 py-3'>
                    <input type='checkbox' checked={selected.has(product.id)} onChange={() => toggleSelect(product.id)} className='accent-gold cursor-pointer' />
                  </td>
                  <td className='px-4 py-3'>
                    <div>
                      <p className='font-medium'>{product.name}</p>
                      {product.featured && <span className='text-[10px] text-gold uppercase tracking-wider'>Featured</span>}
                    </div>
                  </td>
                  <td className='px-4 py-3 text-foreground-muted capitalize hidden md:table-cell'>{product.materialType}</td>
                  <td className='px-4 py-3 hidden lg:table-cell'>
                    <select
                      value={product.availability}
                      onChange={(e) => handleAvailabilityChange(product, e.target.value as AvailabilityStatus)}
                      className='text-xs bg-background border border-border text-foreground px-2 py-1 rounded outline-none focus:border-gold transition-colors'
                    >
                      <option value='in_stock'>In Stock</option>
                      <option value='limited'>Limited</option>
                      <option value='by_order'>By Order</option>
                      <option value='out_of_stock'>Out of Stock</option>
                    </select>
                  </td>
                  <td className='px-4 py-3 text-foreground-muted hidden sm:table-cell'>{product.viewCount}</td>
                  <td className='px-4 py-3'>
                    <span className={`text-[11px] font-medium ${product.hidden ? 'text-foreground-muted' : 'text-emerald-400'}`}>{product.hidden ? 'Hidden' : 'Visible'}</span>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-2 justify-end'>
                      <Link href={`/product/${product.slug}`} target='_blank' className='p-1.5 text-foreground-muted hover:text-foreground transition-colors' title='View'>
                        <HiEye size={16} />
                      </Link>
                      <button onClick={() => handleToggleHide(product)} className='p-1.5 text-foreground-muted hover:text-gold transition-colors' title={product.hidden ? 'Show' : 'Hide'}>
                        {product.hidden ? <HiEye size={16} /> : <HiEyeOff size={16} />}
                      </button>
                      <button onClick={() => openEdit(product)} className='p-1.5 text-foreground-muted hover:text-gold transition-colors' title='Edit'>
                        <HiPencil size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirm(product.id)} className='p-1.5 text-foreground-muted hover:text-red-400 transition-colors' title='Delete'>
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

      {/* Delete confirm dialog */}
      {deleteConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4'>
          <div className='bg-surface border border-border p-6 max-w-sm w-full'>
            <h3 className='font-display text-xl font-semibold mb-2'>Delete Product?</h3>
            <p className='text-sm text-foreground-muted mb-6'>This action cannot be undone. The product and all associated data will be permanently deleted.</p>
            <div className='flex gap-3'>
              <button onClick={() => handleDelete(deleteConfirm)} className='px-5 py-2 bg-red-900 hover:bg-red-800 text-red-100 text-sm font-semibold transition-colors'>
                Delete Permanently
              </button>
              <button onClick={() => setDeleteConfirm(null)} className='px-5 py-2 border border-border text-sm hover:border-foreground-muted transition-colors'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin input styles via Tailwind @apply workaround */}
      <style>{`
        .admin-label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--foreground-muted); margin-bottom: 6px; }
        .admin-input { width: 100%; background: var(--background); border: 1px solid var(--border); color: var(--foreground); font-size: 14px; padding: 10px 14px; outline: none; transition: border-color 0.15s; }
        .admin-input:focus { border-color: var(--gold); }
        .admin-input::placeholder { color: color-mix(in srgb, var(--foreground-muted) 50%, transparent); }
        select.admin-input option { background: var(--surface); }
      `}</style>
    </div>
  );
}
