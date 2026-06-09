'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type Vehicle, getBadge, normalizeDrivetrain } from '@/lib/vehicle';
import { getWeeklyPayment } from '@/lib/payments';
import { dealer } from '@/config/dealerships/right-price';

const BADGE_COLORS: Record<string, string> = {
  'Just In':    'bg-primary',
  'Low Miles':  'bg-emerald-600',
  'Under $10k': 'bg-amber-500',
};

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-secondary text-sm font-semibold text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}

function PhotoCarousel({ photos, alt }: { photos: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);

  if (!photos.length) {
    return (
      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M19 9l-1.5-4.5A2 2 0 0015.62 3H8.38a2 2 0 00-1.88 1.5L5 9M3 9h18l1 2v6a1 1 0 01-1 1h-1a2 2 0 01-4 0H8a2 2 0 01-4 0H3a1 1 0 01-1-1v-6l1-2z" />
        </svg>
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i - 1 + photos.length) % photos.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i + 1) % photos.length); };

  return (
    <div className="relative aspect-[4/3] bg-black overflow-hidden group">
      <Image
        src={photos[idx]}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      />
      {photos.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl leading-none opacity-0 group-hover:opacity-100 transition-opacity">
            ‹
          </button>
          <button onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl leading-none opacity-0 group-hover:opacity-100 transition-opacity">
            ›
          </button>
          <span className="absolute top-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {idx + 1} / {photos.length}
          </span>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.slice(0, 10).map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={`h-1.5 rounded-full transition-all duration-200 ${i === idx ? 'bg-white w-4' : 'bg-white/40 w-1.5'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function InventoryGridCard({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('rpas_favorites') ?? '[]');
      setLiked(saved.includes(vehicle.vin));
    } catch {}
  }, [vehicle.vin]);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('rpas_favorites') ?? '[]');
      const next = liked ? saved.filter(v => v !== vehicle.vin) : [...saved, vehicle.vin];
      localStorage.setItem('rpas_favorites', JSON.stringify(next));
      setLiked(!liked);
      window.dispatchEvent(new Event('rpas_favorites_changed'));
    } catch {}
  };

  const badge      = getBadge(vehicle);
  const weekly     = getWeeklyPayment(vehicle.price);
  const photos     = vehicle.photo_urls ?? [];
  const miles      = parseFloat(vehicle.miles ?? '0');
  const drivetrain = normalizeDrivetrain(vehicle.drivetrain);
  const applyUrl   = `${dealer.creditAppUrl}?vin=${vehicle.vin}`;
  const callUrl    = `tel:${dealer.phone.replace(/[^0-9]/g, '')}`;
  const emailUrl   = `mailto:${dealer.email}?subject=${encodeURIComponent(`Interest in ${vehicle.year} ${vehicle.make} ${vehicle.model} (VIN: ${vehicle.vin})`)}`;
  const historyUrl = `https://www.autocheck.com/vehiclehistory?vin=${vehicle.vin}`;

  const specs: Array<{ label: string; value: string }> = [
    { label: 'Transmission', value: vehicle.transmission ?? '—' },
    { label: 'Ext. Color',   value: vehicle.color        ?? '—' },
  ];

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col">

      {/* Photo — clicking the image navigates; arrows only cycle */}
      <div
        className="relative cursor-pointer"
        onClick={() => router.push(`/inventory/${vehicle.vin}`)}
      >
        <PhotoCarousel photos={photos} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
        {badge && (
          <span className={`absolute top-3 left-3 z-10 ${BADGE_COLORS[badge] ?? 'bg-secondary'} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
            {badge}
          </span>
        )}
        <button
          onClick={toggleLike}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-colors ${liked ? 'fill-primary stroke-primary' : 'fill-none stroke-gray-400 hover:stroke-gray-600'}`}
            viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Title — linked to detail page */}
      <Link href={`/inventory/${vehicle.vin}`} className="block">
        <div className="px-4 pt-3 pb-2.5 border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
          <h3 className="text-secondary font-bold text-base leading-snug uppercase tracking-wide truncate">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {(vehicle.trim || vehicle.stock_number) && (
            <p className="text-gray-400 text-[11px] uppercase tracking-widest mt-0.5">
              {vehicle.trim && <span>{vehicle.trim}</span>}
              {vehicle.trim && vehicle.stock_number && <span className="mx-1.5">·</span>}
              {vehicle.stock_number && <span>Stock# {vehicle.stock_number}</span>}
            </p>
          )}
        </div>
      </Link>

      {/* Price / Mileage bar */}
      <div className="flex border-b border-gray-100">
        <div className="flex-1 px-4 py-3 border-r border-gray-100">
          <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">Price</p>
          <p className="text-primary font-extrabold text-xl leading-none">${vehicle.price.toLocaleString()}</p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">Mileage</p>
          <p className="text-secondary font-bold text-xl leading-none">{miles > 0 ? miles.toLocaleString() : '—'}</p>
        </div>
      </div>

      {/* Two action buttons */}
      <div className="flex gap-2 px-3 py-3 border-b border-gray-100">
        <a
          href={historyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-secondary border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Vehicle History
        </a>
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-secondary rounded-lg py-2.5 hover:bg-secondary/90 transition-colors"
        >
          <svg className="w-3.5 h-3.5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Apply Now
        </a>
      </div>

      {/* Est. Payment accordion */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => setPaymentOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-secondary hover:bg-gray-50 transition-colors"
        >
          <span>Est. Payment Info</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${paymentOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {paymentOpen && (
          <div className="px-4 pb-3 pt-1 bg-gray-50">
            <div className="flex justify-between text-sm py-1.5 border-b border-gray-200">
              <span className="text-gray-500">Sale Price</span>
              <span className="text-secondary font-semibold">${vehicle.price.toLocaleString()}</span>
            </div>
            {weekly && (
              <div className="flex justify-between text-sm py-1.5 border-b border-gray-200">
                <span className="text-gray-500">Est. Weekly Payment</span>
                <span className="text-primary font-bold">${weekly}/wk</span>
              </div>
            )}
            <div className="flex justify-between text-sm py-1.5">
              <span className="text-gray-500">Down Payment</span>
              <span className="text-secondary font-semibold">Call for details</span>
            </div>
            <p className="text-gray-400 text-[10px] leading-relaxed mt-2">
              *Estimate only. Price + TTL + fees. No doc fee.
            </p>
          </div>
        )}
      </div>

      {/* Spec rows */}
      <div className="px-4 py-1 flex-1">
        {specs.map(s => <SpecRow key={s.label} label={s.label} value={s.value} />)}
      </div>

      {/* EMAIL US / CALL US */}
      <div className="flex mt-auto border-t border-gray-100">
        <a
          href={emailUrl}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-semibold text-gray-400 hover:text-secondary hover:bg-gray-50 transition-colors border-r border-gray-100 uppercase tracking-wider"
        >
          <svg className="w-3.5 h-3.5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email Us
        </a>
        <a
          href={callUrl}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-semibold text-gray-400 hover:text-secondary hover:bg-gray-50 transition-colors uppercase tracking-wider"
        >
          <svg className="w-3.5 h-3.5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Us
        </a>
      </div>

    </div>
  );
}
