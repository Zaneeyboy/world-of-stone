'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import { getAllProductsAdmin, updateProduct, deleteProduct, createProduct, generateSlug } from '@/lib/firestore';
import type { Product, MaterialType } from '@/types';
import { HiPencil, HiTrash, HiEye, HiEyeOff, HiPlus, HiX, HiArrowLeft, HiChevronUp, HiChevronDown } from 'react-icons/hi';
import ImageUploader from '@/components/ImageUploader';

const MATERIAL_TYPES: MaterialType[] = ['granite', 'marble', 'quartz', 'limestone', 'travertine', 'sandstone', 'slate', 'other'];

const emptyForm = {
  name: '',
  description: '',
  materialType: 'granite' as MaterialType,
  color: '',
  colorTags: '',
  price: '',
  priceUnit: 'per m²',
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
    <AdminGuard>
      <ProductsContent />
    </AdminGuard>
  );
}

function ProductsContent() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
      priceUnit: product.priceUnit ?? 'per m²',
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
        priceUnit: form.priceUnit || 'per m²',
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

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirm(null);
    await loadProducts();
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
          <h1 className='font-display text-lg font-semibold'>Products</h1>
          <button onClick={openNew} className='ml-auto flex items-center gap-2 px-4 py-2 bg-gold text-background text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors'>
            <HiPlus size={14} />
            Add Product
          </button>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-6 py-8'>
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
                    <label className='admin-label'>Price (ZAR, optional)</label>
                    <input type='number' name='price' value={form.price} onChange={handleChange} className='admin-input' placeholder='850' />
                  </div>

                  <div>
                    <label className='admin-label'>Price Unit</label>
                    <input name='priceUnit' value={form.priceUnit} onChange={handleChange} className='admin-input' placeholder='per m²' />
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
                  <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Name</th>
                  <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted hidden md:table-cell'>Type</th>
                  <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted hidden lg:table-cell'>Price</th>
                  <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted hidden sm:table-cell'>Views</th>
                  <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Status</th>
                  <th className='text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {products.map((product) => (
                  <tr key={product.id} className={`hover:bg-surface transition-colors ${product.hidden ? 'opacity-50' : ''}`}>
                    <td className='px-4 py-3'>
                      <div>
                        <p className='font-medium'>{product.name}</p>
                        {product.featured && <span className='text-[10px] text-gold uppercase tracking-wider'>Featured</span>}
                      </div>
                    </td>
                    <td className='px-4 py-3 text-foreground-muted capitalize hidden md:table-cell'>{product.materialType}</td>
                    <td className='px-4 py-3 text-foreground-muted hidden lg:table-cell'>{product.price ? `R${product.price.toLocaleString()}` : 'Inquiry'}</td>
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
      </div>

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
