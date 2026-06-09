import Image from 'next/image';
import Link from 'next/link';
import { type Vehicle, getBadge } from '@/lib/vehicle';
import { getWeeklyPayment } from '@/lib/payments';
import { dealer } from '@/config/dealerships/right-price';

const BADGE_COLORS: Record<string, string> = {
  'Just In':    'bg-primary',
  'Low Miles':  'bg-emerald-600',
  'Under $10k': 'bg-amber-500',
};

export default function InventoryListCard({ vehicle }: { vehicle: Vehicle }) {
  const badge = getBadge(vehicle);
  const weekly = getWeeklyPayment(vehicle.price);
  const photo = vehicle.photo_urls?.[0];
  const applyUrl = `${dealer.creditAppUrl}?vin=${vehicle.vin}`;
  const callUrl = `tel:${dealer.phone.replace(/[^0-9]/g, '')}`;
  const miles = parseFloat(vehicle.miles ?? '0');

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col sm:flex-row">

      {/* Photo */}
      <Link
        href={`/inventory/${vehicle.vin}`}
        className="relative w-full sm:w-72 md:w-80 flex-none aspect-video sm:aspect-auto bg-surface block overflow-hidden group"
      >
        {photo ? (
          <Image
            src={photo}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-200"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M19 9l-1.5-4.5A2 2 0 0015.62 3H8.38a2 2 0 00-1.88 1.5L5 9M3 9h18l1 2v6a1 1 0 01-1 1h-1a2 2 0 01-4 0H8a2 2 0 01-4 0H3a1 1 0 01-1-1v-6l1-2z" />
            </svg>
          </div>
        )}
        {badge && (
          <span className={`absolute top-3 left-3 ${BADGE_COLORS[badge] ?? 'bg-secondary'} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
            {badge}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5">

        {/* Title + trim */}
        <Link href={`/inventory/${vehicle.vin}`} className="block group/title">
          <h3 className="font-bold text-secondary text-xl leading-snug group-hover/title:text-primary transition-colors">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.trim && (
            <p className="text-sm text-muted mt-0.5">{vehicle.trim}</p>
          )}
        </Link>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="text-primary font-extrabold text-2xl">
            ${vehicle.price.toLocaleString()}
          </span>
          {weekly && (
            <span className="text-sm text-muted">est. ${weekly}/wk</span>
          )}
        </div>

        {/* Specs */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {miles > 0 ? `${miles.toLocaleString()} mi` : 'Miles TBD'}
          </span>
          {vehicle.body && (
            <>
              <span className="text-gray-300">·</span>
              <span>{vehicle.body}</span>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="mt-4 border-t border-gray-100" />

        {/* CTAs */}
        <div className="mt-4 flex gap-3">
          <Link
            href={applyUrl}
            className="flex-1 text-center text-sm font-semibold text-white bg-secondary rounded-lg py-2.5 hover:bg-secondary/90 transition-colors"
          >
            Apply Now
          </Link>
          <a
            href={callUrl}
            className="flex-none px-5 text-center text-sm font-semibold text-secondary border border-secondary/30 rounded-lg py-2.5 hover:bg-secondary hover:text-white hover:border-secondary transition-colors"
          >
            Call
          </a>
        </div>

      </div>
    </div>
  );
}
