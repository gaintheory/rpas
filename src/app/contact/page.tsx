'use client';

import { useState, useTransition } from 'react';
import { submitContactLead } from '@/app/actions/contact';
import { dealer } from '@/config/dealerships/right-price';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [inquiryType, setInquiryType] = useState('BHPH Financing');
  const [contactMethod, setContactMethod] = useState('Call');
  const [bestTime, setBestTime] = useState('Anytime');
  const [employmentStatus, setEmploymentStatus] = useState('Employed');
  const [vehicleOfInterest, setVehicleOfInterest] = useState('');
  const [downPayment, setDownPayment] = useState('$1,000 - $2,000');
  const [referral, setReferral] = useState('Google Search');
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
    formData.append('bestTime', bestTime);
    formData.append('employmentStatus', employmentStatus);
    formData.append('vehicleOfInterest', vehicleOfInterest);
    formData.append('downPayment', downPayment);
    formData.append('referral', referral);
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
    <div className="pt-24 pb-16 px-4 min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Background ambient radial glows */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 90% 10%, rgba(192, 57, 43, 0.05) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(26, 26, 46, 0.04) 0%, transparent 50%)'
        }}
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest uppercase rounded-full px-4 py-1.5 mb-3">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-secondary uppercase tracking-tight">
            Contact Us
          </h1>
          <p className="text-sm text-muted max-w-md mx-auto mt-2 leading-relaxed">
            Have a question about financing, inventory, or want to schedule a test drive? Drop us a line or visit our lot today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Robust Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border-4 border-black rounded-2xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] relative">
              
              {isSuccess ? (
                <div className="flex flex-col gap-6 text-center py-12">
                  <div className="w-16 h-16 bg-primary border-[3px] border-black rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#000]">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-secondary uppercase tracking-tight">Message Logged!</h3>
                    <p className="text-muted text-sm mt-3 leading-relaxed max-w-sm mx-auto">
                      Thank you, **{name}**! Your contact inquiry has been sent to our sales manager, Stephen Merritt. We will contact you shortly via **{contactMethod}**.
                    </p>
                    <p className="text-primary font-bold text-sm mt-6">
                      For immediate service, call us directly: {dealer.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h2 className="text-xl font-black text-secondary uppercase border-l-4 border-primary pl-3 mb-2">
                    Send a Message
                  </h2>

                  {/* Section: Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-secondary text-xs font-bold mb-1.5" htmlFor="contact-name">Full Name *</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-4 py-2 text-secondary placeholder-gray-400 text-sm focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-secondary text-xs font-bold mb-1.5" htmlFor="contact-phone">Phone Number *</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        placeholder="e.g. (615) 555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-4 py-2 text-secondary placeholder-gray-400 text-sm focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-secondary text-xs font-bold mb-1.5" htmlFor="contact-email">Email (Optional)</label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="e.g. you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-4 py-2 text-secondary placeholder-gray-400 text-sm focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-secondary text-xs font-bold mb-1.5" htmlFor="contact-zip">Zip Code *</label>
                      <input
                        id="contact-zip"
                        type="text"
                        required
                        placeholder="e.g. 37129"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-4 py-2 text-secondary placeholder-gray-400 text-sm focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Section: Inquiry Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-secondary text-xs font-bold mb-1.5" htmlFor="contact-inquiry">Inquiry Type</label>
                      <select
                        id="contact-inquiry"
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-secondary text-sm focus:border-primary focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="BHPH Financing">Buy Here Pay Here</option>
                        <option value="Vehicle Inquiry">Vehicle Inquiry</option>
                        <option value="Schedule Test Drive">Test Drive</option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-secondary text-xs font-bold mb-1.5" htmlFor="contact-method">Preferred Contact</label>
                      <select
                        id="contact-method"
                        value={contactMethod}
                        onChange={(e) => setContactMethod(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-secondary text-sm focus:border-primary focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="Call">Call Me</option>
                        <option value="Text">Text Message</option>
                        <option value="Email">Email Me</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-secondary text-xs font-bold mb-1.5" htmlFor="contact-time">Best Time</label>
                      <select
                        id="contact-time"
                        value={bestTime}
                        onChange={(e) => setBestTime(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-secondary text-sm focus:border-primary focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="Anytime">Anytime</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                      </select>
                    </div>
                  </div>

                  {/* Section: Profile Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-secondary text-xs font-bold mb-1.5" htmlFor="contact-vehicle">Vehicle of Interest</label>
                      <input
                        id="contact-vehicle"
                        type="text"
                        placeholder="e.g. 2015 Ford F-150"
                        value={vehicleOfInterest}
                        onChange={(e) => setVehicleOfInterest(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-4 py-2 text-secondary placeholder-gray-400 text-sm focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-secondary text-xs font-bold mb-1.5" htmlFor="contact-down">Down Payment</label>
                      <select
                        id="contact-down"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-secondary text-sm focus:border-primary focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="No down payment">No down payment</option>
                        <option value="Under $500">Under $500</option>
                        <option value="$500 - $1,000">$500 - $1,000</option>
                        <option value="$1,000 - $2,000">$1,000 - $2,000</option>
                        <option value="$2,000+">$2,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-secondary text-xs font-bold mb-1.5" htmlFor="contact-employment">Employment Status</label>
                      <select
                        id="contact-employment"
                        value={employmentStatus}
                        onChange={(e) => setEmploymentStatus(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-secondary text-sm focus:border-primary focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="Employed">Employed</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="Retired / Disability">Retired / Disability</option>
                        <option value="Unemployed">Unemployed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-secondary text-xs font-bold mb-1.5" htmlFor="contact-referral">How did you hear about us?</label>
                      <select
                        id="contact-referral"
                        value={referral}
                        onChange={(e) => setReferral(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-secondary text-sm focus:border-primary focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="Google Search">Google Search</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Drive-by / Signs">Drive-by / Signs</option>
                        <option value="Friend / Family">Friend / Family</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-secondary text-xs font-bold mb-1.5">Estimated Credit Score</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'excellent', label: 'Excellent (720+)' },
                          { key: 'good', label: 'Good (640-719)' },
                          { key: 'fair', label: 'Fair (580-639)' },
                          { key: 'poor', label: 'Poor (<580)' },
                        ].slice(0, 2).map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setCreditScore(item.key)}
                            className={`py-1.5 text-[10px] font-black rounded-xl border-2 border-black transition-all ${
                              creditScore === item.key
                                ? 'bg-primary text-white shadow-[2px_2px_0px_0px_#000] translate-y-[-1px]'
                                : 'bg-slate-100 text-secondary/70 hover:bg-slate-200'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-end -mt-2.5">
                      <div className="grid grid-cols-2 gap-2 w-full md:w-1/2">
                        {[
                          { key: 'fair', label: 'Fair (580-639)' },
                          { key: 'poor', label: 'Poor (<580)' },
                        ].map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setCreditScore(item.key)}
                            className={`py-1.5 text-[10px] font-black rounded-xl border-2 border-black transition-all ${
                              creditScore === item.key
                                ? 'bg-primary text-white shadow-[2px_2px_0px_0px_#000] translate-y-[-1px]'
                                : 'bg-slate-100 text-secondary/70 hover:bg-slate-200'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section: Message */}
                  <div>
                    <label className="block text-secondary text-xs font-bold mb-1.5" htmlFor="contact-msg">Message or Comments (Optional)</label>
                    <textarea
                      id="contact-msg"
                      rows={3}
                      placeholder="Tell us what you are looking for..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-black rounded-xl px-4 py-2 text-secondary placeholder-gray-400 text-sm focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {errorMsg && <p className="text-primary text-xs font-bold">{errorMsg}</p>}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary text-white font-black text-sm border-[3px] border-black rounded-full py-3 shadow-[4px_4px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0px_0px_#000] transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
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
                        Submit Inquiry to Sales Team
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

          {/* RIGHT COLUMN: Map, Hours, Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Interactive Map Box */}
            <div className="border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#000] bg-white p-3 rotate-[-0.5deg]">
              <div className="relative h-[280px] w-full rounded-xl overflow-hidden border-2 border-black">
                <iframe
                  title="Right Price Auto Sales Google Maps Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3237.9150069418654!2d-86.44280798473926!3d35.85098938015525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8863fbeff9beee7d%3A0xe5e11b3b87c7c0e0!2s5223%20NW%20Broad%20St%2C%20Murfreesboro%2C%20TN%2037129!5e0!3m2!1sen!2sus!4v1655000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              
              <div className="pt-3 pb-1 px-1 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-secondary text-sm uppercase">Our Location</h3>
                  <p className="text-xs text-muted mt-0.5">{dealer.address.full}</p>
                </div>
                <a
                  href={dealer.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-xl px-3 py-1.5 text-xs font-black uppercase hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all"
                >
                  Directions
                </a>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href={`tel:${dealer.phone.replace(/[^0-9]/g, '')}`}
                className="bg-primary text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-4 text-center transform hover:rotate-1 hover:translate-y-[-2px] transition-all"
              >
                <span className="block text-[10px] font-black uppercase tracking-wider text-white/70">Call Sales</span>
                <span className="block font-black text-sm sm:text-base mt-1 tracking-tight">{dealer.phone}</span>
              </a>

              <a
                href={`mailto:${dealer.email}`}
                className="bg-secondary text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-4 text-center transform hover:-rotate-1 hover:translate-y-[-2px] transition-all"
              >
                <span className="block text-[10px] font-black uppercase tracking-wider text-white/50">Email Us</span>
                <span className="block font-black text-xs sm:text-sm mt-1.5 tracking-tight break-all">{dealer.email}</span>
              </a>
            </div>

            {/* Operational Hours Card */}
            <div className="bg-white border-4 border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="text-lg font-black text-secondary uppercase border-l-4 border-primary pl-2.5 mb-3.5">
                Hours of Operation
              </h3>
              <ul className="space-y-2">
                {dealer.hours.map(({ day, hours }) => (
                  <li key={day} className="flex justify-between items-center text-xs border-b border-dashed border-gray-100 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-secondary font-bold">{day}</span>
                    <span className={`font-extrabold ${hours === 'Closed' ? 'text-primary' : 'text-secondary'}`}>
                      {hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
