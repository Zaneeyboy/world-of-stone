import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import PromotionBanner from '@/components/PromotionBanner';
import PromotionPopup from '@/components/PromotionPopup';
import { getActivePromotions } from '@/lib/firestore';
import type { Promotion } from '@/types';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://worldofstone.co.za'),
  title: {
    default: 'World of Stone — Premium Stone Materials',
    template: '%s | World of Stone',
  },
  description: 'Premium granite, marble, and natural stone materials for construction, kitchens, interiors, and commercial projects. Supplier and installer based in South Africa.',
  keywords: ['granite', 'marble', 'natural stone', 'stone supplier', 'kitchen stone', 'floor tiles', 'stone installer', 'South Africa'],
  openGraph: {
    type: 'website',
    siteName: 'World of Stone',
    title: 'World of Stone — Premium Stone Materials',
    description: 'Premium granite, marble, and natural stone materials for construction, kitchens, interiors, and commercial projects.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let promotions: Promotion[] = [];
  try {
    promotions = await getActivePromotions();
  } catch {
    // Firestore unavailable during build or before setup — degrade gracefully
  }

  return (
    <html lang='en' className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className='min-h-full flex flex-col bg-background text-foreground antialiased'>
        <PromotionBanner promotions={promotions} />
        {children}
        <PromotionPopup promotions={promotions} />
      </body>
    </html>
  );
}
