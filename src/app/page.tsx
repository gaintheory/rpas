import Hero from '@/components/hero/Hero';
import TrustBar from '@/components/trust/TrustBar';
import SellYourCar from '@/components/sell/SellYourCar';
import WarrantyComparison from '@/components/warranty/WarrantyComparison';
import ContactSection from '@/components/contact/ContactSection';
import InventoryStrip from '@/components/inventory/InventoryStrip';
import Testimonials from '@/components/testimonials/Testimonials';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <InventoryStrip />
      <SellYourCar />
      <WarrantyComparison />
      <ContactSection />
      <Testimonials />
    </>
  );
}
