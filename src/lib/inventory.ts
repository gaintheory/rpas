// Server-only: never import this from client components.
import { createClient } from '@supabase/supabase-js';
import type { Vehicle } from './vehicle';

export type { Vehicle };

// Chars 2–17 of a VIN are stable even when the first char is corrupt in kit imports.
function vinKey(vin: string): string {
  return vin.length === 17 ? vin.slice(1) : vin;
}

export async function getAvailableInventory(limit = 100): Promise<Vehicle[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn('Supabase URL or Service Role Key is missing. Skipping inventory fetch.');
    return [];
  }

  const supabase = createClient(url, key);

  // Run both queries in parallel
  const [inspResult, kitResult] = await Promise.all([
    supabase
      .from('inspections')
      .select('id, vin, year, make, model, body, miles, color, transmission, price, photo_urls, created_at, paid_status')
      .or('paid_status.is.null,paid_status.not.in.(PURCHASED,ARCHIVED)')
      .gt('price', 0)
      .not('vin', 'is', null)
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('vehicles')
      .select('vin, drivetrain, trim, fuel_type, stock_number, body_style')
      .neq('status', 'archived'),
  ]);

  if (inspResult.error) {
    console.error('Inventory fetch error:', inspResult.error.message);
    return [];
  }

  // Build kit lookup keyed by chars 2–17 of VIN
  const kitMap = new Map<string, { drivetrain: string | null; trim: string | null; fuel_type: string | null; stock_number: string | null; body_style: string | null }>();
  for (const v of kitResult.data ?? []) {
    if (v.vin) kitMap.set(vinKey(v.vin), v);
  }

  // Merge kit enrichment into each inspection vehicle (skip those with no photos)
  return (inspResult.data ?? [])
    .filter(insp => Array.isArray(insp.photo_urls) && insp.photo_urls.length > 0)
    .map(insp => {
      const kit = kitMap.get(vinKey(insp.vin)) ?? null;
      return {
        ...insp,
        body:         kit?.body_style   ?? insp.body,
        drivetrain:   kit?.drivetrain   ?? null,
        trim:         kit?.trim         ?? null,
        stock_number: kit?.stock_number ?? null,
        fuel_type:    kit?.fuel_type    ?? null,
      } as Vehicle;
    });
}
