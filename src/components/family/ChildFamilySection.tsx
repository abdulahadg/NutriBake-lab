import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Heart, Apple, ShieldCheck, Sun, CheckCircle2, ArrowRight } from 'lucide-react';
import { OfficialLogoIcon } from '../common/ThemeLogo';

export const ChildFamilySection: React.FC = () => {
  const { products, openProductDetail, navigateTo } = useApp();
  const childFriendlyProducts = products.filter(p => p.childFriendly);

  // Interactive Lunchbox Builder State
  const [selectedBake, setSelectedBake] = useState(childFriendlyProducts[0]);
  const [selectedSide, setSelectedSide] = useState('Organic Apple Slices');
  const [selectedDrink, setSelectedDrink] = useState('Cold Oat Milk');

  const sideOptions = [
    { name: 'Organic Apple Slices', fiber: '+2.4g fiber', benefit: 'Natural pectin' },
    { name: 'Roasted Almond Pack', fiber: '+3.0g fiber', benefit: 'Vitamin E & healthy fats' },
    { name: 'Baby Carrots & Hummus', fiber: '+3.2g fiber', benefit: 'Beta-carotene' },
  ];

  const drinkOptions = [
    { name: 'Cold Oat Milk', calories: '90 kcal', benefit: 'Beta-glucan fortified' },
    { name: 'Fresh Coconut Water', calories: '45 kcal', benefit: 'Natural electrolytes' },
    { name: 'Pure Water with Mint', calories: '0 kcal', benefit: 'Optimal hydration' },
  ];

  return (
    <div className="py-8 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-10 sm:space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="font-display text-[11px] uppercase tracking-luxury font-semibold text-[#657258] block">
          Pediatric & Family Formulation
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#3A2721] tracking-tight-title leading-[1.04] break-words">
          Smarter choices for <span className="italic">growing bodies</span>.
        </h1>
        <p className="text-sm sm:text-[15px] text-[#29211E]/80 leading-[1.7] pt-1">
          Children love bakery snacks. NutriBake empowers parents with wholesome confectionery formulations where green banana flour seamlessly integrates resistant starch and fiber without compromising golden bakery flavor.
        </p>
      </div>

      {/* 4 Pillars for Kids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            title: 'School Lunchbox Ready',
            desc: 'Sturdy, mess-free portions that remain moist and fresh throughout the school day.',
            num: '01',
            tag: 'Stability'
          },
          {
            title: 'No Refined Corn Syrups',
            desc: 'Sweetened exclusively with whole banana flour, unrefined date purees, or coconut sugar.',
            num: '02',
            tag: 'Clean Index'
          },
          {
            title: 'Digestive Comfort',
            desc: 'Prebiotic resistant starch feeds friendly intestinal bacteria without causing bloating.',
            num: '03',
            tag: 'Gut Flora'
          },
          {
            title: 'Sustained Classroom Focus',
            desc: 'Low-glycemic index prevents the mid-morning sugar spike and afternoon fatigue crash.',
            num: '04',
            tag: 'Glycemic Curve'
          }
        ].map((pillar) => (
          <div key={pillar.num} className="p-6 bg-[#FAF5ED] border border-[#3A2721]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-[#A96345]">{pillar.num}</span>
              <span className="font-mono text-[9px] uppercase tracking-editorial text-[#657258] font-semibold">{pillar.tag}</span>
            </div>
            <h3 className="font-serif text-lg font-normal text-[#3A2721]">{pillar.title}</h3>
            <p className="text-xs sm:text-[13px] text-[#29211E]/75 leading-[1.6]">{pillar.desc}</p>
          </div>
        ))}
      </div>

      {/* Child-Friendly Formulations Grid */}
      <div className="space-y-8 border-t border-[#3A2721]/15 pt-12">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <span className="font-display text-[10.5px] uppercase tracking-luxury font-semibold text-[#657258] block">
              Curated Profiles
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3A2721] tracking-snug-title">
              Parent-Approved Formulations
            </h2>
          </div>
          <button
            onClick={() => navigateTo('products')}
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-editorial font-semibold text-[#3A2721] hover:text-[#A96345] transition-colors self-start sm:self-auto"
          >
            <span>View All Formulations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {childFriendlyProducts.map((p) => (
            <div
              key={p.id}
              className="bg-[#FAF5ED] border border-[#3A2721]/15 p-6 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                <div className="relative aspect-4/3 overflow-hidden bg-[#EFE6D8]">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-[#FAF5ED]/95 backdrop-blur-xs border border-[#3A2721]/15 shadow-xs">
                    <div className="w-3.5 h-3.5 shrink-0">
                      <OfficialLogoIcon className="w-full h-full object-contain" strokeWidth={5.5} />
                    </div>
                    <span className="font-display text-[8px] uppercase tracking-luxury font-bold text-[#3A2721]">
                      NutriBake
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#657258] text-[#FAF5ED] font-mono text-[8.5px] font-semibold uppercase tracking-editorial">
                    Kid Friendly
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-normal text-[#3A2721]">{p.name}</h3>
                  <p className="text-xs sm:text-[13px] text-[#29211E]/75 line-clamp-2 leading-[1.6]">{p.description}</p>
                </div>

                {/* Parent Quick Stats */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-[#EFE6D8]/60 border border-[#3A2721]/10 text-center font-tabular">
                  <div>
                    <span className="font-mono text-[9px] text-[#29211E]/60 uppercase tracking-editorial block font-medium">Fiber</span>
                    <span className="font-mono font-bold text-xs text-[#657258]">+{p.nutrition.dietaryFiberGrams}g</span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#29211E]/60 uppercase tracking-editorial block font-medium">Sugar</span>
                    <span className="font-mono font-bold text-xs text-[#A96345]">{p.nutrition.sugarsGrams}g</span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#29211E]/60 uppercase tracking-editorial block font-medium">Acceptance</span>
                    <span className="font-mono font-bold text-xs text-[#3A2721]">{p.sensoryScores.overall}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openProductDetail(p.id)}
                className="w-full py-3 px-4 bg-[#3A2721] hover:bg-[#251814] text-[#FAF5ED] font-semibold text-[10.5px] uppercase tracking-editorial transition-colors flex items-center justify-center gap-2"
              >
                <span>Inspect Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Lunchbox Combo Builder */}
      <div className="bg-[#FAF5ED] p-4 sm:p-8 lg:p-12 border border-[#3A2721]/20 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-luxury text-[#A96345] block">
            Nutritional Modeling
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3A2721] tracking-snug-title">
            The NutriBake Healthy Lunchbox Builder
          </h2>
          <p className="text-xs sm:text-[14px] text-[#29211E]/80 leading-[1.65]">
            Combine a functional bakery treat with whole fruit sides and hydration for an optimal midday nutrient profile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Pick Bake */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] font-semibold text-[#3A2721] uppercase tracking-editorial block">
                1. Select Functional Bakery Item:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {childFriendlyProducts.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBake(b)}
                    className={`p-3 text-left border transition-all text-xs ${
                      selectedBake.id === b.id
                        ? 'bg-[#3A2721] text-[#FAF5ED] border-[#3A2721]'
                        : 'bg-white border-[#3A2721]/15 text-[#29211E] hover:border-[#3A2721]'
                    }`}
                  >
                    <span className="block font-medium truncate">{b.name}</span>
                    <span className={`font-mono text-[10px] block mt-0.5 ${selectedBake.id === b.id ? 'text-[#FAF5ED]/80' : 'text-[#657258]'}`}>
                      +{b.nutrition.dietaryFiberGrams}g fiber
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Pick Whole Side */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] font-semibold text-[#3A2721] uppercase tracking-editorial block">
                2. Select Fresh Side:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {sideOptions.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSide(s.name)}
                    className={`p-3 text-left border transition-all text-xs ${
                      selectedSide === s.name
                        ? 'bg-[#3A2721] text-[#FAF5ED] border-[#3A2721]'
                        : 'bg-white border-[#3A2721]/15 text-[#29211E] hover:border-[#3A2721]'
                    }`}
                  >
                    <span className="block font-medium truncate">{s.name}</span>
                    <span className={`font-mono text-[10px] block mt-0.5 ${selectedSide === s.name ? 'text-[#FAF5ED]/80' : 'text-[#657258]'}`}>
                      {s.fiber}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Pick Hydration */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] font-semibold text-[#3A2721] uppercase tracking-editorial block">
                3. Select Hydration:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {drinkOptions.map((d) => (
                  <button
                    key={d.name}
                    onClick={() => setSelectedDrink(d.name)}
                    className={`p-3 text-left border transition-all text-xs ${
                      selectedDrink === d.name
                        ? 'bg-[#3A2721] text-[#FAF5ED] border-[#3A2721]'
                        : 'bg-white border-[#3A2721]/15 text-[#29211E] hover:border-[#3A2721]'
                    }`}
                  >
                    <span className="block font-medium truncate">{d.name}</span>
                    <span className={`font-mono text-[10px] block mt-0.5 ${selectedDrink === d.name ? 'text-[#FAF5ED]/80' : 'text-[#29211E]/60'}`}>
                      {d.benefit}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lunchbox Preview Summary Card */}
          <div className="lg:col-span-5 bg-[#EFE6D8]/60 p-6 border border-[#3A2721]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-[#3A2721]/15 pb-3">
              <h3 className="font-serif text-lg font-normal text-[#3A2721]">
                Assembled Lunchbox Profile
              </h3>
              <span className="font-mono text-[9px] uppercase tracking-editorial px-2 py-0.5 bg-[#657258] text-[#FAF5ED] font-semibold">
                Balanced
              </span>
            </div>

            <div className="space-y-2 text-xs font-tabular">
              <div className="flex justify-between items-center p-2.5 bg-white border border-[#3A2721]/10">
                <span className="font-mono text-[10px] uppercase tracking-editorial font-semibold text-[#3A2721]">Bakery Main</span>
                <span className="font-medium text-[#29211E]">{selectedBake.name}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-white border border-[#3A2721]/10">
                <span className="font-mono text-[10px] uppercase tracking-editorial font-semibold text-[#3A2721]">Whole Side</span>
                <span className="font-medium text-[#29211E]">{selectedSide}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-white border border-[#3A2721]/10">
                <span className="font-mono text-[10px] uppercase tracking-editorial font-semibold text-[#3A2721]">Hydration</span>
                <span className="font-medium text-[#29211E]">{selectedDrink}</span>
              </div>
            </div>

            {/* Estimated Combined Lunchbox Fiber */}
            <div className="p-4 bg-[#FAF5ED] border border-[#657258]/30 space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs font-mono font-bold text-[#657258]">
                <span>Total Lunchbox Fiber:</span>
                <span>~{(selectedBake.nutrition.dietaryFiberGrams + 2.8).toFixed(1)}g (35%+ Daily Target)</span>
              </div>
              <p className="text-[12px] text-[#29211E]/75 leading-relaxed">
                Protects child digestive flora and sustains concentration throughout school afternoons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
