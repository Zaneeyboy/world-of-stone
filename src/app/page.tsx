import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedMaterials from '@/components/FeaturedMaterials';
import MaterialCategories from '@/components/MaterialCategories';
import WhyChooseUs from '@/components/WhyChooseUs';
import RecentProjects from '@/components/RecentProjects';
import ContactBanner from '@/components/ContactBanner';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getFeaturedProducts, getProjects } from '@/lib/firestore';

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, recentProjects] = await Promise.all([
    getFeaturedProducts(6).catch(() => []),
    getProjects(true)
      .then((p) => p.slice(0, 3))
      .catch(() => []),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedMaterials products={featuredProducts} />
        <MaterialCategories />
        <RecentProjects projects={recentProjects} />
        <WhyChooseUs />
        <ContactBanner />
      </main>
      <Footer />
      <WhatsAppButton variant='floating' />
    </>
  );
}
