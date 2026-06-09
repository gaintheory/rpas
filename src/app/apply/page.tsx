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
    <div className="pt-24 pb-16 px-4 min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Ambient Radial Glow Background */}
      <div 
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(192,57,43,0.06)_0%,transparent_55%),radial-gradient(circle_at_20%_80%,rgba(26,26,46,0.04)_0%,transparent_55%)] pointer-events-none" 
        aria-hidden="true" 
      />
      <div className="relative z-10">
        <CreditFormWizard vin={vin} />
      </div>
    </div>
  );
}
