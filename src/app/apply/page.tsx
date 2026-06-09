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
    <div className="pt-24 pb-16 px-4 min-h-screen relative overflow-hidden">
      {/* Base Background Color */}
      <div className="absolute inset-0 bg-[#f8fafc] -z-30 pointer-events-none" aria-hidden="true" />

      {/* Background Dealer Lot Image with desaturated overlay */}
      <div 
        className="absolute inset-0 -z-20 pointer-events-none bg-no-repeat bg-cover bg-center" 
        style={{
          backgroundImage: 'url("/dealer-lot.jpg")',
          opacity: 0.24,
          filter: 'grayscale(35%) contrast(1.05)',
        }}
        aria-hidden="true" 
      />
      {/* Ambient Radial Glow Background */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(192, 57, 43, 0.08) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(26, 26, 46, 0.05) 0%, transparent 60%)'
        }}
        aria-hidden="true" 
      />
      <div className="relative z-10">
        <CreditFormWizard vin={vin} />
      </div>
    </div>
  );
}
