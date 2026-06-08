import { getAvailableInventory } from '@/lib/inventory';
export const dynamic = 'force-dynamic';
import InventoryStripClient from './InventoryStripClient';

export default async function InventoryStrip() {
  const vehicles = (await getAvailableInventory(12))
    .sort((a, b) => b.price - a.price)
    .slice(0, 6);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary">Featured Inventory</h2>
          <p className="text-muted text-sm mt-1">Fresh inventory added weekly</p>
        </div>
        <InventoryStripClient vehicles={vehicles} />
      </div>
    </section>
  );
}
