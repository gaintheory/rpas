import Link from 'next/link';
import { dealer } from '@/config/dealerships/right-price';
import HeroInquiryForm from './HeroInquiryForm';

const BBB_URL = 'https://www.bbb.org/us/tn/murfreesboro/profile/used-car-dealers/right-price-auto-sales-inc-0573-37034137/#sealclick';

export default function Hero() {
  return (
    <section className="relative w-full h-[480px] md:h-[75vh] min-h-[480px] max-h-[900px] overflow-hidden">
      {/* Photo */}
      <div
        className="absolute inset-0 bg-cover animate-ken-burns"
        style={{ backgroundImage: "url('/storefront.jpg')", backgroundPosition: 'center 55%' }}
      />

      {/* Directional gradient — dark left for copy, opens up on right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />

      <HeroInquiryForm />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24">

        {/* Eyebrow pill */}
        <div className="mb-5">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-semibold tracking-[0.15em] uppercase rounded-full px-3.5 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-none" />
            Murfreesboro, TN · Since 1993
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-bold leading-[1.05] max-w-2xl"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}
        >
          <span className="block text-white text-2xl md:text-4xl lg:text-[2.75rem] font-semibold">
            Your credit history
          </span>
          <span className="block text-white/85 text-2xl md:text-4xl lg:text-[2.75rem] font-semibold italic">
            isn&apos;t the main character.
          </span>
          <span className="block text-primary text-[3.25rem] md:text-7xl lg:text-8xl font-extrabold leading-none mt-2">
            You are.
          </span>
        </h1>

        {/* Subhead */}
        <div className="mt-5 flex items-center gap-3 max-w-sm">
          <span className="w-6 h-px bg-white/30 flex-none" />
          <p className="text-white/65 text-sm md:text-base italic leading-relaxed">
            Tell us your story. We&apos;ve been listening since 1993.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xs sm:max-w-none">
          <Link
            href="/inventory"
            className="bg-primary text-white font-semibold text-sm rounded-full px-7 py-3 hover:opacity-90 transition-opacity shadow-lg inline-flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Browse Inventory
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href={`tel:${dealer.phone.replace(/[^0-9]/g, '')}`}
            className="border border-white/40 text-white font-semibold text-sm rounded-full px-7 py-3 hover:bg-white/10 transition-colors text-center w-full sm:w-auto"
          >
            Talk to Us
          </a>
        </div>
      </div>
    </section>
  );
}
