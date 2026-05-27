export function SkeletonCard() {
  return (
    <div className='bg-surface border border-border animate-pulse'>
      <div className='aspect-[4/3] bg-surface-2' />
      <div className='p-4 space-y-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='h-5 bg-surface-2 rounded w-2/3' />
          <div className='h-4 bg-surface-2 rounded w-12' />
        </div>
        <div className='flex gap-1.5'>
          <div className='h-3.5 bg-surface-2 rounded w-10' />
          <div className='h-3.5 bg-surface-2 rounded w-10' />
        </div>
        <div className='space-y-1.5'>
          <div className='h-3 bg-surface-2 rounded w-full' />
          <div className='h-3 bg-surface-2 rounded w-4/5' />
        </div>
        <div className='pt-2 border-t border-border flex items-center justify-between'>
          <div className='h-4 bg-surface-2 rounded w-20' />
          <div className='h-8 bg-surface-2 rounded w-24' />
        </div>
      </div>
    </div>
  );
}

export function SkeletonProjectCard() {
  return (
    <div className='bg-surface border border-border animate-pulse'>
      <div className='aspect-[4/3] bg-surface-2' />
      <div className='p-5 space-y-2'>
        <div className='h-5 bg-surface-2 rounded w-3/4' />
        <div className='h-3 bg-surface-2 rounded w-full' />
        <div className='h-3 bg-surface-2 rounded w-2/3' />
      </div>
    </div>
  );
}
