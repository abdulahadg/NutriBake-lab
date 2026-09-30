import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const NutritionSection: React.FC = () => {
  const { navigateTo } = useApp();

  const macros = [
    {
      value: '185',
      unit: 'kcal',
      label: 'Energy Density',
      note: 'Sustained metabolic burn from complex carbohydrates'
    },
    {
      value: '7.2',
      unit: 'g',
      label: 'Prebiotic Fiber (RS2)',
      note: '26% daily value from green banana & psyllium'
    },
    {
      value: '5.8',
      unit: 'g',
      label: 'Plant Protein',
      note: 'Whole almond meal and cold-milled seeds'
    },
    {
      value: '3.2',
      unit: 'g',
      label: 'Natural Fruit Sugar',
      note: 'Zero added cane sugars or artificial syrups'
    }
  ];

  return (
    <section className="py-12 sm:py-20 lg:py-32 border-t border-[#3A2721]/10 bg-[#FAF5ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="max-w-3xl space-y-3 mb-10 sm:mb-16 lg:mb-20">
          <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#657258] block">
            Nutritional Transparency
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#3A2721] tracking-tight leading-[1.05] break-words">
            Know what's in <span className="italic">every bite</span>.
          </h2>
          <p className="text-sm sm:text-base text-[#29211E]/75 leading-relaxed pt-2">
            Every recipe is formulated and tested for steady postprandial glycemic impact, robust dietary fiber density, and natural satiety.
          </p>
        </div>

        {/* Editorial Packaging-Style Nutrition Panel */}
        <div className="border-t border-b border-[#3A2721]/20 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {macros.map((macro, idx) => (
              <div 
                key={macro.label} 
                className={`space-y-3 ${idx !== 0 ? 'lg:pl-8 lg:border-l border-[#3A2721]/10' : ''}`}
              >
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#657258] font-semibold block">
                  {macro.label}
                </span>

                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#3A2721] tracking-tight">
                    {macro.value}
                  </span>
                  <span className="font-serif text-base sm:text-xl italic text-[#A96345]">
                    {macro.unit}
                  </span>
                </div>

                <p className="text-xs text-[#29211E]/70 leading-relaxed font-normal">
                  {macro.note}
                </p>
              </div>
            ))}
          </div>

          {/* Minimal Footnote Strip */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#3A2721]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#29211E]/60">
            <span className="tracking-wide">
              Benchmark: Average 85g composite green banana flour bake • Tested laboratory values
            </span>
            <button
              onClick={() => navigateTo('nutrition')}
              className="group inline-flex items-center gap-1.5 text-[#3A2721] hover:text-[#A96345] transition-colors font-medium self-start sm:self-auto uppercase text-[11px] tracking-[0.14em]"
            >
              <span>Explore Complete Nutrition Table</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
