import Header from '@/components/Header';
import Hero from '@/components/Hero';
import JewelryShowcase from '@/components/JewelryShowcase';
import WhoWeAre from '@/components/WhoWeAre';
import StyleStatement from '@/components/StyleStatement';
import ShopByCategory from '@/components/ShopByCategory';
import BangleShowcase from '@/components/BangleShowcase';
import DharmaAdvantages from '@/components/DharmaAdvantages';
import CustomerReviews from '@/components/CustomerReviews';
import Newsletter from '@/components/Newsletter';
import Values from '@/components/Values';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <JewelryShowcase />
      <WhoWeAre />
      <StyleStatement />
      <ShopByCategory />
      <BangleShowcase />
      <DharmaAdvantages />
      <CustomerReviews />
      <Newsletter />
     
      <Footer />
    </main>
  );
}
