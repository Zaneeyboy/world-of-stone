'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { HiPhotograph, HiX, HiStar, HiPencil } from 'react-icons/hi';

const ACCOUNT_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH ?? '';

function buildDeliveryUrl(imageId: string): string {
  return `https://imagedelivery.net/${ACCOUNT_HASH}/${imageId}/public`;
}

function extractCfId(url: string): string | null {
  const match = url.match(/imagedelivery\.net\/[^/]+\/([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
}

interface UploadingItem {
  file: File;
  preview: string;
  progress: 'uploading' | 'done' | 'error';
}

export default function ImageUploader({ value, onChange, maxImages = 8, label = 'Images' }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replacingSlotRef = useRef<number | null>(null);

  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [replacingIdx, setReplacingIdx] = useState<number | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const res = await fetch('/api/upload', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to get upload URL');
    const { uploadURL, id } = (await res.json()) as { uploadURL: string; id: string };
    const form = new FormData();
    form.append('file', file);
    const uploadRes = await fetch(uploadURL, { method: 'POST', body: form });
    if (!uploadRes.ok) throw new Error('Cloudflare upload failed');
    return buildDeliveryUrl(id);
  };

  const processFiles = async (files: File[]) => {
    const allowed = files.slice(0, maxImages - value.length);
    if (!allowed.length) return;
    const items: UploadingItem[] = allowed.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      progress: 'uploading' as const,
    }));
    setUploading((prev) => [...prev, ...items]);
    const results: string[] = [];
    for (let i = 0; i < items.length; i++) {
      try {
        const url = await uploadFile(items[i].file);
        results.push(url);
        setUploading((prev) => prev.map((u) => (u === items[i] ? { ...u, progress: 'done' as const } : u)));
      } catch {
        setUploading((prev) => prev.map((u) => (u === items[i] ? { ...u, progress: 'error' as const } : u)));
      }
    }
    onChange([...value, ...results]);
    setTimeout(() => {
      items.forEach((u) => URL.revokeObjectURL(u.preview));
      setUploading((prev) => prev.filter((u) => !items.includes(u)));
    }, 400);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    processFiles(Array.from(files).filter((f) => f.type.startsWith('image/')));
  };

  const removeUrl = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  /** Reorder so the chosen image becomes index 0 (featured/main) */
  const setAsMain = (idx: number) => {
    if (idx === 0) return;
    const next = [...value];
    const [moved] = next.splice(idx, 1);
    next.unshift(moved);
    onChange(next);
  };

  /** Open hidden file input to replace a specific slot in-place */
  const startReplace = (idx: number) => {
    replacingSlotRef.current = idx;
    replaceInputRef.current?.click();
  };

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const slotIdx = replacingSlotRef.current;
    if (slotIdx === null || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const oldUrl = value[slotIdx];
    const oldId = extractCfId(oldUrl);
    e.target.value = '';
    setReplacingIdx(slotIdx);
    try {
      const newUrl = await uploadFile(file);
      const next = [...value];
      next[slotIdx] = newUrl;
      onChange(next);
      if (oldId) fetch(`/api/upload?id=${encodeURIComponent(oldId)}`, { method: 'DELETE' });
    } finally {
      setReplacingIdx(null);
      replacingSlotRef.current = null;
    }
  };

  const canAddMore = value.length + uploading.filter((u) => u.progress !== 'error').length < maxImages;

  return (
    <div className='space-y-3'>
      {label && <p className='admin-label'>{label}</p>}

      {/* ── Uploaded images ── */}
      {value.length > 0 && (
        <div className={`grid gap-3 ${value.length === 1 ? 'grid-cols-1 max-w-xs' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {value.map((url, idx) => (
            <div
              key={url}
              className={`relative group aspect-video rounded-xl overflow-hidden border transition-all duration-300 ${
                idx === 0 ? 'border-gold/70 ring-2 ring-gold/15' : 'border-border/60'
              }`}
            >
              <Image
                src={url}
                alt={`Product image ${idx + 1}`}
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-105'
                sizes='(max-width: 640px) 50vw, 300px'
              />

              {/* Main badge */}
              {idx === 0 && (
                <div className='absolute top-2 left-2 z-10 flex items-center gap-1 bg-gold text-background text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow'>
                  <HiStar size={9} />
                  Main
                </div>
              )}

              {/* Replace spinner overlay */}
              {replacingIdx === idx && (
                <div className='absolute inset-0 z-20 bg-background/80 flex flex-col items-center justify-center gap-2 rounded-xl'>
                  <div className='w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin' />
                  <p className='text-[10px] text-foreground-muted'>Replacing…</p>
                </div>
              )}

              {/* Gradient scrim */}
              <div className='absolute inset-0 bg-linear-to-t from-background/85 via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none' />

              {/* Action bar — slides up on hover */}
              <div className='absolute bottom-0 inset-x-0 p-2 z-10 flex gap-1.5 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200'>
                {idx !== 0 && (
                  <button
                    type='button'
                    onClick={() => setAsMain(idx)}
                    title='Set as main image'
                    className='flex-1 flex items-center justify-center gap-1 py-1.5 bg-gold hover:bg-gold-light text-background text-[10px] font-bold uppercase tracking-wide rounded-lg transition-colors'
                  >
                    <HiStar size={10} />
                    Set Main
                  </button>
                )}
                <button
                  type='button'
                  onClick={() => startReplace(idx)}
                  title='Replace with a different image'
                  className='flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white/15 hover:bg-white/25 text-foreground text-[10px] font-semibold rounded-lg backdrop-blur-sm transition-colors'
                >
                  <HiPencil size={11} />
                  Change
                </button>
                <button
                  type='button'
                  onClick={() => removeUrl(idx)}
                  title='Remove image'
                  className='flex items-center justify-center p-1.5 bg-red-900/80 hover:bg-red-700 text-red-200 rounded-lg transition-colors'
                >
                  <HiX size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── In-progress uploads ── */}
      {uploading.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
          {uploading.map((u, i) => (
            <div
              key={i}
              className={`relative aspect-video rounded-xl overflow-hidden border ${
                u.progress === 'error' ? 'border-red-800/70 bg-red-900/10' : 'border-border/60'
              }`}
            >
              <Image src={u.preview} alt='Uploading' fill className='object-cover opacity-35' sizes='300px' />
              <div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
                {u.progress === 'uploading' && (
                  <>
                    <div className='w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin' />
                    <p className='text-[10px] text-foreground-muted'>Uploading…</p>
                  </>
                )}
                {u.progress === 'error' && (
                  <p className='text-[11px] text-red-300 font-semibold px-3 text-center'>Upload failed</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Drop zone ── */}
      {canAddMore && (
        <div
          role='button'
          tabIndex={0}
          className={`relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer outline-none ${
            dragOver ? 'border-gold bg-gold/5 scale-[1.01]' : 'border-border/60 hover:border-gold/40'
          }`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        >
          <div className='flex flex-col items-center gap-3 py-8 px-4 text-center pointer-events-none select-none'>
            <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 ${dragOver ? 'bg-gold/20 scale-110' : 'bg-white/5'}`}>
              <HiPhotograph size={22} className={`transition-colors duration-200 ${dragOver ? 'text-gold' : 'text-foreground-muted'}`} />
            </div>
            <div>
              <p className='text-sm text-foreground-muted'>
                <span className='text-gold font-medium'>Click to upload</span> or drag &amp; drop
              </p>
              <p className='text-[11px] text-foreground-muted mt-1'>
                PNG · JPG · WEBP &nbsp;·&nbsp; {maxImages - value.length} slot{maxImages - value.length !== 1 ? 's' : ''} remaining
              </p>
              {value.length === 0 && maxImages > 1 && (
                <p className='text-[11px] text-gold/60 mt-1'>First image uploaded becomes the main image</p>
              )}
            </div>
          </div>
          <input ref={inputRef} type='file' accept='image/*' multiple className='hidden' onChange={(e) => handleFiles(e.target.files)} />
        </div>
      )}

      {/* Hidden replace input — triggered by startReplace() */}
      <input ref={replaceInputRef} type='file' accept='image/*' className='hidden' onChange={handleReplace} />
    </div>
  );
}
