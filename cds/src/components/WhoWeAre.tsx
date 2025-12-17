import { Sun } from 'lucide-react';

export default function WhoWeAre() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 text-center">
        {/* Ornate Icon Placeholder - Using Sun to match theme */}
        <div className="flex justify-center mb-8">
           <div className="relative p-2">
             <Sun className="w-16 h-16 text-[#d4af37]" strokeWidth={1} />
           </div>
        </div>

        <h2 className="text-2xl md:text-3xl tracking-[0.15em] font-normal text-gray-900 mb-8 uppercase font-sans">
          Who We Are
        </h2>

        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] md:text-[13px] leading-[2.2] md:leading-[2.4] tracking-wider text-gray-600 font-medium uppercase text-justify md:text-center">
            Our products exhibit a diversification of cultures much like our customers whose <span className="font-bold text-gray-900">LOYALTY</span> is not just an asset from our patrons but also a value towards our customers. Our faith in them is as unwavering as their towards us. In the last few years we have made a powerful and dominant place for ourselves by creating designs for people of diverse cultures and tastes thereby improving every day the versatility of our catalog. The <span className="font-bold text-gray-900">EXCLUSIVITY</span> of designs for those who wish for it is a promise that gets stronger with each coming year.
          </p>
        </div>

        <div className="mt-10 md:mt-14">
            <button className="group inline-flex flex-col items-center">
                <span className="text-xs font-bold tracking-[0.2em] text-[#003057] uppercase mb-2">Know More</span>
                <span className="h-[2px] w-8 bg-[#d4af37] group-hover:w-full transition-all duration-300"></span>
            </button>
        </div>
      </div>
    </section>
  );
}
