'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type Vehicle } from '@/lib/vehicle';
import InventoryGridCard from './InventoryGridCard';

const VISIBLE = 4;

export default function InventoryStripClient({ vehicles }: { vehicles: Vehicle[] }) {
  const [offset, setOffset] = useState(0);
  const max = Math.max(0, vehicles.length - VISIBLE);
  const canPrev = offset > 0;
  const canNext = offset < max;
  const shown = vehicles.slice(offset, offset + VISIBLE);

  return (
    <div>
      {/* Desktop: 4-column carousel */}
      <div className="hidden lg:block relative">
        <div className="grid grid-cols-4 gap-5">
          {shown.map(v => (
            <InventoryGridCard key={v.vin} vehicle={v} />
          ))}
        </div>

        {canPrev && (
          <button
            onClick={() => setOffset(o => Math.max(0, o - 1))}
            aria-label="Previous vehicles"
            className="absolute -left-6 top-1/3 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-2xl leading-none text-secondary hover:bg-gray-50 transition-colors"
          >
            ‹
          </button>
        )}
        {canNext && (
          <button
            onClick={() => setOffset(o => Math.min(max, o + 1))}
            aria-label="Next vehicles"
            className="absolute -right-6 top-1/3 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-2xl leading-none text-secondary hover:bg-gray-50 transition-colors"
          >
            ›
          </button>
        )}

        {max > 0 && (
          <div className="flex justify-center gap-1.5 mt-5">
            {Array.from({ length: max + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setOffset(i)}
                aria-label={`Go to position ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${i === offset ? 'bg-secondary w-4' : 'bg-gray-300 w-1.5'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile / tablet: horizontal snap scroll */}
      <div className="lg:hidden flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
        {vehicles.map(v => (
          <div key={v.vin} className="flex-none w-[85vw] snap-start">
            <InventoryGridCard vehicle={v} />
          </div>
        ))}
      </div>

      {/* View all */}
      <div className="mt-8 text-center">
        <Link
          href="/inventory"
          className="inline-block border border-secondary text-secondary text-sm font-semibold rounded-full px-6 py-2.5 hover:bg-secondary hover:text-white transition-colors"
        >
          View All Inventory →
        </Link>
      </div>
    </div>
  );
}
