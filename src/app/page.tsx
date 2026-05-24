import NavbarWrapper from '@/components/NavbarWrapper';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function Home() {
  return (
    <>
      <NavbarWrapper />
      <Hero />
      <AboutSection />
      <FeaturedProducts />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
