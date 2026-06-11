import { getAvailableInventory } from '@/lib/inventory';
import InventoryPageClient from '@/components/inventory/InventoryPageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Used Car Inventory | Right Price Auto Sales — Murfreesboro TN',
  description:
    'Browse our full inventory of used cars, trucks, and SUVs in Murfreesboro, TN. In-house financing available for all credit situations.',
};

export default async function InventoryPage() {
  const vehicles = await getAvailableInventory(100);
  return <InventoryPageClient vehicles={vehicles} />;
}
