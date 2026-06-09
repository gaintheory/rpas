'use client';

export default function PrintButton({ className, label = 'Print Application' }: { className?: string; label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className={`${className || "px-5 py-1.5 bg-primary text-white hover:opacity-90 rounded text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5"} print:hidden`}
    >
      <svg className="w-4.5 h-4.5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      {label}
    </button>
  );
}
