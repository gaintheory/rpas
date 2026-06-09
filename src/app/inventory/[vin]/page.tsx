import { getVehicleByVin } from '@/lib/inventory';
import VehicleDetailPageClient from '@/components/inventory/VehicleDetailPageClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface RouteProps {
  params: Promise<{ vin: string }>;
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { vin } = await params;
  const vehicle = await getVehicleByVin(vin);

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found | Right Price Auto Sales',
    };
  }

  const miles = parseFloat(vehicle.miles ?? '0');
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} | Right Price Auto Sales`;
  const description = `Buy this ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''} in Murfreesboro, TN. Price: $${vehicle.price.toLocaleString()}.${miles > 0 ? ` Mileage: ${miles.toLocaleString()} miles.` : ''} No dealer doc fees.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: vehicle.photo_urls && vehicle.photo_urls.length > 0 ? [{ url: vehicle.photo_urls[0] }] : [],
    },
  };
}

export default async function VehicleDetailPage({ params }: RouteProps) {
  const { vin } = await params;
  const vehicle = await getVehicleByVin(vin);

  if (!vehicle) {
    notFound();
  }

  return <VehicleDetailPageClient vehicle={vehicle} />;
}
