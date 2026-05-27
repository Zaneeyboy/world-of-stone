import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductDetailClient from './ProductDetailClient';
import { getProductBySlug, getProducts } from '@/lib/firestore';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await getProducts(undefined, 'newest', 100);
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = `${product.name} — ${product.materialType.charAt(0).toUpperCase() + product.materialType.slice(1)}`;
  const description = product.description.slice(0, 160);
  const image = product.images[0] ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://worldofstone.co.za/product/${product.slug}`,
      images: image ? [{ url: image, width: 1200, height: 630, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
    other: {
      // Product structured data
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images,
        brand: { '@type': 'Brand', name: 'World of Stone' },
        offers: product.price
          ? {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'ZAR',
              priceUnit: product.priceUnit ?? 'per m²',
              availability: product.availability === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
            }
          : undefined,
      }),
    },
  };
}

export const revalidate = 60;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ProductDetailClient product={product} />
      <Footer />
      <WhatsAppButton variant='floating' productId={product.id} productName={product.name} productSlug={product.slug} />
    </>
  );
}
