'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Vehicle } from '@/lib/vehicle';
import InventoryGridCard from './InventoryGridCard';

const BODY_FILTERS = ['All', 'SUV', 'Truck', 'Sedan', 'Van'] as const;
type BodyFilter = (typeof BODY_FILTERS)[number];
type PriceFilter = 'any' | 'under8' | '8to12' | '12to16' | '16plus';
type YearFilter  = 'any' | '2020plus' | '2016to2019' | '2015minus';
type MilesFilter = 'any' | 'under50' | '50to100' | '100to150' | '150plus';
type Sort        = 'newest' | 'price_asc' | 'price_desc' | 'miles_asc';

const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: 'any',    label: 'Any price' },
  { value: 'under8', label: 'Under $8,000' },
  { value: '8to12',  label: '$8,000 – $12,000' },
  { value: '12to16', label: '$12,000 – $16,000' },
  { value: '16plus', label: '$16,000+' },
];

const YEAR_OPTIONS: { value: YearFilter; label: string }[] = [
  { value: 'any',        label: 'Any year' },
  { value: '2020plus',   label: '2020 & Newer' },
  { value: '2016to2019', label: '2016 – 2019' },
  { value: '2015minus',  label: '2015 & Older' },
];

const MILES_OPTIONS: { value: MilesFilter; label: string }[] = [
  { value: 'any',      label: 'Any mileage' },
  { value: 'under50',  label: 'Under 50,000' },
  { value: '50to100',  label: '50,000 – 100,000' },
  { value: '100to150', label: '100,000 – 150,000' },
  { value: '150plus',  label: '150,000+' },
];

// ── Silhouette icons ──────────────────────────────────────────────────────────
function BodyIcon({ type }: { type: string }) {
  const cls = 'w-9 h-5 shrink-0 text-gray-300';
  switch (type) {
    case 'SUV': return (
      <svg viewBox="0 0 42 22" fill="currentColor" className={cls}>
        <path d="M3 15h36v3H3zM3 15V10l5-7h21l5 7h2v5H3z"/>
        <circle cx="10" cy="19" r="2.5"/><circle cx="32" cy="19" r="2.5"/>
      </svg>
    );
    case 'Truck': return (
      <svg viewBox="0 0 42 22" fill="currentColor" className={cls}>
        <path d="M3 15h36v3H3zM3 15V10l5-7h14v7h17v5H3z"/>
        <circle cx="10" cy="19" r="2.5"/><circle cx="32" cy="19" r="2.5"/>
      </svg>
    );
    case 'Sedan': return (
      <svg viewBox="0 0 42 22" fill="currentColor" className={cls}>
        <path d="M3 15h36v3H3zM3 15v-3q0-3 3-4l7-4h16l7 4q3 1 3 4v3H3z"/>
        <circle cx="10" cy="19" r="2.5"/><circle cx="32" cy="19" r="2.5"/>
      </svg>
    );
    case 'Van': return (
      <svg viewBox="0 0 42 22" fill="currentColor" className={cls}>
        <path d="M3 15h36v3H3zM3 15V6q0-2 2-2h30q2 0 2 2v9H3z"/>
        <circle cx="10" cy="19" r="2.5"/><circle cx="32" cy="19" r="2.5"/>
      </svg>
    );
    default: return null;
  }
}

// ── Filter functions ──────────────────────────────────────────────────────────

function inferBody(v: Vehicle): string {
  // Use kit body_style when it's available and meaningful
  const kitBody = (v.body ?? '').toLowerCase();
  if (kitBody) {
    if (kitBody.includes('suv') || kitBody.includes('sport utility') || kitBody.includes('crossover') || kitBody.includes('4x4')) return 'suv';
    if (kitBody.includes('truck') || kitBody.includes('pickup') || kitBody.includes('cab')) return 'truck';
    if (kitBody.includes('van') || kitBody.includes('minivan')) return 'van';
    if (kitBody.includes('sedan') || kitBody.includes('coupe') || kitBody.includes('hatchback')) return 'sedan';
  }
  // Fall back to model-name inference for vehicles without kit data
  const model = (v.model ?? '').toLowerCase();
  if (/f-?150|f-?250|f-?350|silverado|sierra|ram\s?1500|tundra|tacoma|ranger|colorado|frontier|titan|ridgeline/.test(model)) return 'truck';
  if (/express|nv\s?200|transit connect|pacifica|sienna|odyssey|caravan|savana|promaster|sprinter/.test(model)) return 'van';
  if (/hr-v|cr-v|rogue|escape|edge|compass|outback|encore|rav4|terrain|equinox|explorer|cherokee|highlander|pilot|4runner|cx-|santa fe|tucson|sorento|sportage|forester|traverse|acadia|armada|pathfinder|murano|wrangler|bronco|blazer|trax|trailblazer|tahoe|suburban|expedition|navigator|sequoia/.test(model)) return 'suv';
  if (/accord|camry|corolla|civic|altima|sentra|fusion|malibu|impala|sonic|elantra|sonata|optima|focus|jetta|passat|golf|beetle|legacy|impreza|charger|challenger|mustang|camaro|spark|versa|yaris|fit|avalon|prius|insight|maxima/.test(model)) return 'sedan';
  return '';
}

function matchesSearch(v: Vehicle, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.toLowerCase();
  return (
    v.year?.toLowerCase().includes(s) ||
    v.make?.toLowerCase().includes(s) ||
    v.model?.toLowerCase().includes(s) ||
    (v.trim ?? '').toLowerCase().includes(s)
  );
}

function matchesBody(v: Vehicle, f: BodyFilter): boolean {
  if (f === 'All') return true;
  const body = inferBody(v);
  switch (f) {
    case 'SUV':   return body === 'suv';
    case 'Truck': return body === 'truck';
    case 'Sedan': return body === 'sedan';
    case 'Van':   return body === 'van';
    default:      return true;
  }
}

function matchesPrice(v: Vehicle, f: PriceFilter): boolean {
  switch (f) {
    case 'under8':  return v.price < 8_000;
    case '8to12':   return v.price >= 8_000  && v.price < 12_000;
    case '12to16':  return v.price >= 12_000 && v.price < 16_000;
    case '16plus':  return v.price >= 16_000;
    default:        return true;
  }
}

function matchesYear(v: Vehicle, f: YearFilter): boolean {
  const y = parseInt(v.year ?? '0');
  switch (f) {
    case '2020plus':   return y >= 2020;
    case '2016to2019': return y >= 2016 && y <= 2019;
    case '2015minus':  return y <= 2015;
    default:           return true;
  }
}

function matchesMiles(v: Vehicle, f: MilesFilter): boolean {
  const m = parseFloat(v.miles ?? '0');
  switch (f) {
    case 'under50':  return m < 50_000;
    case '50to100':  return m >= 50_000  && m < 100_000;
    case '100to150': return m >= 100_000 && m < 150_000;
    case '150plus':  return m >= 150_000;
    default:         return true;
  }
}

function matchesMake(v: Vehicle, f: string): boolean {
  return !f || v.make?.toLowerCase() === f.toLowerCase();
}

function sortVehicles(vehicles: Vehicle[], sort: Sort): Vehicle[] {
  return [...vehicles].sort((a, b) => {
    switch (sort) {
      case 'price_asc':  return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'miles_asc':  return parseFloat(a.miles ?? '0') - parseFloat(b.miles ?? '0');
      default:           return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
}

function pushParams(updates: Record<string, string>) {
  const params = new URLSearchParams(window.location.search);
  const defaults: Record<string, string> = {
    body: 'All', price: 'any', sort: 'newest', make: '', year: 'any', miles: 'any', q: '', saved: '',
  };
  Object.entries(updates).forEach(([k, v]) => {
    if (v === defaults[k]) params.delete(k); else params.set(k, v);
  });
  const qs = params.toString();
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
}

// ── Sidebar section wrapper ───────────────────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50/80 transition-colors"
      >
        <span className="text-[13px] font-semibold text-gray-700 tracking-wide">{title}</span>
        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 flex-none ${open ? '' : '-rotate-90'}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

function RadioItem({ name, value, checked, label, count, onChange }: {
  name: string; value: string; checked: boolean; label: string; count?: number; onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group py-[5px]">
      <div className="flex items-center gap-2.5">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-none transition-colors
          ${checked ? 'border-primary bg-primary' : 'border-gray-300 group-hover:border-gray-400'}`}>
          {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
        <span className={`text-[13px] leading-none transition-colors
          ${checked ? 'text-gray-900 font-semibold' : 'text-gray-500 group-hover:text-gray-700'}`}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-[11px] text-gray-400 font-medium tabular-nums">{count}</span>
      )}
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function InventoryPageClient({ vehicles }: { vehicles: Vehicle[] }) {
  const [searchQuery,  setSearchQuery]  = useState('');
  const [bodyFilter,   setBodyFilter]   = useState<BodyFilter>('All');
  const [makeFilter,   setMakeFilter]   = useState('');
  const [priceFilter,  setPriceFilter]  = useState<PriceFilter>('any');
  const [yearFilter,   setYearFilter]   = useState<YearFilter>('any');
  const [milesFilter,  setMilesFilter]  = useState<MilesFilter>('any');
  const [sort,         setSort]         = useState<Sort>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [savedVins,         setSavedVins]         = useState<string[]>([]);
  const [showSaved,         setShowSaved]         = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const b = p.get('body'); const pr = p.get('price'); const s = p.get('sort');
    const mk = p.get('make'); const yr = p.get('year'); const mi = p.get('miles');
    const q = p.get('q');
    if (b  && (BODY_FILTERS as readonly string[]).includes(b)) setBodyFilter(b as BodyFilter);
    if (pr && PRICE_OPTIONS.some(o => o.value === pr)) setPriceFilter(pr as PriceFilter);
    if (s  && ['newest','price_asc','price_desc','miles_asc'].includes(s)) setSort(s as Sort);
    if (mk) setMakeFilter(mk);
    if (yr && YEAR_OPTIONS.some(o => o.value === yr)) setYearFilter(yr as YearFilter);
    if (mi && MILES_OPTIONS.some(o => o.value === mi)) setMilesFilter(mi as MilesFilter);
    if (q)  setSearchQuery(q);
    if (p.get('saved') === '1') setShowSaved(true);
  }, []);

  useEffect(() => {
    const read = () => {
      try {
        const saved: string[] = JSON.parse(localStorage.getItem('rpas_favorites') ?? '[]');
        setSavedVins(saved);
      } catch {}
    };
    read();
    window.addEventListener('rpas_favorites_changed', read);
    return () => window.removeEventListener('rpas_favorites_changed', read);
  }, []);

  // Compute make options + body counts from full unfiltered inventory
  const makeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    vehicles.forEach(v => {
      const make = v.make?.trim();
      if (make) counts.set(make, (counts.get(make) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [vehicles]);

  const bodyCounts = useMemo(() => {
    const map: Record<string, number> = { SUV: 0, Truck: 0, Sedan: 0, Van: 0 };
    vehicles.forEach(v => {
      const body = inferBody(v);
      if (body === 'suv') map.SUV++;
      else if (body === 'truck') map.Truck++;
      else if (body === 'sedan') map.Sedan++;
      else if (body === 'van') map.Van++;
    });
    return map;
  }, [vehicles]);

  const filtered = showSaved
    ? sortVehicles(vehicles.filter(v => savedVins.includes(v.vin)), sort)
    : sortVehicles(
        vehicles.filter(v =>
          matchesSearch(v, searchQuery) &&
          matchesBody(v, bodyFilter) &&
          matchesPrice(v, priceFilter) &&
          matchesYear(v, yearFilter) &&
          matchesMiles(v, milesFilter) &&
          matchesMake(v, makeFilter)
        ),
        sort,
      );

  const activeFilterCount = [
    bodyFilter !== 'All',
    priceFilter !== 'any',
    makeFilter !== '',
    yearFilter !== 'any',
    milesFilter !== 'any',
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setBodyFilter('All'); setPriceFilter('any'); setMakeFilter('');
    setYearFilter('any'); setMilesFilter('any'); setSearchQuery('');
    pushParams({ body: 'All', price: 'any', make: '', year: 'any', miles: 'any', q: '' });
  };

  const closeDrawer = () => setMobileFiltersOpen(false);

  // ── Sidebar content (shared between desktop + mobile drawer) ──
  const sidebarContent = (
    <>
      {/* Body Style */}
      <FilterSection title="Body Style">
        <div className="space-y-0.5">
          <RadioItem name="body" value="All" checked={bodyFilter === 'All'}
            label="All types" count={vehicles.length}
            onChange={() => { setBodyFilter('All'); pushParams({ body: 'All' }); closeDrawer(); }} />
          {(['SUV','Truck','Sedan','Van'] as BodyFilter[]).map(f => (
            <label key={f} className="flex items-center justify-between cursor-pointer group py-[5px]">
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-none transition-colors
                  ${bodyFilter === f ? 'border-primary bg-primary' : 'border-gray-300 group-hover:border-gray-400'}`}>
                  {bodyFilter === f && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className={`text-[13px] leading-none transition-colors
                  ${bodyFilter === f ? 'text-gray-900 font-semibold' : 'text-gray-500 group-hover:text-gray-700'}`}>
                  {f}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-400 font-medium tabular-nums">{bodyCounts[f] ?? 0}</span>
                <BodyIcon type={f} />
              </div>
              <input type="radio" name="body" checked={bodyFilter === f} className="sr-only"
                onChange={() => { setBodyFilter(f); pushParams({ body: f }); closeDrawer(); }} />
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Make */}
      {makeOptions.length > 0 && (
        <FilterSection title="Make">
          <div className="space-y-0.5">
            <RadioItem name="make" value="" checked={makeFilter === ''}
              label="All makes" onChange={() => { setMakeFilter(''); pushParams({ make: '' }); closeDrawer(); }} />
            {makeOptions.map(([make, count]) => (
              <RadioItem key={make} name="make" value={make} checked={makeFilter === make}
                label={make} count={count}
                onChange={() => { setMakeFilter(make); pushParams({ make }); closeDrawer(); }} />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price */}
      <FilterSection title="Price">
        <div className="space-y-0.5">
          {PRICE_OPTIONS.map(({ value, label }) => (
            <RadioItem key={value} name="price" value={value} checked={priceFilter === value}
              label={label}
              onChange={() => { setPriceFilter(value); pushParams({ price: value }); closeDrawer(); }} />
          ))}
        </div>
      </FilterSection>

      {/* Year */}
      <FilterSection title="Year">
        <div className="space-y-0.5">
          {YEAR_OPTIONS.map(({ value, label }) => (
            <RadioItem key={value} name="year" value={value} checked={yearFilter === value}
              label={label}
              onChange={() => { setYearFilter(value); pushParams({ year: value }); closeDrawer(); }} />
          ))}
        </div>
      </FilterSection>

      {/* Mileage */}
      <FilterSection title="Mileage">
        <div className="space-y-0.5">
          {MILES_OPTIONS.map(({ value, label }) => (
            <RadioItem key={value} name="miles" value={value} checked={milesFilter === value}
              label={label}
              onChange={() => { setMilesFilter(value); pushParams({ miles: value }); closeDrawer(); }} />
          ))}
        </div>
      </FilterSection>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100/75 pt-16">

      {/* ── Search header ──────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
        {/* Full-width search bar */}
        <div className="px-4 py-4">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search year, make, or model…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); pushParams({ q: e.target.value }); }}
              className="w-full pl-11 pr-10 py-3.5 rounded-full border border-primary bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); pushParams({ q: '' }); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Sidebar + Grid ─────────────────────────────────────────── */}
      <div className="flex">

        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 flex-none bg-white border-r border-gray-200 sticky top-36 h-[calc(100vh-144px)] overflow-y-auto shrink-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">Filters</span>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-[12px] text-primary font-semibold hover:underline">
                Reset all
              </button>
            )}
          </div>
          {sidebarContent}
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Count / sort bar */}
          <div className="sticky top-36 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors shrink-0"
              >
                <svg className="w-4 h-4 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-white rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center leading-none">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <span className="text-sm text-gray-500 truncate">
                <span className="font-semibold text-gray-800">{filtered.length}</span>
                {showSaved ? ' saved' : ` vehicle${filtered.length !== 1 ? 's' : ''}`}
              </span>
              {/* Active filter chips */}
              <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                {bodyFilter !== 'All' && (
                  <button
                    onClick={() => { setBodyFilter('All'); pushParams({ body: 'All' }); }}
                    className="inline-flex items-center gap-1 text-[11px] bg-secondary/8 text-secondary font-medium rounded-full px-2.5 py-0.5 hover:bg-secondary/15 transition-colors"
                  >
                    {bodyFilter}
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {makeFilter && (
                  <button
                    onClick={() => { setMakeFilter(''); pushParams({ make: '' }); }}
                    className="inline-flex items-center gap-1 text-[11px] bg-secondary/8 text-secondary font-medium rounded-full px-2.5 py-0.5 hover:bg-secondary/15 transition-colors"
                  >
                    {makeFilter}
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); pushParams({ q: '' }); }}
                    className="inline-flex items-center gap-1 text-[11px] bg-secondary/8 text-secondary font-medium rounded-full px-2.5 py-0.5 hover:bg-secondary/15 transition-colors"
                  >
                    {'"'}{searchQuery}{'"'}
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Saved toggle */}
              <button
                onClick={() => { const next = !showSaved; setShowSaved(next); pushParams({ saved: next ? '1' : '' }); }}
                className={showSaved
                  ? 'inline-flex items-center gap-1.5 text-sm font-medium border rounded-lg px-3 py-1.5 transition-colors bg-primary/10 border-primary/30 text-primary'
                  : 'inline-flex items-center gap-1.5 text-sm font-medium border rounded-lg px-3 py-1.5 transition-colors border-gray-200 text-gray-600 hover:bg-gray-50'}
              >
                <svg
                  className={showSaved ? 'w-4 h-4 flex-none transition-colors fill-primary stroke-primary' : 'w-4 h-4 flex-none transition-colors fill-none stroke-gray-400'}
                  viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden sm:inline">Saved</span>
                {savedVins.length > 0 && (
                  <span className={showSaved
                    ? 'rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center leading-none bg-primary text-white'
                    : 'rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center leading-none bg-gray-200 text-gray-600'}
                  >
                    {savedVins.length}
                  </span>
                )}
              </button>
              <select
                value={sort}
                onChange={e => { setSort(e.target.value as Sort); pushParams({ sort: e.target.value }); }}
                className="shrink-0 text-sm font-medium border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="miles_asc">Miles: Low to High</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="p-4 sm:p-6">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(v => <InventoryGridCard key={v.id} vehicle={v} />)}
              </div>
            ) : showSaved ? (
              <div className="text-center py-24">
                <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-gray-700 font-semibold text-lg mb-2">No saved vehicles yet</p>
                <p className="text-gray-400 text-sm">Tap the ♥ on any vehicle card to save it here.</p>
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="text-gray-700 font-semibold text-lg mb-2">No vehicles match your search</p>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or clearing the search.</p>
                <button onClick={clearFilters}
                  className="bg-primary text-white text-sm font-semibold rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Mobile filter drawer ────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={closeDrawer} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Filters</span>
              <button onClick={closeDrawer} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1">{sidebarContent}</div>
            {activeFilterCount > 0 && (
              <div className="p-5 border-t border-gray-100">
                <button onClick={() => { clearFilters(); closeDrawer(); }}
                  className="w-full text-sm text-primary font-semibold py-2 hover:underline">
                  Reset all filters
                </button>
              </div>
            )}
          </aside>
        </>
      )}

    </div>
  );
}
