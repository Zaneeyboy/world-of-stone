type LoaderParams = { src: string; width: number; quality?: number };

/**
 * Custom Next.js image loader for Cloudflare Images.
 *
 * For CF Images URLs (imagedelivery.net):
 *   strips the existing variant segment and applies a responsive flexible variant
 *   e.g. https://imagedelivery.net/{hash}/{id}/public → /w=1080,q=85
 *
 * All other sources (Firebase Storage, local paths, Unsplash placeholders)
 *   are returned as-is and served directly.
 */
export default function cfImageLoader({ src, width, quality }: LoaderParams): string {
  if (src.includes('imagedelivery.net')) {
    // URL structure: https://imagedelivery.net/{accountHash}/{imageId}/{variant}
    // split('/') → ['https:', '', 'imagedelivery.net', hash, id, variant]
    // slice(0, 5) → ['https:', '', 'imagedelivery.net', hash, id]
    const base = src.split('/').slice(0, 5).join('/');
    return `${base}/w=${width},q=${quality ?? 85}`;
  }
  // Firebase Storage, Unsplash, blob previews, local public paths — direct serve
  return src;
}
