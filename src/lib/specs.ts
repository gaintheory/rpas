// Normalizes the auto.dev v1 VIN-decode payload into render-ready sections.
// Every accessor is defensive: fields vary by make/year/trim, so anything
// absent is simply omitted rather than rendered as an empty row.

export interface SpecRow {
  label: string;
  value: string;
}

export interface SpecGroup {
  category: string;
  items: string[];
}

export interface VehiclePricing {
  msrp: number | null;
  tmvRetail: number | null;
}

export interface VehicleSpecs {
  hasData: boolean;
  trim: string | null;
  keyDetails: SpecRow[];
  engine: SpecRow[];
  transmission: SpecRow[];
  equipment: SpecGroup[];
  colors: SpecGroup[];
  pricing: VehiclePricing;
}

type Raw = Record<string, unknown>;

function asRecord(v: unknown): Raw | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Raw) : null;
}
function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}
function str(v: unknown): string | null {
  if (typeof v === 'string') return v.trim() || null;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return null;
}
function num(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
function titleCase(v: string): string {
  return v.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
function titleish(v: string | null): string | null {
  if (!v) return null;
  return v === v.toLowerCase() ? titleCase(v) : v;
}
function row(label: string, value: string | null): SpecRow | null {
  return value ? { label, value } : null;
}
function compact(rows: (SpecRow | null)[]): SpecRow[] {
  return rows.filter((r): r is SpecRow => r !== null);
}
function transmissionSummary(trans: Raw): string | null {
  const speeds = str(trans.numberOfSpeeds);
  const type = titleish(str(trans.transmissionType));
  if (speeds && type) return `${speeds}-Speed ${type}`;
  return type || speeds;
}
function moneyFmt(n: number | null | undefined): string | null {
  if (n == null || !Number.isFinite(n)) return null;
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

const EMPTY: VehicleSpecs = {
  hasData: false, trim: null,
  keyDetails: [], engine: [], transmission: [], equipment: [], colors: [],
  pricing: { msrp: null, tmvRetail: null },
};

export function normalizeSpecs(raw: unknown): VehicleSpecs {
  try {
    const d = asRecord(raw);
    if (!d) return EMPTY;

    const engine     = asRecord(d.engine)       ?? {};
    const trans      = asRecord(d.transmission) ?? {};
    const categories = asRecord(d.categories)   ?? {};
    const price      = asRecord(d.price)        ?? {};
    const mpg        = asRecord(d.mpg)          ?? {};
    const valve      = asRecord(engine.valve)   ?? {};

    const yearObj  = asRecord(asArray(d.years)[0]);
    const styleObj = asRecord(asArray(yearObj?.styles)[0]);
    const trim     = str(styleObj?.trim);

    const mpgCity  = str(mpg.city);
    const mpgHwy   = str(mpg.highway);
    const mpgValue = mpgCity && mpgHwy ? `${mpgCity} city / ${mpgHwy} hwy` : mpgCity || mpgHwy;

    const engineSummary = [
      num(engine.size)        ? `${num(engine.size)}L`          : null,
      str(engine.cylinder)    ? `${str(engine.cylinder)}-cyl`   : null,
      str(engine.compressorType) === 'turbocharger' ? 'Turbo'   : null,
    ].filter(Boolean).join(' ') || str(engine.name);

    const keyDetails = compact([
      row('Body type',     str(categories.primaryBodyType) ?? str(categories.vehicleType)),
      row('Style',         str(categories.vehicleStyle)),
      row('Size class',    str(categories.vehicleSize)),
      row('EPA class',     str(categories.epaClass)),
      row('Doors',         str(d.numOfDoors)),
      row('Drivetrain',    titleish(str(d.drivenWheels))),
      row('Transmission',  transmissionSummary(trans)),
      row('Engine',        engineSummary),
      row('Fuel type',     titleish(str(engine.fuelType))),
      row('Fuel economy',  mpgValue ? `${mpgValue} mpg` : null),
      row('Trim',          trim),
      row('Base MSRP',     moneyFmt(num(price.baseMsrp))),
    ]);

    const engineSpecs = compact([
      row('Displacement',      num(engine.displacement) ? `${num(engine.displacement)} cc` : (num(engine.size) ? `${num(engine.size)}L` : null)),
      row('Cylinders',         str(engine.cylinder)),
      row('Configuration',     titleish(str(engine.configuration))),
      row('Horsepower',        num(engine.horsepower) ? `${num(engine.horsepower)} hp` : null),
      row('Torque',            num(engine.torque) ? `${num(engine.torque)} lb-ft` : null),
      row('Compression ratio', num(engine.compressionRatio) ? `${num(engine.compressionRatio)}:1` : null),
      row('Valves',            str(engine.totalValves)),
      row('Valve gear',        titleish(str(valve.gear))),
      row('Valve timing',      titleish(str(valve.timing))),
      row('Aspiration',        titleish(str(engine.compressorType)) ?? 'Naturally aspirated'),
      row('Fuel type',         titleish(str(engine.fuelType))),
    ]);

    const transmissionSpecs = compact([
      row('Type',         titleish(str(trans.transmissionType))),
      row('Speeds',       str(trans.numberOfSpeeds)),
      row('Drive wheels', titleish(str(d.drivenWheels))),
    ]);

    const equipment: SpecGroup[] = asArray(d.options)
      .map(group => {
        const g        = asRecord(group);
        const category = str(g?.category) ?? 'Equipment';
        const items    = asArray(g?.options)
          .map(o => str(asRecord(o)?.name))
          .filter((n): n is string => Boolean(n));
        return { category, items: Array.from(new Set(items)) };
      })
      .filter(g => g.items.length > 0);

    const colors: SpecGroup[] = asArray(d.colors)
      .map(group => {
        const g        = asRecord(group);
        const category = str(g?.category) ?? 'Colors';
        const items    = asArray(g?.options)
          .map(o => str(asRecord(o)?.name))
          .filter((n): n is string => Boolean(n));
        return { category, items: Array.from(new Set(items)) };
      })
      .filter(g => g.items.length > 0);

    const pricing: VehiclePricing = {
      msrp:      num(price.baseMsrp),
      tmvRetail: num(price.usedTmvRetail),
    };

    const hasData = keyDetails.length > 0 || engineSpecs.length > 0 || equipment.length > 0;

    return { hasData, trim, keyDetails, engine: engineSpecs, transmission: transmissionSpecs, equipment, colors, pricing };
  } catch {
    return EMPTY;
  }
}
