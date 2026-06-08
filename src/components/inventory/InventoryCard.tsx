import Image from 'next/image';
import { type Vehicle, getBadge } from '@/lib/vehicle';
import { getWeeklyPayment } from '@/lib/payments';

const BADGE_COLORS: Record<string, string> = {
  'Just In': 'bg-primary',
  'Low Miles': 'bg-emerald-600',
  'Under $10k': 'bg-amber-500',
};

export default function InventoryCard({ vehicle }: { vehicle: Vehicle }) {
  const badge = getBadge(vehicle);
  const weekly = getWeeklyPayment(vehicle.price);
  const photo = vehicle.photo_urls?.[0];
  const applyUrl = `https://vehicle-intake.vercel.app/credit?vin=${vehicle.vin}`;
  const miles = parseFloat(vehicle.miles ?? '0');

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-surface">
        {photo ? (
          <Image
            src={photo}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M19 9l-1.5-4.5A2 2 0 0015.62 3H8.38a2 2 0 00-1.88 1.5L5 9M3 9h18l1 2v6a1 1 0 01-1 1h-1a2 2 0 01-4 0H8a2 2 0 01-4 0H3a1 1 0 01-1-1v-6l1-2z" />
            </svg>
          </div>
        )}
        {badge && (
          <span className={`absolute top-2 left-2 ${BADGE_COLORS[badge] ?? 'bg-secondary'} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
            {badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-secondary text-sm leading-snug">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-primary font-bold text-xl">
            ${vehicle.price.toLocaleString()}
          </span>
          {weekly && (
            <span className="text-xs text-muted">est. ${weekly}/wk</span>
          )}
        </div>
        <p className="text-xs text-muted mt-0.5">
          {miles > 0 ? `${miles.toLocaleString()} mi` : 'Miles TBD'}
        </p>
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-3 block w-full text-center text-sm font-semibold text-white bg-secondary rounded-lg py-2 hover:bg-secondary/90 transition-colors"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
}
