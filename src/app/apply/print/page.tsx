import { decryptData } from '@/app/actions/credit';
import { Metadata } from 'next';
import Link from 'next/link';
import PrintButton from './PrintButton';

export const metadata: Metadata = {
  title: 'Credit Application Print Record',
  robots: { index: false, follow: false }, // Prevent search engines from indexing PII links
};

export default async function PrintPage({
  searchParams,
}: {
  searchParams: Promise<{ app?: string }>;
}) {
  const { app } = await searchParams;

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md w-full text-center shadow-sm">
          <h2 className="text-xl font-bold text-red-600">No Data Provided</h2>
          <p className="mt-2 text-gray-600 text-sm">
            This URL requires an encrypted application token to view. If you are a customer, please fill out the form at /apply.
          </p>
          <div className="mt-6">
            <Link href="/apply" className="inline-block bg-primary text-white font-bold text-xs uppercase tracking-wider px-6 py-2 rounded">
              Fill Credit Application
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let data: Record<string, string> = {};
  try {
    const decryptedJson = await decryptData(app);
    data = JSON.parse(decryptedJson);
  } catch (err) {
    console.error('Decryption error:', err);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md w-full text-center shadow-sm">
          <h2 className="text-xl font-bold text-red-600">Decryption Failed</h2>
          <p className="mt-2 text-gray-600 text-sm">
            The encrypted application token is invalid, expired, or was corrupted in transport.
          </p>
          <div className="mt-6">
            <Link href="/" className="inline-block bg-secondary text-white font-bold text-xs uppercase tracking-wider px-6 py-2 rounded">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Formatting helpers
  const formatMoney = (val?: string) => {
    if (!val) return '';
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return val;
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const isChecked = (val?: string) => val === 'true';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 p-2 sm:p-6 flex flex-col items-center justify-start print:bg-white print:p-0 print:block no-print-bg">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide Navbar, Footer, and mobile bottom tab bar */
          nav, footer, .print-hidden, [class*="Navbar"], [class*="Footer"] {
            display: none !important;
          }
          
          /* Reset root layout print boundaries */
          html, body {
            height: 100% !important;
            overflow: hidden !important;
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          main {
            padding: 0 !important;
            padding-bottom: 0 !important;
            margin: 0 !important;
          }

          /* Force the application card to fill exactly the printable height */
          .credit-app-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 0 !important;
            height: 98vh !important;
          }

          /* Tighten spacing to make everything fit on a single page */
          .space-y-4 {
            margin-top: 0.25rem !important;
          }
          .space-y-4 > * + * {
            margin-top: 0.25rem !important;
          }
          .space-y-2 > * + * {
            margin-top: 0.12rem !important;
          }
          .gap-y-2.5 {
            row-gap: 0.16rem !important;
          }
          .py-2.5 {
            padding-top: 0.11rem !important;
            padding-bottom: 0.11rem !important;
          }
          .py-1.5 {
            padding-top: 0.07rem !important;
            padding-bottom: 0.07rem !important;
          }
          .py-1 {
            padding-top: 0.05rem !important;
            padding-bottom: 0.05rem !important;
          }
          .mt-4 {
            margin-top: 0.25rem !important;
          }
          .pt-2 {
            padding-top: 0.15rem !important;
          }
          
          /* Scale texts slightly so signature lines and tables stay on page */
          h1 {
            font-size: 20px !important;
            line-height: 1.1 !important;
          }
          h2 {
            font-size: 8.5px !important;
          }
          .text-xs {
            font-size: 10px !important;
          }
          .text-\\[8\\.5px\\] {
            font-size: 7.6px !important;
          }
          .text-\\[7px\\] {
            font-size: 5.8px !important;
          }
          .text-\\[7\\.5px\\] {
            font-size: 6.5px !important;
          }
          .text-\\[10px\\] {
            font-size: 8.5px !important;
          }
          
          /* Shrink input lines and table row heights */
          .min-h-\\[20px\\] {
            min-height: 15px !important;
          }
          .min-h-\\[22px\\] {
            min-height: 17px !important;
          }
          .h-6 {
            height: 17px !important;
          }

          @page {
            size: letter;
            margin: 0.25in 0.35in 0.2in 0.35in !important;
          }
        }
      `}} />
      
      {/* Floating control bar (hidden when printing) */}
      <div className="w-full max-w-4xl bg-slate-800 text-white p-3 rounded-lg flex items-center justify-between mb-4 shadow-lg border border-slate-700 print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider">PII Secure: In-Memory Decoded</span>
        </div>
        <div className="flex gap-2">
          <Link href="/apply" className="px-4 py-1.5 border border-slate-600 hover:border-white rounded text-xs font-semibold transition-all">
            New App
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* Main Print Container (Replicates the Paper Form 1:1) */}
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-sm p-8 border border-slate-200 min-h-[11in] flex flex-col justify-between print:border-0 print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full overflow-hidden credit-app-card">
        
        <div className="space-y-4">
          
          {/* Header */}
          <div className="text-center pb-2">
            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-slate-900">
              Credit Application
            </h1>
            <div className="w-full h-1 bg-slate-900 mt-1"></div>
            <div className="w-full h-[1px] bg-slate-900 mt-[2px]"></div>
          </div>

          {/* Section 1: Personal Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-3.5 bg-primary"></div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-12 gap-x-4 gap-y-2.5">
              <div className="col-span-6 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Name</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.name}</span>
              </div>
              <div className="col-span-3 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Date of Birth</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.dob}</span>
              </div>
              <div className="col-span-3 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Phone #</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.phone}</span>
              </div>

              <div className="col-span-6 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Street Address</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.streetAddress}</span>
              </div>
              <div className="col-span-3 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">SSN</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.ssn}</span>
              </div>
              <div className="col-span-3 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">DL#</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.dl}</span>
              </div>

              <div className="col-span-4 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">City</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.city}</span>
              </div>
              <div className="col-span-2 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">State</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.state}</span>
              </div>
              <div className="col-span-2 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Zip</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.zip}</span>
              </div>
              <div className="col-span-4 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap"># of Dependents</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.dependents}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Residential Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-3.5 bg-primary"></div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">Residential Status</h2>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-6 py-1 px-3 border border-slate-100 bg-slate-50/50 rounded-sm">
                <div className="flex items-center gap-3">
                  <span className="text-[8.5px] font-black uppercase text-slate-500">Home</span>
                  <label className="flex items-center gap-1.5 text-[8.5px] font-black text-slate-950">
                    <input type="checkbox" checked={data.homeStatus === 'rent'} readOnly className="w-3.5 h-3.5 border-slate-300 accent-primary" />
                    RENT
                  </label>
                  <label className="flex items-center gap-1.5 text-[8.5px] font-black text-slate-950">
                    <input type="checkbox" checked={data.homeStatus === 'own'} readOnly className="w-3.5 h-3.5 border-slate-300 accent-primary" />
                    OWN
                  </label>
                </div>
                
                <div className="flex items-end gap-1.5 w-32 ml-4">
                  <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Monthly $</span>
                  <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">${formatMoney(data.monthlyHomeCost)}</span>
                </div>

                <div className="flex items-end gap-1.5 flex-1 ml-4">
                  <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">To Whom?</span>
                  <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.toWhom}</span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-x-4 gap-y-2">
                <div className="col-span-8 flex items-end gap-1.5">
                  <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Previous Address</span>
                  <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.previousAddress || 'N/A'}</span>
                </div>
                <div className="col-span-4 flex items-end gap-3">
                  <span className="text-[8.5px] font-black uppercase text-slate-500 whitespace-nowrap">How Long</span>
                  <div className="flex items-end gap-1 w-16">
                    <span className="text-[8.5px] font-black uppercase text-slate-900">Yrs</span>
                    <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px] text-center">{data.howLongYrs || '0'}</span>
                  </div>
                  <div className="flex items-end gap-1 w-16">
                    <span className="text-[8.5px] font-black uppercase text-slate-900">Mos</span>
                    <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px] text-center">{data.howLongMos || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Employment Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-3.5 bg-primary"></div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">Employment Information</h2>
            </div>

            <div className="grid grid-cols-12 gap-x-4 gap-y-2.5">
              <div className="col-span-7 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Employer</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.employer}</span>
              </div>
              <div className="col-span-5 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Phone #</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.employerPhone}</span>
              </div>

              <div className="col-span-7 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Occupation</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.occupation}</span>
              </div>
              <div className="col-span-5 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Net Comp $</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">${formatMoney(data.netCompensation)}</span>
              </div>

              <div className="col-span-7 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Former Employer</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.formerEmployer || 'N/A'}</span>
              </div>
              <div className="col-span-5 flex items-end gap-3">
                <span className="text-[8.5px] font-black uppercase text-slate-500 whitespace-nowrap">How Long</span>
                <div className="flex items-end gap-1 w-16">
                  <span className="text-[8.5px] font-black uppercase text-slate-900">Yrs</span>
                  <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px] text-center">{data.formerHowLongYrs || '0'}</span>
                </div>
                <div className="flex items-end gap-1 w-16">
                  <span className="text-[8.5px] font-black uppercase text-slate-900">Mos</span>
                  <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px] text-center">{data.formerHowLongMos || '0'}</span>
                </div>
              </div>

              <div className="col-span-12 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Address</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.formerEmployerAddress || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Nearest Relative */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-3.5 bg-primary"></div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">Nearest Relative (Not living with you)</h2>
            </div>
            <div className="grid grid-cols-12 gap-x-4 gap-y-2">
              <div className="col-span-6 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Name</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.relativeName || 'N/A'}</span>
              </div>
              <div className="col-span-6 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Address</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.relativeAddress || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Note Box */}
          <div className="border border-slate-200 rounded-sm p-1.5 bg-slate-50 text-[7px] leading-relaxed text-center font-medium italic text-slate-500 max-w-4xl">
            Note: You are not required to list income from alimony, child support, or separate maintenance payments UNLESS you wish to rely on such income. However, if any of the additional income shown is from such source, what is the amount?
          </div>

          {/* Other Income */}
          <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-4 flex items-end gap-1.5">
              <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Other Income $</span>
              <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.otherIncomeAmount ? `$${formatMoney(data.otherIncomeAmount)}` : 'N/A'}</span>
            </div>
            <div className="col-span-8 flex items-end gap-1.5">
              <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">(Monthly) Source</span>
              <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.otherIncomeSource || 'N/A'}</span>
            </div>
          </div>

          {/* Section 5: Co-Applicant / Spouse */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between gap-4 py-1 px-3 border border-slate-100 bg-slate-50/50 rounded-sm">
              <span className="text-[8.5px] font-black uppercase text-slate-900">Will your present or former spouse, if any, be contractually liable for this debt?</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-1 text-[8.5px] font-black text-slate-950">
                  <input type="checkbox" checked={isChecked(data.spouseLiable)} readOnly className="w-3.5 h-3.5 accent-primary" />
                  YES
                </label>
                <label className="flex items-center gap-1 text-[8.5px] font-black text-slate-950">
                  <input type="checkbox" checked={!isChecked(data.spouseLiable)} readOnly className="w-3.5 h-3.5 accent-primary" />
                  NO
                </label>
              </div>
            </div>

            <p className="text-[7.5px] uppercase font-bold text-slate-400 leading-normal">
              If yes, are you married [ {isChecked(data.spouseLiable) && data.spouseMarriedStatus === 'married' ? 'X' : ' '} ] unmarried [ {isChecked(data.spouseLiable) && data.spouseMarriedStatus === 'unmarried' ? 'X' : ' '} ] separated [ {isChecked(data.spouseLiable) && data.spouseMarriedStatus === 'separated' ? 'X' : ' '} ]? Answer the following about your spouse:
            </p>

            <div className="grid grid-cols-12 gap-x-4 gap-y-2.5">
              <div className="col-span-6 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Name</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.spouseName || 'N/A'}</span>
              </div>
              <div className="col-span-2 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Age</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.spouseAge || 'N/A'}</span>
              </div>
              <div className="col-span-4 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Address</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.spouseAddress || 'N/A'}</span>
              </div>

              <div className="col-span-4 flex items-center gap-3">
                <span className="text-[8.5px] font-black uppercase text-slate-500 whitespace-nowrap">Employed?</span>
                <label className="flex items-center gap-1 text-[8.5px] font-black text-slate-950">
                  <input type="checkbox" checked={isChecked(data.spouseEmployed)} readOnly className="w-3.5 h-3.5 accent-primary" />
                  YES
                </label>
                <label className="flex items-center gap-1 text-[8.5px] font-black text-slate-950">
                  <input type="checkbox" checked={!isChecked(data.spouseEmployed)} readOnly className="w-3.5 h-3.5 accent-primary" />
                  NO
                </label>
              </div>

              <div className="col-span-5 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">By Whom?</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.spouseByWhom || 'N/A'}</span>
              </div>
              <div className="col-span-3 flex items-end gap-2">
                <span className="text-[8.5px] font-black uppercase text-slate-500 whitespace-nowrap">How Long</span>
                <div className="flex items-end gap-0.5 w-10">
                  <span className="text-[8.5px] font-bold">Yrs</span>
                  <span className="flex-1 border-b border-slate-300 px-0.5 text-xs font-semibold text-slate-900 min-h-[20px] text-center">{data.spouseHowLongYrs || '0'}</span>
                </div>
                <div className="flex items-end gap-0.5 w-10">
                  <span className="text-[8.5px] font-bold">Mos</span>
                  <span className="flex-1 border-b border-slate-300 px-0.5 text-xs font-semibold text-slate-900 min-h-[20px] text-center">{data.spouseHowLongMos || '0'}</span>
                </div>
              </div>

              <div className="col-span-5 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Emp. Address</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.spouseEmployerAddress || 'N/A'}</span>
              </div>
              <div className="col-span-3 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Monthly Salary $</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.spouseMonthlySalary ? `$${formatMoney(data.spouseMonthlySalary)}` : 'N/A'}</span>
              </div>
              <div className="col-span-4 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Phone</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.spousePhone || 'N/A'}</span>
              </div>

              <div className="col-span-6 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Position</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.spousePosition || 'N/A'}</span>
              </div>
              <div className="col-span-6 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">SSN (Optional)</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.spouseSsn || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Section 6: Credit and Trade Reference */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-3.5 bg-primary"></div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">Credit and Trade Reference</h2>
            </div>

            <div className="grid grid-cols-12 gap-x-4 gap-y-2.5">
              <div className="col-span-6 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Your Bank</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.bankName || 'N/A'}</span>
              </div>
              
              <div className="col-span-6 flex items-center justify-between px-2 bg-slate-50 border border-slate-100 rounded-sm">
                <label className="flex items-center gap-1.5 text-[8.5px] font-bold text-slate-950">
                  <input type="checkbox" checked={isChecked(data.bankChecking)} readOnly className="w-3.5 h-3.5 accent-primary" />
                  Checking
                </label>
                <label className="flex items-center gap-1.5 text-[8.5px] font-bold text-slate-950">
                  <input type="checkbox" checked={isChecked(data.bankSavings)} readOnly className="w-3.5 h-3.5 accent-primary" />
                  Savings
                </label>
                <label className="flex items-center gap-1.5 text-[8.5px] font-bold text-slate-950">
                  <input type="checkbox" checked={isChecked(data.bankLoan)} readOnly className="w-3.5 h-3.5 accent-primary" />
                  Loan
                </label>
              </div>

              <div className="col-span-12 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Address</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.bankAddress || 'N/A'}</span>
              </div>

              <div className="col-span-7 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Last Car Purchased From: Dealer</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.lastCarDealer || 'N/A'}</span>
              </div>
              <div className="col-span-5 flex items-end gap-1.5">
                <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Financed By</span>
                <span className="flex-1 border-b border-slate-300 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.financedBy || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Section 7: References Table */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-3.5 bg-primary"></div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">References</h2>
            </div>
            
            <div className="border border-slate-400 rounded-sm overflow-hidden mt-1">
              <table className="w-full text-left border-collapse text-slate-950">
                <thead className="bg-slate-100 border-b border-slate-400">
                  <tr className="h-6">
                    <th className="text-[8.5px] uppercase font-black px-2 border-r border-slate-300 w-1/3">Name</th>
                    <th className="text-[8.5px] uppercase font-black px-2 border-r border-slate-300 w-5/12">Address</th>
                    <th className="text-[8.5px] uppercase font-black px-2">#</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((num) => (
                    <tr key={num} className="h-6 border-b border-slate-300 last:border-0">
                      <td className="px-2 text-xs font-semibold border-r border-slate-300">{data[`reference${num}Name`]}</td>
                      <td className="px-2 text-xs font-semibold border-r border-slate-300">{data[`reference${num}Address`]}</td>
                      <td className="px-2 text-xs font-semibold">{data[`reference${num}Phone`]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer & Consent */}
        <div className="mt-4 pt-2 border-t border-slate-300 space-y-3">
          <p className="text-[7px] leading-relaxed text-slate-500 font-semibold">
            I AUTHORIZE the making of whatever credit inquiries are deemed necessary in connection with my credit application or in the course of review or collection of any credit extended in reliance on the application. I authorize and instruct any person or consumer reporting agency to compile and furnish any information it may have or obtain in response to such credit inquiries and agree that same shall remain your property whether or not credit is extended. <br/>
            <strong>I have read the foregoing application and the statements made in it are true and correct.</strong>
          </p>

          <div className="grid grid-cols-12 gap-x-12 mt-2">
            <div className="col-span-4 flex items-end gap-1.5">
              <span className="text-[8.5px] font-black uppercase text-slate-900 tracking-wide whitespace-nowrap">Date</span>
              <span className="flex-1 border-b border-slate-400 px-1 py-0.5 text-xs font-semibold text-slate-900 min-h-[20px]">{data.authDate}</span>
            </div>
            <div className="col-span-8 flex items-end gap-2">
              <span className="text-base font-black italic text-slate-400">X</span>
              <span className="flex-1 border-b border-slate-400 px-2 py-0.5 text-sm font-black italic font-serif text-slate-900 min-h-[22px]">
                {data.signature}
              </span>
            </div>
          </div>
        </div>

        {/* Print Action Button at the bottom (matches screenshot layout, hides during print) */}
        <div className="flex justify-center pt-4 mt-2 print:hidden">
          <PrintButton
            className="border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 hover:text-slate-800 py-2.5 px-8 text-xs font-black uppercase tracking-[0.2em] rounded shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            label="Print"
          />
        </div>

      </div>
    </div>
  );
}
