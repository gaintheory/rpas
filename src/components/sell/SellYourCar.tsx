'use client';

import { useState, useTransition } from 'react';
import { submitVehicleSaleLead, type SellState } from '@/app/actions/sell';

type Step = 'details' | 'valuation' | 'contact' | 'success';

export default function SellYourCar() {
  const [step, setStep] = useState<Step>('details');
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [miles, setMiles] = useState('');
  const [condition, setCondition] = useState('good');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  // Client-side quick valuation calculation
  const calculateValuation = () => {
    const y = parseInt(year, 10) || new Date().getFullYear();
    const m = parseInt(miles, 10) || 0;
    const basePrice = 35000; // Average base MSRP assumption
    const age = Math.max(0, new Date().getFullYear() - y);
    const ageDepreciation = basePrice * (1 - Math.pow(0.85, age));
    const mileageDepreciation = m * 0.12;
    
    let currentVal = Math.max(1500, basePrice - ageDepreciation - mileageDepreciation);
    
    if (condition === 'excellent') currentVal *= 1.15;
    if (condition === 'good') currentVal *= 1.00;
    if (condition === 'fair') currentVal *= 0.80;
    if (condition === 'poor') currentVal *= 0.55;

    return {
      min: Math.max(1000, Math.round(currentVal * 0.9)),
      max: Math.max(1500, Math.round(currentVal * 1.1)),
    };
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !make || !model || !miles) {
      setErrorMsg('Please fill in all vehicle information.');
      return;
    }
    setErrorMsg('');
    setStep('valuation');
  };

  const handleProceedToContact = () => {
    setStep('contact');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      setErrorMsg('Name and Phone are required.');
      return;
    }
    setErrorMsg('');

    const formData = new FormData();
    formData.append('year', year);
    formData.append('make', make);
    formData.append('model', model);
    formData.append('miles', miles);
    formData.append('condition', condition);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);

    startTransition(async () => {
      const result = await submitVehicleSaleLead({ status: 'idle', message: '' }, formData);
      if (result.status === 'success') {
        setStep('success');
      } else {
        setErrorMsg(result.message || 'Something went wrong. Please try again.');
      }
    });
  };

  const { min, max } = calculateValuation();

  return (
    <section className="relative w-full min-h-[640px] md:min-h-[750px] lg:min-h-[850px] flex items-center bg-secondary overflow-hidden py-14 md:py-24 px-4 sm:px-8">
      {/* Background Cartoon Office (covers the entire section) */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-70 md:opacity-85 transition-opacity duration-500"
        style={{
          backgroundImage: "url('/office_cartoon.png')",
        }}
      />
      
      {/* Semi-translucent dark overlay to ensure high text contrast and visual depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/55 via-secondary/35 to-secondary/65 z-1 pointer-events-none" />
      
      {/* Border glow / line divider details */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-2 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-2 pointer-events-none" />

      {/* Main Centered Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Copy and Headline */}
        <div className="flex flex-col items-center mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {/* Eyebrow badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 bg-black/45 border border-white/20 text-white/90 text-xs font-semibold tracking-[0.15em] uppercase rounded-full px-4 py-1.5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Sell Your Car Direct
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.1] text-white">
            Looking for <span className="text-primary">a buyer?</span>
          </h2>
          
          <p className="mt-3 text-white/95 text-sm md:text-base max-w-xl leading-relaxed font-medium">
            Skip the listing hassle. Right Price Auto Sales will buy your car directly, <strong className="text-white">even if you don&apos;t buy one of ours</strong>.
          </p>

          {/* Quick trust metrics */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-4 w-full max-w-xl">
            <div className="flex flex-col items-center bg-secondary border-[3px] border-black rounded-xl px-5 py-3.5 shadow-[4px_4px_0px_0px_#000] min-w-[125px] flex-1 transform -rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <p className="text-primary font-black text-base md:text-lg leading-none">Instant</p>
              <p className="text-white/95 text-[10px] uppercase font-extrabold tracking-wider mt-1.5">Estimations</p>
            </div>
            <div className="flex flex-col items-center bg-secondary border-[3px] border-black rounded-xl px-5 py-3.5 shadow-[4px_4px_0px_0px_#000] min-w-[125px] flex-1 transform rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <p className="text-primary font-black text-base md:text-lg leading-none">Same-Day</p>
              <p className="text-white/95 text-[10px] uppercase font-extrabold tracking-wider mt-1.5">Payment</p>
            </div>
            <div className="flex flex-col items-center bg-secondary border-[3px] border-black rounded-xl px-5 py-3.5 shadow-[4px_4px_0px_0px_#000] min-w-[125px] flex-1 transform -rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <p className="text-primary font-black text-base md:text-lg leading-none">33 Years</p>
              <p className="text-white/95 text-[10px] uppercase font-extrabold tracking-wider mt-1.5">Local Trust</p>
            </div>
          </div>
        </div>

        {/* Center: The Cartoon Style Form Container */}
        <div className="w-full max-w-xl mx-auto">
          <div className="bg-secondary border-4 border-black rounded-2xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] transition-all duration-300">
            {step === 'details' && (
              <form onSubmit={handleNextStep} className="flex flex-col gap-4">
                <div>
                  <h3 className="text-xl font-black text-white">Get a Quick Valuation</h3>
                  <p className="text-white/70 text-xs mt-1">Provide your vehicle specifications to see a price range.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/85 text-xs font-bold mb-1" htmlFor="year">Year</label>
                    <input
                      id="year"
                      type="number"
                      required
                      placeholder="e.g. 2018"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/85 text-xs font-bold mb-1" htmlFor="miles">Mileage</label>
                    <input
                      id="miles"
                      type="number"
                      required
                      placeholder="e.g. 85000"
                      value={miles}
                      onChange={(e) => setMiles(e.target.value)}
                      className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/85 text-xs font-bold mb-1" htmlFor="make">Make</label>
                    <input
                      id="make"
                      type="text"
                      required
                      placeholder="e.g. Honda"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/85 text-xs font-bold mb-1" htmlFor="model">Model</label>
                    <input
                      id="model"
                      type="text"
                      required
                      placeholder="e.g. Accord"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/85 text-xs font-bold mb-1.5">Condition</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['excellent', 'good', 'fair', 'poor'].map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setCondition(cond)}
                        className={`py-2 text-xs font-extrabold rounded-lg capitalize border-2 border-black transition-all ${
                          condition === cond
                            ? 'bg-primary text-white shadow-[2px_2px_0px_0px_#000] translate-y-[-1px]'
                            : 'bg-black/20 text-white/60 hover:bg-black/35 shadow-[1px_1px_0px_0px_#000]'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                {errorMsg && <p className="text-primary text-xs font-bold">{errorMsg}</p>}

                <button
                  type="submit"
                  className="w-full bg-primary text-white font-extrabold text-sm border-[3px] border-black rounded-full py-3 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] transition-all duration-200 mt-2 flex items-center justify-center gap-2"
                >
                  Calculate Value Range
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            )}

            {step === 'valuation' && (
              <div className="flex flex-col gap-6 text-center py-4">
                <div>
                  <h3 className="text-xl font-black text-white">Estimated Valuation</h3>
                  <p className="text-white/70 text-xs mt-1">Based on local market demand for a {year} {make} {model}.</p>
                </div>

                {/* Big Price Range Gauge (Cartoon Comic Panel) */}
                <div className="bg-black/40 border-[3px] border-black rounded-xl p-6 relative overflow-hidden shadow-[4px_4px_0px_0px_#000]">
                  <span className="text-xs uppercase text-white/50 font-black tracking-widest">Est. Offer Range</span>
                  <div className="text-3xl md:text-4xl font-black text-primary mt-2">
                    ${min.toLocaleString()} – ${max.toLocaleString()}
                  </div>
                  
                  {/* Subtle slider bar visual */}
                  <div className="mt-4 w-full h-1.5 bg-black/40 border border-black rounded-full relative">
                    <div className="absolute h-full bg-primary rounded-full left-1/4 right-1/4" />
                  </div>
                </div>

                <div className="text-left text-white/80 text-xs font-medium leading-relaxed flex flex-col gap-2">
                  <p>✓ Fast, free appraisal review within 1 hour during business hours.</p>
                  <p>✓ We take care of any remaining loan payoff balance.</p>
                  <p>✓ Instant payment check printed right in Murfreesboro.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleProceedToContact}
                    className="w-full bg-primary text-white font-extrabold text-sm border-[3px] border-black rounded-full py-3 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] transition-all duration-200"
                  >
                    Lock in Offer & Request Review
                  </button>
                  <button
                    onClick={() => setStep('details')}
                    className="w-full bg-transparent text-white/60 font-bold text-xs py-2 hover:text-white transition-colors"
                  >
                    ← Edit Vehicle Details
                  </button>
                </div>
              </div>
            )}

            {step === 'contact' && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <h3 className="text-xl font-black text-white">Lock in Your Range</h3>
                  <p className="text-white/70 text-xs mt-1">Provide your details. Stephen and the team will contact you to confirm.</p>
                </div>

                <div className="bg-black/40 border-2 border-black rounded-lg p-3 flex justify-between items-center shadow-[3px_3px_0px_0px_#000]">
                  <div className="text-left">
                    <span className="text-white/50 text-[10px] uppercase font-black">Your Estimate</span>
                    <p className="text-sm font-black text-white">{year} {make} {model}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary text-sm font-black">${min.toLocaleString()} – ${max.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-white/85 text-xs font-bold mb-1" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/85 text-xs font-bold mb-1" htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="e.g. (615) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/85 text-xs font-bold mb-1" htmlFor="email">Email Address (Optional)</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {errorMsg && <p className="text-primary text-xs font-bold">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-primary text-white font-extrabold text-sm border-[3px] border-black rounded-full py-3 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting Offer Request...
                    </>
                  ) : (
                    <>
                      Request Official Valuation
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setStep('valuation')}
                  className="w-full bg-transparent text-white/60 font-bold text-xs py-1 hover:text-white transition-colors disabled:opacity-55"
                >
                  ← Back to Estimate
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="flex flex-col gap-6 text-center py-8">
                <div className="w-16 h-16 bg-primary border-[3px] border-black rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#000]">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">Offer Requested!</h3>
                  <p className="text-white/80 text-sm mt-3 leading-relaxed max-w-sm mx-auto font-medium">
                    Thanks, {name}! Stephen and the team have received your appraisal request. We are reviewing your vehicle's custom evaluation brief and will call you at <strong className="text-white">{phone}</strong> shortly.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setStep('details');
                    setYear('');
                    setMake('');
                    setModel('');
                    setMiles('');
                    setName('');
                    setPhone('');
                    setEmail('');
                  }}
                  className="mt-4 bg-white/10 text-white font-extrabold text-sm border-2 border-black rounded-full py-2.5 px-6 shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0px_0px_#000] transition-all duration-150"
                >
                  Appraise Another Vehicle
                </button>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </section>
  );
}
