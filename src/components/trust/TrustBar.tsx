const STATS = [
  { stat: '33 Years', label: 'Serving Middle Tennessee' },
  { stat: '50+ Vehicles', label: 'In Stock' },
  { stat: '94% Recommend', label: '63 Reviews' },
  { stat: 'In-House', label: 'Financing Available' },
];

export default function TrustBar() {
  return (
    <section className="bg-surface border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-6 overflow-x-auto scrollbar-none py-4 md:justify-center">
          {STATS.map(({ stat, label }, i) => (
            <div
              key={stat}
              className={`flex-none flex flex-col items-center text-center min-w-[120px] md:min-w-0 md:flex-1 px-4
                ${i < STATS.length - 1 ? 'md:border-r md:border-gray-200' : ''}`}
            >
              <span className="text-primary font-bold text-base md:text-lg leading-tight">{stat}</span>
              <span className="text-muted text-xs mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
