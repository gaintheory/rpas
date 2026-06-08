'use client';

import { useState, useTransition } from 'react';
import { submitContactLead, type ContactState } from '@/app/actions/contact';
import { dealer } from '@/config/dealerships/right-price';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [inquiryType, setInquiryType] = useState('BHPH Financing');
  const [contactMethod, setContactMethod] = useState('Call');
  const [vehicleOfInterest, setVehicleOfInterest] = useState('');
  const [downPayment, setDownPayment] = useState('$1,000 - $2,000');
  const [creditScore, setCreditScore] = useState('good');
  const [message, setMessage] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !zipCode) {
      setErrorMsg('Name, Phone, and Zip Code are required.');
      return;
    }
    setErrorMsg('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('zipCode', zipCode);
    formData.append('inquiryType', inquiryType);
    formData.append('contactMethod', contactMethod);
    formData.append('vehicleOfInterest', vehicleOfInterest);
    formData.append('downPayment', downPayment);
    formData.append('creditScore', creditScore);
    formData.append('message', message);

    startTransition(async () => {
      const result = await submitContactLead({ status: 'idle', message: '' }, formData);
      if (result.status === 'success') {
        setIsSuccess(true);
      } else {
        setErrorMsg(result.message || 'Something went wrong. Please try again.');
      }
    });
  };

  return (
    <section className="bg-secondary py-10 md:py-16 border-b border-black/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Contact Form (Saves to Supabase) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Header */}
            <div className="mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              <span className="inline-flex items-center gap-2 bg-black/45 border border-white/20 text-white/90 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-full px-3.5 py-1 backdrop-blur-sm mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Contact Sales Team
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                Have a Question? <span className="text-primary">Let&apos;s talk.</span>
              </h2>
              <p className="mt-1.5 text-white/70 text-xs md:text-sm max-w-lg leading-relaxed">
                Stephen Merritt and our sales team will review your info and get back to you shortly.
              </p>
            </div>

            {/* Form Panel */}
            <div className="bg-black/35 border-4 border-black rounded-xl p-4 md:p-6 shadow-[6px_6px_0px_0px_#000] relative">
              {isSuccess ? (
                <div className="flex flex-col gap-6 text-center py-10">
                  <div className="w-16 h-16 bg-primary border-[3px] border-black rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#000]">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Inquiry Sent!</h3>
                    <p className="text-white/80 text-xs mt-3 leading-relaxed max-w-sm mx-auto">
                      Thank you, {name}! Your profile is logged. Stephen will reach out to you shortly via {contactMethod}.
                    </p>
                    <p className="text-primary font-bold text-xs mt-4">
                      Call directly for immediate service: {dealer.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  
                  {/* Basic Contact Info Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/85 text-[11px] font-bold mb-1" htmlFor="contact-name">Full Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-1.5 text-white placeholder-white/30 text-xs focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/85 text-[11px] font-bold mb-1" htmlFor="contact-phone">Phone Number</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        placeholder="e.g. (615) 555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-1.5 text-white placeholder-white/30 text-xs focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/85 text-[11px] font-bold mb-1" htmlFor="contact-email">Email (Optional)</label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="e.g. you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-1.5 text-white placeholder-white/30 text-xs focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/85 text-[11px] font-bold mb-1" htmlFor="contact-zip">Zip Code</label>
                      <input
                        id="contact-zip"
                        type="text"
                        required
                        placeholder="e.g. 37129"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-1.5 text-white placeholder-white/30 text-xs focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Dropdowns Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/85 text-[11px] font-bold mb-1" htmlFor="contact-inquiry">Inquiry Type</label>
                      <select
                        id="contact-inquiry"
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-1.5 text-white text-xs focus:border-primary focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="BHPH Financing" className="bg-secondary text-white">Buy Here Pay Here Financing</option>
                        <option value="Vehicle Inquiry" className="bg-secondary text-white">Inquire about a Vehicle</option>
                        <option value="Schedule Test Drive" className="bg-secondary text-white">Schedule a Test Drive</option>
                        <option value="General Question" className="bg-secondary text-white">General Question</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/85 text-[11px] font-bold mb-1" htmlFor="contact-method">Preferred Contact</label>
                      <select
                        id="contact-method"
                        value={contactMethod}
                        onChange={(e) => setContactMethod(e.target.value)}
                        className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-1.5 text-white text-xs focus:border-primary focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="Call" className="bg-secondary text-white">Call Me</option>
                        <option value="Text" className="bg-secondary text-white">Text Message</option>
                        <option value="Email" className="bg-secondary text-white">Email Me</option>
                      </select>
                    </div>
                  </div>

                  {/* Vehicle of Interest & Down Payment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/85 text-[11px] font-bold mb-1" htmlFor="contact-vehicle">Vehicle of Interest (Optional)</label>
                      <input
                        id="contact-vehicle"
                        type="text"
                        placeholder="e.g. 2015 Ford F-150"
                        value={vehicleOfInterest}
                        onChange={(e) => setVehicleOfInterest(e.target.value)}
                        className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-1.5 text-white placeholder-white/30 text-xs focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/85 text-[11px] font-bold mb-1" htmlFor="contact-down">Down Payment Ready</label>
                      <select
                        id="contact-down"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                        className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-1.5 text-white text-xs focus:border-primary focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="No down payment" className="bg-secondary text-white">No down payment</option>
                        <option value="Under $500" className="bg-secondary text-white">Under $500</option>
                        <option value="$500 - $1,000" className="bg-secondary text-white">$500 - $1,000</option>
                        <option value="$1,000 - $2,000" className="bg-secondary text-white">$1,000 - $2,000</option>
                        <option value="$2,000+" className="bg-secondary text-white">$2,000+</option>
                      </select>
                    </div>
                  </div>

                  {/* Credit Score Selection (Cartoon Buttons) */}
                  <div>
                    <label className="block text-white/85 text-[11px] font-bold mb-1" htmlFor="credit-chips">Estimated Credit Score</label>
                    <div id="credit-chips" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { key: 'excellent', label: 'Excellent (720+)' },
                        { key: 'good', label: 'Good (640-719)' },
                        { key: 'fair', label: 'Fair (580-639)' },
                        { key: 'poor', label: 'Poor (<580)' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setCreditScore(item.key)}
                          className={`py-1.5 px-1 text-[10px] font-black rounded-lg border-2 border-black transition-all ${
                            creditScore === item.key
                              ? 'bg-primary text-white shadow-[2px_2px_0px_0px_#000] translate-y-[-1px]'
                              : 'bg-black/20 text-white/60 hover:bg-black/35 shadow-[1px_1px_0px_0px_#000]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message textarea */}
                  <div>
                    <label className="block text-white/85 text-[11px] font-bold mb-1" htmlFor="contact-msg">Message or Story (Optional)</label>
                    <textarea
                      id="contact-msg"
                      rows={2}
                      placeholder="Tell us what you are looking for..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-black/30 border-2 border-black rounded-lg px-3 py-1.5 text-white placeholder-white/30 text-xs focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {errorMsg && <p className="text-primary text-xs font-bold">{errorMsg}</p>}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary text-white font-extrabold text-sm border-[3px] border-black rounded-full py-2.5 shadow-[4px_4px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0px_0px_#000] transition-all duration-200 mt-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isPending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending Request...
                      </>
                    ) : (
                      <>
                        Send Message to Stephen
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Cartoon Caricature Portrait Board */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="border-4 border-black rounded-2xl overflow-hidden shadow-[10px_10px_0px_0px_#000] rotate-1 bg-secondary max-w-sm w-full mx-auto transform transition-transform hover:rotate-0 duration-300">
              <img
                src="/stephen_cartoon.png"
                alt="Stephen Merritt - Sales Manager"
                className="w-full object-cover h-[320px] sm:h-[380px] bg-[#2e313d]"
              />
              <div className="bg-black text-white p-4 text-center border-t-4 border-black">
                <p className="font-black text-lg text-primary tracking-tight">Stephen Merritt</p>
                <p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-1">Sales Manager</p>
                <div className="w-8 h-px bg-white/20 mx-auto my-3" />
                <p className="text-[10px] text-white/60 font-medium italic">
                  &ldquo;We read your story, not just your score. Let&apos;s find what works for you.&rdquo;
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
