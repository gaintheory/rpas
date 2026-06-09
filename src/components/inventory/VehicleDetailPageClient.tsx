'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type Vehicle, normalizeDrivetrain } from '@/lib/vehicle';
import { getWeeklyPayment } from '@/lib/payments';
import { dealer } from '@/config/dealerships/right-price';
import { submitInquiry, type InquiryState } from '@/app/actions/inquiry';

export default function VehicleDetailPageClient({ vehicle }: { vehicle: Vehicle }) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [inquiryStatus, setInquiryStatus] = useState<InquiryState>({ status: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const photos = vehicle.photo_urls ?? [];
  const weeklyPayment = getWeeklyPayment(vehicle.price);
  const drivetrain = normalizeDrivetrain(vehicle.drivetrain);
  const miles = parseFloat(vehicle.miles ?? '0');

  const specsList = [
    {
      label: 'Mileage',
      value: miles > 0 ? `${miles.toLocaleString()} mi` : '—',
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
    },
    {
      label: 'Transmission',
      value: vehicle.transmission ?? '—',
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
    {
      label: 'Drivetrain',
      value: drivetrain ?? '—',
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Engine',
      value: vehicle.engine ?? '—',
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: 'Fuel Type',
      value: vehicle.fuel_type ?? '—',
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
  ];

  async function handleInquirySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setInquiryStatus({ status: 'idle', message: '' });

    const formData = new FormData(e.currentTarget);
    try {
      const res = await submitInquiry({ status: 'idle', message: '' }, formData);
      setInquiryStatus(res);
      if (res.status === 'success') {
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setInquiryStatus({
        status: 'error',
        message: 'Unable to submit your message right now. Please call us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const applyUrl = `${dealer.creditAppUrl}?vin=${vehicle.vin}`;
  const callUrl = `tel:${dealer.phone.replace(/[^0-9]/g, '')}`;
  const emailUrl = `mailto:${dealer.email}?subject=${encodeURIComponent(`Interest in ${vehicle.year} ${vehicle.make} ${vehicle.model} (VIN: ${vehicle.vin})`)}`;

  return (
    <div className="min-h-screen bg-white text-secondary pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/inventory" className="hover:text-primary transition-colors">Inventory</Link>
          <span>/</span>
          <span className="text-gray-900 truncate">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </span>
        </nav>

        {/* Header Title */}
        <div className="border-b border-gray-100 pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary tracking-tight">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-widest text-gray-400 mt-2 uppercase">
            <span>{miles > 0 ? `${miles.toLocaleString()} Miles` : '—'}</span>
            <span className="text-gray-300">·</span>
            <span>VIN: {vehicle.vin}</span>
            {vehicle.stock_number && (
              <>
                <span className="text-gray-300">·</span>
                <span>STOCK: {vehicle.stock_number}</span>
              </>
            )}
          </div>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left Columns (Gallery + Details) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery Carousel */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {photos.length > 0 ? (
                <div className="space-y-4 p-3">
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black">
                    <Image
                      src={photos[activePhotoIdx]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 800px"
                      priority
                    />
                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={() => setActivePhotoIdx((i) => (i - 1 + photos.length) % photos.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-secondary hover:text-primary w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => setActivePhotoIdx((i) => (i + 1) % photos.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-secondary hover:text-primary w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all"
                        >
                          ›
                        </button>
                        <span className="absolute bottom-4 right-4 bg-black/75 text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wider">
                          {activePhotoIdx + 1} / {photos.length}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Thumbnails Row */}
                  {photos.length > 1 && (
                    <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1.5 scrollbar-thin">
                      {photos.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`relative w-20 h-15 aspect-[4/3] rounded-lg overflow-hidden flex-none border-2 transition-all
                            ${activePhotoIdx === idx ? 'border-primary scale-95' : 'border-transparent hover:border-gray-300'}`}
                        >
                          <Image
                            src={url}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gray-100 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="font-semibold text-lg text-secondary">Photos Coming Soon</p>
                  <p className="text-sm text-gray-400 max-w-sm mt-1">
                    This {vehicle.year} {vehicle.make} is ready for sale and currently undergoing our detailing process. Check back soon for photos!
                  </p>
                </div>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {specsList.map(({ label, value, icon }) => (
                <div key={label} className="border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center bg-gray-50/50 shadow-sm">
                  <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 mb-2">{icon}</div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                  <span className="text-sm font-bold text-secondary mt-1 max-w-full truncate">{value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-extrabold text-secondary tracking-tight mb-4">About this vehicle</h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-4 whitespace-pre-line font-medium">
                {vehicle.website_copy || vehicle.description || (
                  <p className="italic text-gray-400">
                    No marketing description is currently available for this vehicle. Please contact our team for detail specifications and check lists.
                  </p>
                )}
              </div>
            </div>

            {/* Detailed Specs Table */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-extrabold text-secondary tracking-tight mb-4">Detailed Specifications</h2>
              <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-white">
                  
                  <div className="divide-y divide-gray-100">
                    <div className="flex justify-between p-4 text-sm"><span className="text-gray-400 font-medium">Year</span><span className="font-bold text-secondary">{vehicle.year}</span></div>
                    <div className="flex justify-between p-4 text-sm"><span className="text-gray-400 font-medium">Make</span><span className="font-bold text-secondary">{vehicle.make}</span></div>
                    <div className="flex justify-between p-4 text-sm"><span className="text-gray-400 font-medium">Model</span><span className="font-bold text-secondary">{vehicle.model}</span></div>
                    <div className="flex justify-between p-4 text-sm"><span className="text-gray-400 font-medium">Trim</span><span className="font-bold text-secondary">{vehicle.trim || '—'}</span></div>
                    <div className="flex justify-between p-4 text-sm"><span className="text-gray-400 font-medium">Body Style</span><span className="font-bold text-secondary truncate max-w-[60%]">{vehicle.body || '—'}</span></div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <div className="flex justify-between p-4 text-sm"><span className="text-gray-400 font-medium">Mileage</span><span className="font-bold text-secondary">{miles > 0 ? `${miles.toLocaleString()} mi` : '—'}</span></div>
                    <div className="flex justify-between p-4 text-sm"><span className="text-gray-400 font-medium">Transmission</span><span className="font-bold text-secondary">{vehicle.transmission || '—'}</span></div>
                    <div className="flex justify-between p-4 text-sm"><span className="text-gray-400 font-medium">Drivetrain</span><span className="font-bold text-secondary">{drivetrain || '—'}</span></div>
                    <div className="flex justify-between p-4 text-sm"><span className="text-gray-400 font-medium">Exterior Color</span><span className="font-bold text-secondary">{vehicle.color || vehicle.exterior_color || '—'}</span></div>
                    <div className="flex justify-between p-4 text-sm"><span className="text-gray-400 font-medium">Interior Color</span><span className="font-bold text-secondary">{vehicle.interior_color || '—'}</span></div>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Pricing & Lead capture) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-gray-100 rounded-2xl p-6 shadow-md space-y-6">
              
              {/* Pricing Panel */}
              <div>
                <p className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase">Cash Price</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-secondary">${vehicle.price.toLocaleString()}</span>
                </div>
                {weeklyPayment && (
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mt-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-xs font-bold text-primary">Est. ${weeklyPayment} / week</span>
                  </div>
                )}
              </div>

              {/* Dealership Trust points */}
              <div className="border-t border-b border-gray-100 py-4 space-y-2.5">
                {[
                  '3-Month / 3,000-Mile Warranty Included',
                  'Zero Dealer Doc Fees (Save $500+)',
                  'BHPH / In-house Financing Available',
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                    <svg className="w-4 h-4 text-emerald-500 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Primary Call-to-Actions */}
              <div className="space-y-3">
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center font-bold text-sm bg-primary text-white py-3 px-4 rounded-xl hover:opacity-90 transition-opacity shadow-md text-center"
                >
                  Apply for Financing
                </a>
                <a
                  href={callUrl}
                  className="w-full flex items-center justify-center font-bold text-sm border border-secondary text-secondary hover:bg-secondary hover:text-white py-3 px-4 rounded-xl transition-colors text-center"
                >
                  Call Us: {dealer.phone}
                </a>
              </div>

              {/* Lead/Inquiry Form */}
              <div className="border-t border-gray-100 pt-6">
                <p className="font-bold text-sm text-secondary mb-3">Ask about this vehicle</p>
                
                {inquiryStatus.status === 'success' ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                    <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-emerald-800 font-bold text-sm">Message Sent!</p>
                    <p className="text-emerald-600 text-xs mt-1">Our sales team will follow up with you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    {inquiryStatus.status === 'error' && (
                      <div className="bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-lg">
                        {inquiryStatus.message}
                      </div>
                    )}
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      required
                      className="w-full text-xs border border-gray-200 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-gray-800"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone Number"
                      required
                      className="w-full text-xs border border-gray-200 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-gray-800"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email Address (Optional)"
                      className="w-full text-xs border border-gray-200 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-gray-800"
                    />
                    <textarea
                      name="message"
                      rows={3}
                      defaultValue={`Hello, I am interested in this ${vehicle.year} ${vehicle.make} ${vehicle.model} (Stock# ${vehicle.stock_number || 'N/A'}). Please check availability for me.`}
                      className="w-full text-xs border border-gray-200 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-gray-800 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full font-bold text-xs bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-white py-3 px-4 rounded-xl transition-colors"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
