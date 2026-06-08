'use client';

import Link from 'next/link';
import { dealer } from '@/config/dealerships/right-price';

interface FeatureRow {
  name: string;
  description: string;
  basic: boolean;
  select: boolean;
  ultimate: boolean;
}

const WARRANTY_FEATURES: FeatureRow[] = [
  {
    name: 'Engine & Transmission',
    description: 'Pistons, cylinder blocks, torque converter, transmission mounts, and all internal lubricated parts.',
    basic: true,
    select: true,
    ultimate: true,
  },
  {
    name: 'Drive Axle Assembly',
    description: 'Front/rear differential, driveshafts, universal joints, and CV joints.',
    basic: true,
    select: true,
    ultimate: true,
  },
  {
    name: 'Steering & Suspension',
    description: 'Power steering pump, steering gear, rack and pinion, control arms, and wheel bearings.',
    basic: false,
    select: true,
    ultimate: true,
  },
  {
    name: 'Brake System Components',
    description: 'Master cylinder, vacuum booster, calipers, wheel cylinders, and hydraulic lines (excludes pads/rotors).',
    basic: false,
    select: true,
    ultimate: true,
  },
  {
    name: 'Air Conditioning & Heating',
    description: 'Compressor, condenser, evaporator core, expansion valve, and blower motor.',
    basic: false,
    select: true,
    ultimate: true,
  },
  {
    name: 'Electrical Components',
    description: 'Alternator, starter motor, windshield wiper motors, and basic wiring harness systems.',
    basic: false,
    select: true,
    ultimate: true,
  },
  {
    name: 'Advanced High-Tech Electronics',
    description: 'Sensors, factory navigation screens, backup cameras, and advanced engine control units (ECU).',
    basic: false,
    select: false,
    ultimate: true,
  },
  {
    name: '24/7 Roadside Assistance & Towing',
    description: 'Emergency towing, flat tire changes, battery jump-starts, and lockout assistance.',
    basic: true,
    select: true,
    ultimate: true,
  },
];

const TIERS = [
  {
    key: 'basic'    as const,
    name: 'Basic',
    tagline: 'Powertrain',
    border: 'border-gray-200',
    header: 'bg-gray-100',
    nameClass: 'text-secondary font-bold',
  },
  {
    key: 'select'   as const,
    name: 'Select',
    tagline: 'Preferred Coverage',
    border: 'border-primary/30',
    header: 'bg-primary/10',
    nameClass: 'text-primary font-extrabold',
  },
  {
    key: 'ultimate' as const,
    name: 'Ultimate',
    tagline: 'Exclusionary',
    border: 'border-secondary/20',
    header: 'bg-secondary',
    nameClass: 'text-white font-bold',
  },
] as const;

function CheckIcon({ small }: { small?: boolean }) {
  return (
    <svg
      className={`${small ? 'w-4 h-4' : 'w-5 h-5'} text-primary flex-none mt-0.5`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4 text-gray-300 flex-none mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function DashIcon() {
  return <span className="text-gray-300 font-bold text-base">—</span>;
}

export default function WarrantyComparison() {
  return (
    <section className="bg-white py-16 md:py-24 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold tracking-[0.2em] uppercase rounded-full px-3 py-1.5 mb-4">
            Vehicle Protection
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight">
            Drive with absolute peace of mind.
          </h2>
          <p className="mt-4 text-muted text-base md:text-lg leading-relaxed">
            All of our quality pre-owned vehicles qualify for extended 3rd-party coverage. Find the tier that fits your budget and protection needs.
          </p>
        </div>

        {/* Desktop: comparison table */}
        <div className="hidden lg:block w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
          <table className="w-full min-w-[768px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-surface border-b border-gray-200">
                <th className="px-6 py-5 font-bold text-secondary text-base w-[40%]">Coverage Details</th>
                <th className="px-6 py-5 font-bold text-secondary text-center text-base w-[20%]">
                  <div className="flex flex-col items-center">
                    <span>Basic</span>
                    <span className="text-xs text-muted font-medium mt-1">Powertrain</span>
                  </div>
                </th>
                <th className="px-6 py-5 font-bold text-secondary text-center text-base w-[20%] bg-primary/[0.02] border-l border-r border-gray-200/50">
                  <div className="flex flex-col items-center">
                    <span className="text-primary font-extrabold">Select</span>
                    <span className="text-xs text-muted font-semibold mt-1">Preferred Coverage</span>
                  </div>
                </th>
                <th className="px-6 py-5 font-bold text-secondary text-center text-base w-[20%]">
                  <div className="flex flex-col items-center">
                    <span>Ultimate</span>
                    <span className="text-xs text-muted font-medium mt-1">Exclusionary</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {WARRANTY_FEATURES.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-semibold text-secondary text-sm md:text-base">{row.name}</p>
                    <p className="text-muted text-xs mt-1 max-w-lg leading-relaxed">{row.description}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {row.basic ? <CheckIcon /> : <DashIcon />}
                  </td>
                  <td className="px-6 py-5 text-center bg-primary/[0.01] border-l border-r border-gray-200/50">
                    {row.select ? <CheckIcon /> : <DashIcon />}
                  </td>
                  <td className="px-6 py-5 text-center">
                    {row.ultimate ? <CheckIcon /> : <DashIcon />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked tier cards */}
        <div className="lg:hidden flex flex-col gap-3">
          {TIERS.map(tier => (
            <div key={tier.key} className={`rounded-xl border ${tier.border} overflow-hidden`}>
              <div className={`${tier.header} px-5 py-4`}>
                <p className={`text-lg ${tier.nameClass}`}>{tier.name}</p>
                <p className={`text-xs mt-0.5 ${tier.key === 'ultimate' ? 'text-white/70' : 'text-muted'}`}>
                  {tier.tagline}
                </p>
              </div>
              <ul className="divide-y divide-gray-100 bg-white">
                {WARRANTY_FEATURES.map(row => (
                  <li key={row.name} className="flex items-start gap-3 px-5 py-3.5">
                    {row[tier.key] ? <CheckIcon small /> : <XIcon />}
                    <span className={`text-sm font-medium ${row[tier.key] ? 'text-secondary' : 'text-gray-400'}`}>
                      {row.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-surface border border-gray-200/70 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left max-w-xl">
            <h4 className="text-base md:text-lg font-bold text-secondary">
              Need custom terms or have questions?
            </h4>
            <p className="text-muted text-xs md:text-sm mt-1 leading-relaxed">
              We customize mechanical protection plans for all makes, models, and budgets. Contact Stephen and our sales team to discuss what options are available for your vehicle.
            </p>
          </div>
          <a
            href={`tel:${dealer.phone.replace(/[^0-9]/g, '')}`}
            className="flex-none bg-primary text-white font-semibold text-sm rounded-full px-6 py-3 hover:opacity-90 transition-all shadow-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Talk to Stephen
          </a>
        </div>

        {/* View Inventory */}
        <div className="mt-12 text-center">
          <Link
            href="/inventory"
            className="bg-primary text-white font-extrabold text-base rounded-full px-10 py-4 hover:opacity-95 transition-opacity shadow-lg inline-flex items-center gap-2"
          >
            View All Inventory
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
