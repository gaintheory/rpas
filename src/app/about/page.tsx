import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us | Right Price Auto Sales',
  description: 'Serving Murfreesboro and Middle Tennessee since 1993. Learn about our Buy Here Pay Here in-house financing programs and meet our team.',
};

export default function AboutPage() {
  const TEAM = [
    {
      name: 'Steve',
      role: 'Sales Manager',
      image: '/steve.png',
      bio: 'Steve keeps the dealership running smoothly. With decades of experience in custom financing, he works to match every buyer with an in-house payment plan that fits their life.',
      quote: '“We look at the person, not just the paper.”',
      bgClass: 'bg-[#f1c40f]/10',
    },
    {
      name: 'Chad',
      role: 'Sales Representative',
      image: '/chad.png',
      bio: 'Chad is your go-to guy for finding the perfect ride. He takes a low-pressure, friendly approach to sales, making sure you leave with a car you love and a budget you can afford.',
      quote: '“Honesty is the only way we do business.”',
      bgClass: 'bg-[#3498db]/10',
    },
    {
      name: 'Gavin',
      role: 'Sales Representative',
      image: '/gavin.png',
      bio: 'Gavin specializes in matching buyers with the best pre-owned options. Informative and detailed, he makes the inventory browsing and test-driving experience simple and fun.',
      quote: '“Buying a car should be exciting, not stressful.”',
      bgClass: 'bg-[#9b59b6]/10',
    },
    {
      name: 'Josh',
      role: 'Head Mechanic',
      image: '/josh.jpg',
      bio: 'Josh keeps our inventory in top-tier shape. Every vehicle on the lot undergoes his rigorous multi-point mechanical inspection so you can drive away with total peace of mind.',
      quote: '“If it’s not right, we don’t put it on the lot.”',
      bgClass: 'bg-[#2ecc71]/10',
    },
  ];

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Background ambient radial glows */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 10% 20%, rgba(192, 57, 43, 0.05) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(26, 26, 46, 0.04) 0%, transparent 50%)'
        }}
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* SECTION 1: Hero & Storefront */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest uppercase rounded-full px-4 py-1.5 mb-4 max-w-fit">
              Established 1993
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-secondary leading-tight tracking-tight uppercase">
              Over 30 Years of <span className="text-primary">Trusted Service</span>
            </h1>
            <p className="mt-4 text-base text-muted leading-relaxed max-w-xl">
              Right Price Auto Sales has been serving Murfreesboro and the Middle Tennessee community for over three decades. 
              We operate under a simple philosophy: treat people like family, offer clean vehicles, and provide flexible, 
              in-house financing that respects your budget.
            </p>
          </div>
          
          <div className="lg:col-span-6 flex justify-center">
            <div className="border-4 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_#000] rotate-1 bg-white p-2.5 max-w-lg w-full transform hover:rotate-0 transition-transform duration-300">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-black">
                <Image
                  src="/storefront_cartoon.jpg"
                  alt="Right Price Auto Sales Storefront"
                  fill
                  sizes="(max-w-768px) 100vw, 500px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="text-center py-2 text-xs font-bold text-muted uppercase tracking-wider">
                5223 NW Broad St, Murfreesboro, TN
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: History & Narrative */}
        <div className="border-4 border-black rounded-2xl p-6 md:p-8 bg-white shadow-[8px_8px_0px_0px_#000] mb-16">
          <h2 className="text-xl md:text-2xl font-black text-secondary uppercase border-l-4 border-primary pl-3 mb-4">
            Our Story & Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted leading-relaxed">
            <div>
              <p className="mb-4">
                Since our doors opened in 1993, the automotive market has changed drastically, but our dedication to Rutherford County has remained constant. We know that credit problems can happen to anyone due to medical bills, divorce, or layoffs. 
              </p>
              <p>
                That’s why we specialize in **Buy Here, Pay Here (BHPH)** in-house financing. By acting as both the dealer and the bank, we bypass external lenders. This lets us design flexible, custom-tailored down payments and weekly or bi-weekly plans directly with you.
              </p>
            </div>
            <div>
              <p className="mb-4">
                We take immense pride in our A+ rating with the **Better Business Bureau (BBB)**, maintaining accreditation since 2009. We don’t run a high-pressure sales floor. Our team’s mission is to guide you to a reliable, clean vehicle that meets your transport needs without straining your wallet.
              </p>
              <p className="font-bold text-secondary">
                No bank runarounds, no hidden fees, and no pushy tactics—just straightforward deals and reliable pre-owned cars, trucks, and SUVs.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Meet the Team */}
        <div className="mb-10 text-center">
          <span className="text-primary font-black uppercase text-xs tracking-widest">The Right Price Crew</span>
          <h2 className="text-2xl md:text-4xl font-black text-secondary uppercase mt-2">
            Meet the Team
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto mt-1">
            Our experienced team is here to help you get approved, choose your vehicle, and keep you rolling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <div 
              key={member.name}
              className="border-4 border-black rounded-2xl bg-white shadow-[6px_6px_0px_0px_#000] overflow-hidden flex flex-col transform hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-200"
            >
              {/* Image Container with Accent Background */}
              <div className={`relative h-72 border-b-4 border-black flex items-end justify-center ${member.bgClass}`}>
                <div className="relative w-full h-full">
                  <Image
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    fill
                    sizes="(max-w-768px) 100vw, 300px"
                    className="object-contain object-bottom p-2"
                  />
                </div>
              </div>

              {/* Bio & Quote */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-secondary uppercase tracking-tight">{member.name}</h3>
                  <span className="inline-block bg-secondary text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded mt-1">
                    {member.role}
                  </span>
                  <p className="text-xs text-muted mt-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
                
                <div className="mt-5 pt-3 border-t-2 border-dashed border-gray-200">
                  <p className="text-[11px] font-bold italic text-primary leading-snug">
                    {member.quote}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
