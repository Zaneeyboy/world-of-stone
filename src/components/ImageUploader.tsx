'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { HiUpload, HiX, HiPhotograph } from 'react-icons/hi';

const ACCOUNT_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH ?? '';

function buildDeliveryUrl(imageId: string): string {
  return `https://imagedelivery.net/${ACCOUNT_HASH}/${imageId}/public`;
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
  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    // 1. Get a one-time Cloudflare direct upload URL from our server
    const res = await fetch('/api/upload', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to get upload URL');
    const { uploadURL, id } = (await res.json()) as { uploadURL: string; id: string };

    // 2. POST the file directly to Cloudflare (never touches our server)
    const form = new FormData();
    form.append('file', file);
    const uploadRes = await fetch(uploadURL, { method: 'POST', body: form });
    if (!uploadRes.ok) throw new Error('Cloudflare upload failed');

    // 3. Return delivery URL
    return buildDeliveryUrl(id);
  };

  const processFiles = async (files: File[]) => {
    const allowed = files.slice(0, maxImages - value.length);
    if (!allowed.length) return;

    const items: UploadingItem[] = allowed.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      progress: 'uploading',
    }));
    setUploading((prev) => [...prev, ...items]);

    const results: string[] = [];
    for (let i = 0; i < items.length; i++) {
      try {
        const url = await uploadFile(items[i].file);
        results.push(url);
        setUploading((prev) => prev.map((u) => (u === items[i] ? { ...u, progress: 'done' } : u)));
      } catch {
        setUploading((prev) => prev.map((u) => (u === items[i] ? { ...u, progress: 'error' } : u)));
      }
    }

    onChange([...value, ...results]);
    // Clean up previews after 400ms so the transition is smooth
    setTimeout(() => {
      items.forEach((u) => URL.revokeObjectURL(u.preview));
      setUploading((prev) => prev.filter((u) => !items.includes(u)));
    }, 400);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    processFiles(arr);
  };

  const removeUrl = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const canAddMore = value.length + uploading.filter((u) => u.progress !== 'error').length < maxImages;

  return (
    <div className='space-y-3'>
      <p className='admin-label'>{label}</p>

      {/* Existing images */}
      {value.length > 0 && (
        <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
          {value.map((url, idx) => (
            <div key={url} className='relative group aspect-square bg-surface-2 border border-border overflow-hidden'>
              <Image src={url} alt={`Image ${idx + 1}`} fill className='object-cover' sizes='120px' />
              <button
                type='button'
                onClick={() => removeUrl(idx)}
                className='absolute top-1 right-1 w-6 h-6 bg-background/80 hover:bg-red-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-foreground hover:text-red-200'
                title='Remove image'
              >
                <HiX size={12} />
              </button>
              {idx === 0 && <span className='absolute bottom-1 left-1 text-[9px] bg-gold text-background px-1.5 py-0.5 font-semibold uppercase tracking-wider'>Main</span>}
            </div>
          ))}
        </div>
      )}

      {/* In-progress uploads */}
      {uploading.length > 0 && (
        <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
          {uploading.map((u, i) => (
            <div key={i} className={`relative aspect-square border overflow-hidden ${u.progress === 'error' ? 'border-red-800 bg-red-900/20' : 'border-border bg-surface-2'}`}>
              <Image src={u.preview} alt='Uploading' fill className='object-cover opacity-60' sizes='120px' />
              <div className='absolute inset-0 flex items-center justify-center'>
                {u.progress === 'uploading' && <div className='w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin' />}
                {u.progress === 'error' && <span className='text-[10px] text-red-300 font-semibold'>Failed</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canAddMore && (
        <div
          className={`relative border-2 border-dashed transition-colors duration-200 cursor-pointer ${dragOver ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/50'}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <div className='flex flex-col items-center gap-2 py-6 px-4 text-center pointer-events-none'>
            <HiPhotograph size={24} className={dragOver ? 'text-gold' : 'text-foreground-muted'} />
            <div>
              <p className='text-sm text-foreground-muted'>
                <span className='text-gold font-medium'>Click to upload</span> or drag & drop
              </p>
              <p className='text-[11px] text-foreground-muted mt-1'>PNG, JPG, WEBP · up to {maxImages - value.length} more</p>
            </div>
            <HiUpload size={14} className='text-foreground-muted' />
          </div>
          <input ref={inputRef} type='file' accept='image/*' multiple className='hidden' onChange={(e) => handleFiles(e.target.files)} />
        </div>
      )}
    </div>
  );
}
