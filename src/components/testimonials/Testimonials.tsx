'use client';

import Image from 'next/image';

const TESTIMONIALS = [
  {
    quote:
      "I walked in so nervous and didn't really know how to buy a vehicle. These guys walked me through step by step and were kind and caring. 1 million percent recommend!!",
    name: 'Tasha Victory',
    photo: '/customers/customer-1.jpg',
  },
  {
    quote:
      "We have bought 3 vehicles from Right Price Auto Sales. Juan, Chad, and Steven have never steered us in a bad vehicle. Thank you. We will see you guys again soon.",
    name: 'Kimberly Mace',
    photo: '/customers/customer-2.jpg',
  },
  {
    quote:
      "Just bought a car from here and would highly recommend. Gavin helped put us in our new vehicle and was super helpful. Thank you Right Price! Will be back!",
    name: 'Sarah Baker',
    photo: '/customers/customer-3.jpg',
  },
];

function Avatar({ name, photo }: { name: string; photo: string }) {
  return (
    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface flex-none">
      <Image
        src={photo}
        alt={name}
        fill
        sizes="48px"
        className="object-cover object-top"
        onError={() => {}}
      />
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-surface py-14 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary">What Our Customers Say</h2>
          <p className="text-muted text-sm mt-2">94% recommend us · 63 Facebook reviews</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, photo }) => (
            <div
              key={name}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {/* Quote */}
              <p className="text-secondary text-sm leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <Avatar name={name} photo={photo} />
                <div>
                  <p className="text-sm font-semibold text-secondary">{name}</p>
                  <p className="text-xs text-muted">Right Price Auto Sales</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Media Links centered under reviews */}
        <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
          <p className="text-secondary text-[10px] font-bold uppercase tracking-widest text-muted/80">Connect with Us</p>
          <div className="flex justify-center items-center gap-6">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors" title="Facebook">
              <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E1306C] transition-colors" title="Instagram">
              <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors" title="TikTok">
              <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.39v7.41c.01 2.37-1.12 4.74-3.21 5.92-2.25 1.27-5.18 1.28-7.44-.01-2.18-1.23-3.32-3.71-3.2-6.19.09-2.28 1.28-4.52 3.33-5.54 1.76-.87 3.82-.93 5.62-.22V5.1c-1.89-.64-3.89-.48-5.63.45-1.95 1.04-3.22 3.09-3.34 5.31-.17 3 .89 6.07 3.23 7.82 2.39 1.79 5.83 1.87 8.3.18 2.34-1.6 3.48-4.56 3.14-7.39-.02-1.83.01-3.67-.02-5.5-.96-.06-1.94-.43-2.73-1.01-.93-.68-1.57-1.74-1.74-2.89-.04-.84-.04-1.68-.04-2.52z" />
              </svg>
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF0000] transition-colors" title="YouTube">
              <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0A66C2] transition-colors" title="LinkedIn">
              <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#4285F4] transition-colors" title="Google">
              <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.13-5.136 4.13A5.85 5.85 0 018.1 12.7a5.85 5.85 0 015.89-5.83 5.75 5.75 0 014.1 1.635l3.1-3.1A9.92 9.92 0 0013.99 2 9.99 9.99 0 004 12a9.99 9.99 0 009.99 10c5.49 0 9.87-3.97 9.87-9.92 0-.61-.06-1.2-.17-1.795H12.24z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
