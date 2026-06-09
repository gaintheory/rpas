import Link from 'next/link';
import { dealer } from '@/config/dealerships/right-price';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <p className="font-bold text-lg">Right Price Auto Sales</p>
            <p className="text-white/60 text-sm mt-1">Serving Middle Tennessee since 1993</p>
            <p className="mt-4 text-sm text-white/80">{dealer.address.full}</p>
            <a
              href={`tel:${dealer.phone.replace(/[^0-9]/g, '')}`}
              className="mt-1 block text-sm text-primary hover:underline"
            >
              {dealer.phone}
            </a>
            <a
              href={`mailto:${dealer.email}`}
              className="mt-1 block text-sm text-white/60 hover:text-white transition-colors"
            >
              {dealer.email}
            </a>

            {/* BBB Accredited badge */}
            <div className="mt-5">
              <a
                href="https://www.bbb.org/us/tn/murfreesboro/profile/used-car-dealers/right-price-auto-sales-inc-0573-37034137/#sealclick"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 hover:bg-white/10 transition-colors"
                title="BBB Accredited Business"
              >
                <span className="text-white font-black text-sm tracking-tight leading-none">BBB</span>
                <div className="w-px h-5 bg-white/20" />
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-white font-bold text-xs">A+ Rating</span>
                  <span className="text-white/50 text-[9px] uppercase tracking-widest">Accredited</span>
                </div>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <p className="font-semibold text-sm uppercase tracking-wider text-white/60 mb-3">Hours</p>
            <ul className="space-y-1">
              {dealer.hours.map(({ day, hours }) => (
                <li key={day} className="flex justify-between text-sm">
                  <span className="text-white/70">{day}</span>
                  <span className={hours === 'Closed' ? 'text-white/40' : 'text-white'}>{hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav + CTA */}
          <div>
            <p className="font-semibold text-sm uppercase tracking-wider text-white/60 mb-3">Navigate</p>
            <ul className="space-y-2">
              {[
                { label: 'Inventory', href: '/inventory' },
                { label: 'Apply Now', href: dealer.creditAppUrl, external: true },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href, external }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={dealer.creditAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-primary text-white text-sm font-semibold rounded-full px-5 py-2 hover:opacity-90 transition-opacity"
            >
              Start Your Application →
            </a>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Right Price Auto Sales Inc. All rights reserved.
          </p>
          <a
            href={dealer.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Get Directions →
          </a>
        </div>
      </div>
    </footer>
  );
}
