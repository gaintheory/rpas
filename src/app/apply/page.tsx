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
        className="absolute inset-0 -z-10 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(192, 57, 43, 0.06) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(26, 26, 46, 0.04) 0%, transparent 55%)'
        }}
        aria-hidden="true" 
      />
      <div className="relative z-10">
        <CreditFormWizard vin={vin} />
      </div>
    </div>
  );
}
