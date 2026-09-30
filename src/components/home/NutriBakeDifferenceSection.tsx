import React from 'react';

export const NutriBakeDifferenceSection: React.FC = () => {
  const ingredients = [
    {
      num: '01',
      title: 'Green Banana Flour',
      detail: 'Rich in RS2 prebiotic resistant starch. Ferments slowly in the colon, fostering gut microflora without blood sugar spikes.'
    },
    {
      num: '02',
      title: 'Whole Raw Nuts & Seeds',
      detail: 'Almonds, flax, and chia providing essential plant lipids, subtle crispness, and prolonged natural satiety.'
    },
    {
      num: '03',
      title: 'Defatted Coconut',
      detail: 'Maintains tender crumb moisture and rich organic aroma while naturally balancing dietary fiber density.'
    },
    {
      num: '04',
      title: 'Soluble Prebiotic Fiber',
      detail: 'Chicory root inulin and psyllium husk matrices designed to bridge daily fiber deficiencies seamlessly.'
    }
  ];

  return (
    <section className="py-12 sm:py-20 lg:py-32 border-t border-[#3A2721]/10 bg-[#FAF5ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10 sm:space-y-16 lg:space-y-24">
        {/* Editorial Section Header */}
        <div className="max-w-3xl space-y-3">
          <span className="font-display text-[11px] uppercase tracking-luxury font-semibold text-[#657258] block">
            The Raw Matter
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#3A2721] tracking-tight-title leading-[1.04]">
            What goes into the bake <span className="italic">matters</span>.
          </h2>
          <p className="text-sm sm:text-[15px] text-[#29211E]/80 leading-[1.7] pt-2">
            Every formulation begins with unrefined functional starches, cold-pressed nuts, and prebiotic plant fibers selected to preserve both authentic crumb texture and systemic gut vitality.
          </p>
        </div>

        {/* Magazine-style Asymmetric Ingredient Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Main Visual Composition - Raw Ingredient Photography */}
          <div className="lg:col-span-7">
            <div className="relative aspect-4/3 sm:aspect-16/11 overflow-hidden bg-[#EFE6D8]">
              <img
                src="https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=1400&auto=format&fit=crop"
                alt="Natural raw baking flours, whole almonds, and grains on wooden surface"
                className="w-full h-full object-cover grayscale-[5%] contrast-[1.02] hover:scale-[1.015] transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-5 sm:top-6 sm:left-7">
                <span className="font-mono text-[9.5px] uppercase tracking-luxury text-[#FAF5ED] font-semibold bg-[#3A2721]/85 px-3 py-1 backdrop-blur-xs">
                  Natural Sourcing Matrix
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Ingredient Notes (Clean typographical layout with thin dividing lines) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="divide-y divide-[#3A2721]/10">
              {ingredients.map((item) => (
                <div key={item.num} className="py-6 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs font-semibold text-[#A96345]">
                      {item.num}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#3A2721] font-normal tracking-snug-title">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-[13.5px] text-[#29211E]/75 leading-[1.65] pl-7">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
