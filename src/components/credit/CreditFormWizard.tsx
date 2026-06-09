'use client';

import { useState, useTransition } from 'react';
import { submitCreditApplication } from '@/app/actions/credit';
import { dealer } from '@/config/dealerships/right-price';

const STEPS = [
  { id: 1, name: 'Personal Details' },
  { id: 2, name: 'Housing & Rent' },
  { id: 3, name: 'Employment' },
  { id: 4, name: 'Co-Applicant / Spouse' },
  { id: 5, name: 'References & Bank' },
  { id: 6, name: 'Authorization' },
];

export default function CreditFormWizard({ vin }: { vin?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({
    // Step 1: Personal Details
    name: '',
    dob: '',
    phone: '',
    streetAddress: '',
    ssn: '',
    dl: '',
    city: '',
    state: '',
    zip: '',
    dependents: '0',
    // Step 2: Housing
    homeStatus: 'rent', // rent or own
    monthlyHomeCost: '',
    toWhom: '',
    previousAddress: '',
    howLongYrs: '',
    howLongMos: '',
    // Step 3: Employment
    employer: '',
    employerPhone: '',
    occupation: '',
    netCompensation: '',
    howLongJobYrs: '',
    howLongJobMos: '',
    formerEmployer: '',
    formerEmployerAddress: '',
    formerHowLongYrs: '',
    formerHowLongMos: '',
    // Step 4: Spouse
    spouseLiable: 'false',
    spouseMarriedStatus: 'unmarried', // married, unmarried, separated
    spouseName: '',
    spouseAge: '',
    spouseAddress: '',
    spouseEmployed: 'false',
    spouseByWhom: '',
    spouseHowLongYrs: '',
    spouseHowLongMos: '',
    spouseEmployerAddress: '',
    spouseMonthlySalary: '',
    spousePhone: '',
    spousePosition: '',
    spouseSsn: '',
    // Step 5: Nearest Relative & Other Income & References
    relativeName: '',
    relativeAddress: '',
    otherIncomeAmount: '',
    otherIncomeSource: '',
    bankName: '',
    bankChecking: 'false',
    bankSavings: 'false',
    bankLoan: 'false',
    bankAddress: '',
    lastCarDealer: '',
    financedBy: '',
    // Step 6: 4 References
    reference1Name: '',
    reference1Address: '',
    reference1Phone: '',
    reference2Name: '',
    reference2Address: '',
    reference2Phone: '',
    reference3Name: '',
    reference3Address: '',
    reference3Phone: '',
    reference4Name: '',
    reference4Address: '',
    reference4Phone: '',
    // Step 7: Consent & Sign
    authDate: new Date().toISOString().substring(0, 10),
    signature: '',
    consentChecked: 'false',
  });

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [successState, setSuccessState] = useState<{
    success: boolean;
    previewUrl?: string;
  }>({ success: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked.toString() : value;
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => {
    // Basic validation per step
    setErrorMsg('');
    if (currentStep === 1) {
      if (!formData.name || !formData.dob || !formData.phone || !formData.streetAddress || !formData.city || !formData.state || !formData.zip) {
        setErrorMsg('Please fill in all personal details.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.monthlyHomeCost) {
        setErrorMsg('Please enter your monthly home cost.');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.employer || !formData.occupation || !formData.netCompensation) {
        setErrorMsg('Please enter current employer details and monthly net income.');
        return;
      }
    }

    // Skip Step 4 (Spouse) if spouse is not contractually liable
    if (currentStep === 3 && formData.spouseLiable === 'false') {
      setCurrentStep(5);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setErrorMsg('');
    // If returning from references/bank (Step 5) and spouse was not liable, skip back to Step 3
    if (currentStep === 5 && formData.spouseLiable === 'false') {
      setCurrentStep(3);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.consentChecked !== 'true') {
      setErrorMsg('You must authorize and check the consent box to submit.');
      return;
    }
    if (!formData.signature) {
      setErrorMsg('Please sign the application by typing your full name.');
      return;
    }

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      submitData.append(key, val);
    });
    if (vin) {
      submitData.append('vin', vin);
    }

    startTransition(async () => {
      const result = await submitCreditApplication({ status: 'idle', message: '' }, submitData);
      if (result.status === 'success') {
        setSuccessState({ success: true, previewUrl: result.previewUrl });
      } else {
        setErrorMsg(result.message || 'Something went wrong. Please try again.');
      }
    });
  };

  if (successState.success) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 shadow-sm text-center max-w-xl mx-auto my-10 animate-fade-in">
        <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-secondary uppercase tracking-tight">Application Submitted Securely</h2>
        <p className="mt-4 text-gray-600 text-sm leading-relaxed">
          Thank you, <strong>{formData.name}</strong>. Your credit application details were packaged, encrypted, and emailed directly to our financing desk.
        </p>
        <p className="mt-2 text-gray-500 text-xs">
          To protect your privacy, no credit data (such as SSN or income) is saved in our database files.
        </p>

        {/* Development preview link for testing */}
        <div className="mt-8 pt-8 border-t border-gray-100 bg-gray-50 -mx-8 -mb-8 p-6 rounded-b-lg">
          <span className="text-[10px] font-bold tracking-widest text-primary uppercase block mb-2">Local Testing Console</span>
          <a
            href={successState.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-secondary text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded hover:bg-primary transition-all active:scale-95 shadow"
          >
            Open 1:1 Print Preview Page
          </a>
          <p className="mt-2 text-[10px] text-gray-400 max-w-xs mx-auto leading-normal">
            Click this button to see exactly how your input maps onto the final physical credit application sheet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-gray-100 rounded-xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] my-6 sm:my-10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-secondary uppercase italic">
          Apply For <span className="text-primary">Financing</span>
        </h1>
        <p className="mt-2 text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
          Complete our secure, online credit application. We offer flexible in-house Buy Here Pay Here solutions.
        </p>
      </div>

      {/* Visual Stepper */}
      <div className="hidden md:flex items-center justify-between mb-8 px-4 border-b border-gray-100 pb-4">
        {STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          return (
            <div key={step.id} className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black tracking-tighter transition-all
                ${isActive ? 'bg-primary text-white scale-110 shadow-sm' : ''}
                ${isCompleted ? 'bg-secondary text-white' : ''}
                ${!isActive && !isCompleted ? 'bg-gray-100 text-gray-400' : ''}
              `}>
                {step.id}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider
                ${isActive ? 'text-primary' : 'text-gray-400'}
                ${isCompleted ? 'text-secondary' : ''}
              `}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper */}
      <div className="flex md:hidden items-center justify-between mb-6 border-b border-gray-100 pb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-xs font-black text-secondary uppercase">
          {STEPS[currentStep - 1].name}
        </span>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-primary rounded text-xs font-bold text-primary animate-shake">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* STEP 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-black text-secondary uppercase tracking-wider border-l-4 border-primary pl-2 mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. (615) 555-0199"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder="e.g. 123 Main St"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-gray-700 text-xs font-bold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    name="state"
                    maxLength={2}
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="TN"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Zip *</label>
                  <input
                    type="text"
                    required
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    placeholder="Zip"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Social Security Number (SSN) *</label>
                <input
                  type="password"
                  required
                  name="ssn"
                  value={formData.ssn}
                  onChange={handleChange}
                  placeholder="***-**-****"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Driver&apos;s License (DL#) *</label>
                <input
                  type="text"
                  required
                  name="dl"
                  value={formData.dl}
                  onChange={handleChange}
                  placeholder="e.g. TN-987654"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1"># of Dependents</label>
                <input
                  type="number"
                  name="dependents"
                  value={formData.dependents}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Housing & Rent */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-black text-secondary uppercase tracking-wider border-l-4 border-primary pl-2 mb-4">Housing & Residency</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Home Ownership Status *</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer font-semibold text-secondary">
                    <input
                      type="radio"
                      checked={formData.homeStatus === 'rent'}
                      onChange={() => handleRadioChange('homeStatus', 'rent')}
                      className="accent-primary w-4 h-4"
                    />
                    Rent
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer font-semibold text-secondary">
                    <input
                      type="radio"
                      checked={formData.homeStatus === 'own'}
                      onChange={() => handleRadioChange('homeStatus', 'own')}
                      className="accent-primary w-4 h-4"
                    />
                    Own
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Monthly Cost ($) *</label>
                <input
                  type="number"
                  required
                  name="monthlyHomeCost"
                  value={formData.monthlyHomeCost}
                  onChange={handleChange}
                  placeholder="e.g. 1200"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">To Whom Paid (Landlord / Mortgage Bank)</label>
                <input
                  type="text"
                  name="toWhom"
                  value={formData.toWhom}
                  onChange={handleChange}
                  placeholder="e.g. Oakwood Apartments"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Time at Address (Yrs)</label>
                  <input
                    type="number"
                    name="howLongYrs"
                    value={formData.howLongYrs}
                    onChange={handleChange}
                    placeholder="Years"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Time at Address (Mos)</label>
                  <input
                    type="number"
                    name="howLongMos"
                    value={formData.howLongMos}
                    onChange={handleChange}
                    placeholder="Months"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1">Previous Address (If current is less than 2 years)</label>
              <input
                type="text"
                name="previousAddress"
                value={formData.previousAddress}
                onChange={handleChange}
                placeholder="e.g. 456 Old Post Rd, Nashville, TN 37211"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Employment Details */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-black text-secondary uppercase tracking-wider border-l-4 border-primary pl-2 mb-4">Employment & Income</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Current Employer *</label>
                <input
                  type="text"
                  required
                  name="employer"
                  value={formData.employer}
                  onChange={handleChange}
                  placeholder="e.g. Nissan Plant"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Employer Phone #</label>
                <input
                  type="tel"
                  name="employerPhone"
                  value={formData.employerPhone}
                  onChange={handleChange}
                  placeholder="e.g. (615) 555-9000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Occupation / Position *</label>
                <input
                  type="text"
                  required
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g. Assembly Line Tech"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Net Monthly Income ($) *</label>
                <input
                  type="number"
                  required
                  name="netCompensation"
                  value={formData.netCompensation}
                  onChange={handleChange}
                  placeholder="Take-home pay"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Time at Job (Yrs)</label>
                  <input
                    type="number"
                    name="howLongJobYrs"
                    value={formData.howLongJobYrs}
                    onChange={handleChange}
                    placeholder="Yrs"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Time (Mos)</label>
                  <input
                    type="number"
                    name="howLongJobMos"
                    value={formData.howLongJobMos}
                    onChange={handleChange}
                    placeholder="Mos"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Previous Job (If current is less than 2 years)</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Former Employer</label>
                  <input
                    type="text"
                    name="formerEmployer"
                    value={formData.formerEmployer}
                    onChange={handleChange}
                    placeholder="Previous Company"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Time (Yrs)</label>
                    <input
                      type="number"
                      name="formerHowLongYrs"
                      value={formData.formerHowLongYrs}
                      onChange={handleChange}
                      placeholder="Yrs"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Time (Mos)</label>
                    <input
                      type="number"
                      name="formerHowLongMos"
                      value={formData.formerHowLongMos}
                      onChange={handleChange}
                      placeholder="Mos"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Former Employer Address</label>
                <input
                  type="text"
                  name="formerEmployerAddress"
                  value={formData.formerEmployerAddress}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between gap-4 mt-6">
              <span className="text-xs font-bold text-secondary">Will your spouse or co-applicant be contractually liable for this debt?</span>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleRadioChange('spouseLiable', 'true')}
                  className={`px-4 py-1.5 text-xs font-bold uppercase rounded transition-all ${formData.spouseLiable === 'true' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleRadioChange('spouseLiable', 'false')}
                  className={`px-4 py-1.5 text-xs font-bold uppercase rounded transition-all ${formData.spouseLiable === 'false' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-400'}`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Spouse / Co-applicant Details */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-black text-secondary uppercase tracking-wider border-l-4 border-primary pl-2 mb-4">Spouse / Co-Applicant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-4 items-center">
                <label className="block text-gray-700 text-xs font-bold">Marital Status:</label>
                <div className="flex gap-3">
                  {['married', 'unmarried', 'separated'].map((s) => (
                    <label key={s} className="flex items-center gap-1.5 text-xs font-semibold text-secondary cursor-pointer capitalize">
                      <input
                        type="radio"
                        checked={formData.spouseMarriedStatus === s}
                        onChange={() => handleRadioChange('spouseMarriedStatus', s)}
                        className="accent-primary"
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Spouse Name</label>
                  <input
                    type="text"
                    name="spouseName"
                    value={formData.spouseName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Spouse Age</label>
                  <input
                    type="number"
                    name="spouseAge"
                    value={formData.spouseAge}
                    onChange={handleChange}
                    placeholder="Age"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1">Spouse Address (If different)</label>
              <input
                type="text"
                name="spouseAddress"
                value={formData.spouseAddress}
                onChange={handleChange}
                placeholder="Spouse home address"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-gray-50 p-4 rounded-lg">
              <span className="text-xs font-bold text-secondary">Is your spouse/co-applicant currently employed?</span>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleRadioChange('spouseEmployed', 'true')}
                  className={`px-4 py-1.5 text-xs font-bold uppercase rounded transition-all ${formData.spouseEmployed === 'true' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleRadioChange('spouseEmployed', 'false')}
                  className={`px-4 py-1.5 text-xs font-bold uppercase rounded transition-all ${formData.spouseEmployed === 'false' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-400'}`}
                >
                  No
                </button>
              </div>
            </div>

            {formData.spouseEmployed === 'true' && (
              <div className="space-y-4 border border-gray-100 rounded-lg p-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Spouse Employer</label>
                    <input
                      type="text"
                      name="spouseByWhom"
                      value={formData.spouseByWhom}
                      onChange={handleChange}
                      placeholder="Employer Name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-700 text-xs font-bold mb-1">Time (Yrs)</label>
                      <input
                        type="number"
                        name="spouseHowLongYrs"
                        value={formData.spouseHowLongYrs}
                        onChange={handleChange}
                        placeholder="Yrs"
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-xs font-bold mb-1">Time (Mos)</label>
                      <input
                        type="number"
                        name="spouseHowLongMos"
                        value={formData.spouseHowLongMos}
                        onChange={handleChange}
                        placeholder="Mos"
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Spouse Job Address</label>
                    <input
                      type="text"
                      name="spouseEmployerAddress"
                      value={formData.spouseEmployerAddress}
                      onChange={handleChange}
                      placeholder="Work address"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-gray-700 text-xs font-bold mb-1">Monthly Salary ($)</label>
                      <input
                        type="number"
                        name="spouseMonthlySalary"
                        value={formData.spouseMonthlySalary}
                        onChange={handleChange}
                        placeholder="Gross Monthly"
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-gray-700 text-xs font-bold mb-1">Work Phone</label>
                      <input
                        type="tel"
                        name="spousePhone"
                        value={formData.spousePhone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Spouse Position</label>
                    <input
                      type="text"
                      name="spousePosition"
                      value={formData.spousePosition}
                      onChange={handleChange}
                      placeholder="e.g. Manager"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1">Spouse SSN</label>
                    <input
                      type="password"
                      name="spouseSsn"
                      value={formData.spouseSsn}
                      onChange={handleChange}
                      placeholder="***-**-****"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: References & Bank Info */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sm font-black text-secondary uppercase tracking-wider border-l-4 border-primary pl-2 mb-4">Financial Reference & Nearest Relative</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Your Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="e.g. Ascend Federal Credit Union"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex gap-6 items-center pt-5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      name="bankChecking"
                      checked={formData.bankChecking === 'true'}
                      onChange={handleChange}
                      className="accent-primary w-4 h-4 rounded"
                    />
                    Checking Account
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      name="bankSavings"
                      checked={formData.bankSavings === 'true'}
                      onChange={handleChange}
                      className="accent-primary w-4 h-4 rounded"
                    />
                    Savings Account
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      name="bankLoan"
                      checked={formData.bankLoan === 'true'}
                      onChange={handleChange}
                      className="accent-primary w-4 h-4 rounded"
                    />
                    Active Loan
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-gray-700 text-xs font-bold mb-1">Bank Address</label>
                  <input
                    type="text"
                    name="bankAddress"
                    value={formData.bankAddress}
                    onChange={handleChange}
                    placeholder="Bank Branch Address"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Last Finance Company / Dealer</label>
                  <input
                    type="text"
                    name="financedBy"
                    value={formData.financedBy}
                    onChange={handleChange}
                    placeholder="Financed previous car through"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Nearest Relative (Not living with you)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Relative Name</label>
                  <input
                    type="text"
                    name="relativeName"
                    value={formData.relativeName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Relative Address</label>
                  <input
                    type="text"
                    name="relativeAddress"
                    value={formData.relativeAddress}
                    onChange={handleChange}
                    placeholder="Full Address & Phone"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Other Income Sources (Alimony, child support, etc. - Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Other Income Amount ($ Monthly)</label>
                  <input
                    type="number"
                    name="otherIncomeAmount"
                    value={formData.otherIncomeAmount}
                    onChange={handleChange}
                    placeholder="Monthly Amount"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold mb-1">Source</label>
                  <input
                    type="text"
                    name="otherIncomeSource"
                    value={formData.otherIncomeSource}
                    onChange={handleChange}
                    placeholder="Source of income"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-black text-secondary uppercase tracking-wider border-l-4 border-primary pl-2 mb-4">Personal References (Need 4)</h4>
              <p className="text-[11px] text-gray-500 mb-4">Please list four personal references whom we can contact to verify references.</p>
              
              <div className="space-y-4">
                {/* Reference Inputs */}
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <label className="block text-gray-700 text-[10px] font-bold uppercase mb-1">Ref {num} Full Name *</label>
                      <input
                        type="text"
                        required
                        name={`reference${num}Name`}
                        value={formData[`reference${num}Name`]}
                        onChange={handleChange}
                        placeholder="Reference Name"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-[10px] font-bold uppercase mb-1">Ref {num} Address *</label>
                      <input
                        type="text"
                        required
                        name={`reference${num}Address`}
                        value={formData[`reference${num}Address`]}
                        onChange={handleChange}
                        placeholder="Reference City, State"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-[10px] font-bold uppercase mb-1">Ref {num} Phone *</label>
                      <input
                        type="tel"
                        required
                        name={`reference${num}Phone`}
                        value={formData[`reference${num}Phone`]}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-secondary focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Authorization & Signature */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-black text-secondary uppercase tracking-wider border-l-4 border-primary pl-2 mb-4">Consent & Credit Authorization</h3>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-[11px] text-gray-600 leading-relaxed max-h-60 overflow-y-auto shadow-inner">
              <p className="mb-3">
                <strong>AUTHORIZATION FOR CREDIT INQUIRY:</strong>
              </p>
              <p className="mb-3">
                I AUTHORIZE the making of whatever credit inquiries are deemed necessary in connection with my credit application or in the course of review or collection of any credit extended in reliance on the application. I authorize and instruct any person or consumer reporting agency to compile and furnish any information it may have or obtain in response to such credit inquiries and agree that the same shall remain your property whether or not credit is extended.
              </p>
              <p className="mb-3 font-bold text-secondary">
                I have read the foregoing application and the statements made in it are true and correct.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                id="consentChecked"
                type="checkbox"
                name="consentChecked"
                checked={formData.consentChecked === 'true'}
                onChange={handleChange}
                className="accent-primary w-5 h-5 rounded border-gray-300 mt-0.5 cursor-pointer"
              />
              <label htmlFor="consentChecked" className="text-xs text-gray-700 font-semibold cursor-pointer select-none">
                I certify that I have read the credit inquiry authorization and all statements in my application are true and correct. I authorize Right Price Auto Sales to perform credit checks for financing review. *
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Date of Consent *</label>
                <input
                  type="date"
                  required
                  name="authDate"
                  value={formData.authDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1">Electronic Signature (Type Full Name) *</label>
                <input
                  type="text"
                  required
                  name="signature"
                  value={formData.signature}
                  onChange={handleChange}
                  placeholder="e.g. Jane Alice Doe"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold italic text-secondary focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || isPending}
            className="px-6 py-2 border border-gray-200 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            Back
          </button>
          
          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-secondary text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors active:scale-95 shadow-sm"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-2 bg-primary text-white rounded text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity active:scale-95 shadow flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}
