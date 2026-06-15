'use client'

import { useActionState } from 'react'
import { submitInquiry, type InquiryState } from '@/app/actions/inquiry'
import { dealer } from '@/config/dealerships/right-price'

const initial: InquiryState = { status: 'idle', message: '' }

const inputClass =
  'w-full bg-black/30 border-2 border-black rounded-lg px-2.5 py-1.5 text-white text-[11px] placeholder:text-white/30 focus:border-primary focus:outline-none transition-colors'

const labelClass = 'block text-white/85 text-[9px] font-bold mb-0.5'

const panelClass =
  'hidden lg:flex absolute right-6 lg:right-12 xl:right-16 top-1/2 -translate-y-1/2 z-20 w-[260px] flex-col bg-secondary border-[3px] border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_#000]'

export default function HeroInquiryForm() {
  const [state, action, pending] = useActionState(submitInquiry, initial)

  if (state.status === 'success') {
    return (
      <div className={`${panelClass} items-center gap-3 py-6 text-center`}>
        <div className="w-11 h-11 rounded-full bg-primary border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-white font-black text-base">We got your message!</p>
          <p className="text-white/70 text-[11px] mt-1.5 leading-relaxed">
            We&apos;ll be in touch shortly. Or call us now:
          </p>
        </div>
        <a
          href={`tel:${dealer.phone.replace(/[^0-9]/g, '')}`}
          className="text-primary font-black text-sm tracking-wide hover:opacity-80 transition-opacity"
        >
          {dealer.phone}
        </a>
      </div>
    )
  }

  return (
    <form action={action} className={`${panelClass} gap-2.5`}>
      <div>
        <p className="text-white font-black text-base leading-tight">
          Start <span className="text-primary">Here</span>
        </p>
        <p className="text-white/70 text-[10px] mt-0.5 leading-snug">
          No credit? Bad credit? Tell us your story.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="hero-name">Full Name</label>
        <input
          id="hero-name"
          type="text"
          name="name"
          placeholder="Enter your name"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="hero-phone">Phone Number</label>
        <input
          id="hero-phone"
          type="tel"
          name="phone"
          placeholder="e.g. (615) 555-0199"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="hero-email">Email (Optional)</label>
        <input
          id="hero-email"
          type="email"
          name="email"
          placeholder="e.g. you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="hero-message">Your Story (Optional)</label>
        <textarea
          id="hero-message"
          name="message"
          placeholder="Tell us what you are looking for..."
          rows={1}
          className={`${inputClass} resize-none`}
        />
      </div>

      {state.status === 'error' && (
        <p className="text-primary text-[11px] font-bold -mt-1">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-white font-extrabold text-xs border-2 border-black rounded-full px-3 py-2 shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0px_0px_#000] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-0.5"
      >
        {pending ? 'Sending...' : 'Send Message'}
        {!pending && (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        )}
      </button>

      <p className="text-white/45 text-[9px] font-medium text-center leading-snug">
        We never share your info. Period.
      </p>
    </form>
  )
}
