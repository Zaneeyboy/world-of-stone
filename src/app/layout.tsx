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
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://worldofstone.tt'),
  title: {
    default: 'World of Stone — Premium Stone Materials',
    template: '%s | World of Stone',
  },
  description: 'Premium granite, marble, and natural stone materials for kitchens, vanities, staircases, and commercial projects. Supplier and installer based in Trinidad & Tobago.',
  keywords: ['granite', 'marble', 'natural stone', 'stone supplier', 'Trinidad', 'Tobago', 'Caribbean', 'kitchen countertop', 'stone installer', 'TTD'],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [{ rel: 'icon', url: '/favicon.ico' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_TT',
    siteName: 'World of Stone',
    title: 'World of Stone — Premium Stone Materials',
    description: 'Premium granite, marble, and natural stone materials for kitchens, vanities, staircases, and commercial projects across Trinidad & Tobago.',
    images: [{ url: '/android-chrome-512x512.png', width: 512, height: 512 }],
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
