// Client-safe: types and pure functions only. No Supabase client here.

export interface Vehicle {
  id: string;
  vin: string;
  year: string;
  make: string;
  model: string;
  body: string | null;
  miles: string;
  color: string | null;
  transmission: string | null;
  price: number;
  photo_urls: string[] | null;
  created_at: string;
  paid_status: string | null;
  // Enriched from vehicles (kit) table — null when no match yet
  drivetrain: string | null;
  trim: string | null;
  stock_number: string | null;
  fuel_type: string | null;
  // Detail page fields
  description?: string | null;
  interior_color?: string | null;
  exterior_color?: string | null;
  engine?: string | null;
  website_copy?: string | null;
  remarks?: string | null;
}

export function normalizeDrivetrain(raw: string | null): string | null {
  if (!raw) return null;
  const s = raw.toLowerCase();
  if (s.includes('front') || s === 'fwd') return 'FWD';
  if (s.includes('rear')  || s === 'rwd') return 'RWD';
  if (s.includes('all')   || s === 'awd') return 'AWD';
  if (s.includes('four')  || s.includes('4wd') || s.includes('4x4')) return '4WD';
  return raw;
}

export type Badge = 'Just In' | 'Low Miles' | 'Under $10k' | null;

export function getBadge(vehicle: Vehicle): Badge {
  const daysOld =
    (Date.now() - new Date(vehicle.created_at).getTime()) / 86_400_000;
  if (daysOld <= 14) return 'Just In';
  if (parseFloat(vehicle.miles) < 60_000) return 'Low Miles';
  if (vehicle.price < 10_000) return 'Under $10k';
  return null;
}
