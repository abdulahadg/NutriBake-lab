import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const PersonalizedRecommendationSection: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <section className="py-14 sm:py-24 lg:py-36 border-t border-[#3A2721]/10 bg-[#FAF5ED]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-8">
        <div className="space-y-4">
          <span className="text-[11px] uppercase tracking-[0.26em] font-semibold text-[#657258] block">
            Personalized Nutrition
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#3A2721] tracking-tight leading-[1.08] break-words">
            Find a bake that <span className="italic font-light text-[#A96345]">fits you</span>.
          </h2>

          <p className="text-sm sm:text-base text-[#29211E]/75 leading-relaxed max-w-xl mx-auto pt-2">
            Every body has distinct metabolic rhythms and fiber targets. Share your dietary goals, activity level, or allergen preferences to discover your ideal bake.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigateTo('recommendations')}
            className="w-full sm:w-auto justify-center group inline-flex items-center gap-2.5 px-8 py-4 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-xs uppercase tracking-[0.16em] font-medium transition-colors"
          >
            <span>Find My Recommendation</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
