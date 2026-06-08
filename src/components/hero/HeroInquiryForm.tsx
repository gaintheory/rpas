'use client'

import { useActionState } from 'react'
import { submitInquiry, type InquiryState } from '@/app/actions/inquiry'
import { dealer } from '@/config/dealerships/right-price'

const initial: InquiryState = { status: 'idle', message: '' }

const inputClass =
  'bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/35 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-colors w-full'

export default function HeroInquiryForm() {
  const [state, action, pending] = useActionState(submitInquiry, initial)

  if (state.status === 'success') {
    return (
      <div className="hidden md:flex absolute right-6 md:right-10 lg:right-16 top-1/2 -translate-y-1/2 z-20 w-[300px] flex-col items-center gap-3 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.45)] text-center">
        <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">We got your message!</p>
          <p className="text-white/55 text-xs mt-1 leading-relaxed">
            We&apos;ll be in touch shortly. Or call us now:
          </p>
        </div>
        <a
          href={`tel:${dealer.phone.replace(/[^0-9]/g, '')}`}
          className="text-primary font-bold text-base tracking-wide hover:opacity-80 transition-opacity"
        >
          {dealer.phone}
        </a>
      </div>
    )
  }

  return (
    <form
      action={action}
      className="hidden md:flex absolute right-6 md:right-10 lg:right-16 top-1/2 -translate-y-1/2 z-20 w-[300px] flex-col gap-3 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
    >
      <div className="mb-0.5">
        <p className="text-white font-semibold text-sm tracking-wide">Start Here</p>
        <p className="text-white/50 text-[11px] mt-0.5 leading-snug">
          No credit? Bad credit? Tell us your story.
        </p>
      </div>

      <input
        type="text"
        name="name"
        placeholder="Your name"
        required
        className={inputClass}
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone number"
        required
        className={inputClass}
      />

      <input
        type="email"
        name="email"
        placeholder="Email address"
        className={inputClass}
      />

      <textarea
        name="message"
        placeholder="What's your situation? (optional)"
        rows={2}
        className={`${inputClass} resize-none`}
      />

      {state.status === 'error' && (
        <p className="text-red-400 text-xs -mt-1">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-white font-semibold text-sm rounded-lg px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 mt-0.5"
      >
        {pending ? 'Sending…' : 'Send Message'}
        {!pending && (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        )}
      </button>

      <p className="text-white/30 text-[10px] text-center leading-snug">
        We never share your info. Period.
      </p>
    </form>
  )
}
