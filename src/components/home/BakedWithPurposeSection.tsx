import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';
import { OfficialLogoIcon } from '../common/ThemeLogo';

export const BakedWithPurposeSection: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <section className="py-12 sm:py-20 lg:py-32 border-t border-[#3A2721]/10 bg-[#FAF5ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Editorial Image Left */}
          <div className="lg:col-span-6">
            <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-[#EFE6D8]">
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop"
                alt="Flour preparation, baker hands and natural artisan craftsmanship"
                className="w-full h-full object-cover grayscale-[4%] contrast-[1.02] hover:scale-[1.015] transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              {/* Official NutriBake Insignia Stamp */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1.5 bg-[#FAF5ED]/95 backdrop-blur-xs border border-[#3A2721]/20 shadow-xs">
                <div className="w-4 h-4 shrink-0">
                  <OfficialLogoIcon className="w-full h-full object-contain" strokeWidth={5.5} />
                </div>
                <span className="font-display text-[8.5px] uppercase tracking-luxury font-bold text-[#3A2721]">
                  NutriBake Craft
                </span>
              </div>
              <div className="absolute bottom-4 left-5 text-[#FAF5ED]/90">
                <span className="font-mono text-[9px] uppercase tracking-luxury font-semibold bg-[#3A2721]/80 px-2.5 py-1 block backdrop-blur-xs">
                  Studio Craft & Formulation
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Right */}
          <div className="lg:col-span-6 space-y-6">
            <span className="font-display text-[11px] uppercase tracking-luxury font-semibold text-[#657258] block">
              The Philosophy
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#3A2721] tracking-tight-title leading-[1.06]">
              Traditional comfort.<br />
              <span className="italic font-light text-[#A96345]">Thoughtfully reimagined.</span>
            </h2>

            <div className="space-y-4 text-sm sm:text-[15px] text-[#29211E]/80 leading-[1.7] font-normal">
              <p>
                NutriBake explores functional bakery products using ingredients such as banana flour, nuts, coconut and fiber-enhancing ingredients while focusing on taste, texture, aroma and appearance.
              </p>
              <p>
                We believe health-conscious eating should never feel like an austerity measure. Through careful food chemistry and thermal testing, we retain the warmth, delicate chew, and comforting aroma of authentic bakery craft.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('about')}
                className="group inline-flex items-center gap-2 text-[11.5px] uppercase tracking-editorial font-semibold text-[#3A2721] hover:text-[#A96345] transition-colors"
              >
                <span>Read our story & research</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
