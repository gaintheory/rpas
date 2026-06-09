import CreditFormWizard from '@/components/credit/CreditFormWizard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply for Financing | Right Price Auto Sales',
  description: 'Apply for credit online. Buy Here Pay Here in-house financing programs available at Right Price Auto Sales in Murfreesboro, TN.',
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ vin?: string }>;
}) {
  const { vin } = await searchParams;

  return (
    <div className="pt-24 pb-16 px-4 bg-gray-50/50 min-h-screen">
      <CreditFormWizard vin={vin} />
    </div>
  );
}
