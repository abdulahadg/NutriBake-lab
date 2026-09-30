import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecommendationAnswers, RecommendationMatch } from '../../types';
import { ArrowRight, ArrowLeft, Check, Heart, RotateCcw, CheckCircle2 } from 'lucide-react';

export const RecommendationWizard: React.FC = () => {
  const { products, openProductDetail, toggleSaveProduct, isProductSaved, recommendationResults, setRecommendationResults } = useApp();

  const [step, setStep] = useState<number>(recommendationResults ? 4 : 1);

  const [answers, setAnswers] = useState<RecommendationAnswers>({
    ageGroup: 'adult',
    activityLevel: 'moderate',
    dietaryPreference: 'vegetarian',
    primaryGoal: 'higher-fiber',
    preferences: ['low-sugar', 'banana-flour'],
    allergenRestrictions: []
  });

  const togglePreference = (pref: string) => {
    setAnswers(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  const toggleAllergen = (allergen: string) => {
    setAnswers(prev => ({
      ...prev,
      allergenRestrictions: prev.allergenRestrictions.includes(allergen)
        ? prev.allergenRestrictions.filter(a => a !== allergen)
        : [...prev.allergenRestrictions, allergen]
    }));
  };

  const generateRecommendations = () => {
    const scoredProducts: RecommendationMatch[] = products
      .filter(p => {
        if (answers.allergenRestrictions.includes('nuts') && p.allergens.some(a => a.toLowerCase().includes('nut'))) {
          return false;
        }
        if (answers.allergenRestrictions.includes('gluten') && p.allergens.some(a => a.toLowerCase().includes('gluten') || a.toLowerCase().includes('wheat'))) {
          return false;
        }
        if (answers.allergenRestrictions.includes('dairy') && p.allergens.some(a => a.toLowerCase().includes('dairy') || a.toLowerCase().includes('yogurt'))) {
          return false;
        }
        if (answers.allergenRestrictions.includes('eggs') && p.allergens.some(a => a.toLowerCase().includes('egg'))) {
          return false;
        }
        return true;
      })
      .map(p => {
        let score = 75;

        if (answers.primaryGoal === 'higher-fiber' && p.nutrition.dietaryFiberGrams >= 5.5) {
          score += 15;
        }
        if (answers.activityLevel === 'active' && p.category === 'bars') {
          score += 12;
        }
        if (answers.preferences.includes('low-sugar') && p.nutrition.sugarsGrams <= 4.5) {
          score += 8;
        }
        if (answers.preferences.includes('banana-flour') && p.mainFunctionalIngredient.toLowerCase().includes('banana')) {
          score += 8;
        }
        if (answers.dietaryPreference === 'vegetarian' && p.dietaryTags.includes('Vegetarian')) {
          score += 5;
        }
        if (answers.primaryGoal === 'family-friendly' && p.childFriendly) {
          score += 10;
        }

        const finalScore = Math.min(Math.round(score), 98);

        return {
          product: p,
          matchScore: finalScore,
          reasons: {
            nutritionMatch: `Delivers ${p.nutrition.dietaryFiberGrams}g fiber to support your daily wellness target.`,
            ingredientMatch: `Crafted with ${p.mainFunctionalIngredient} and wholesome natural ingredients.`,
            preferenceMatch: `Aligns with your ${answers.dietaryPreference} preference.`
          }
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    setRecommendationResults(scoredProducts);
    setStep(4);
  };

  const handleReset = () => {
    setRecommendationResults(null);
    setStep(1);
  };

  return (
    <div className="py-8 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-4xl mx-auto space-y-8 sm:space-y-12">
      {/* Editorial Header */}
      <div className="max-w-2xl space-y-3">
        <span className="font-display text-[11px] uppercase tracking-luxury font-semibold text-[#657258] block">
          Personalized Formulation
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#3A2721] tracking-tight-title leading-[1.04] break-words">
          Find a bake that <span className="italic">fits you</span>.
        </h1>
        <p className="text-sm sm:text-[15px] text-[#29211E]/80 leading-[1.7] pt-1">
          Share your daily activity level, fiber goals, and dietary preferences to discover your personalized formulation.
        </p>
      </div>

      {/* Step Indicator (Minimal Hairline) */}
      <div className="border-t border-b border-[#3A2721]/15 py-3 sm:py-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between font-mono text-[9.5px] sm:text-[10px] uppercase tracking-editorial text-[#3A2721] min-w-[280px] gap-2">
          <span className={step === 1 ? 'font-bold text-[#A96345]' : 'text-[#29211E]/50'}>
            01 • Profile
          </span>
          <span className={step === 2 ? 'font-bold text-[#A96345]' : 'text-[#29211E]/50'}>
            02 • Preferences
          </span>
          <span className={step === 3 ? 'font-bold text-[#A96345]' : 'text-[#29211E]/50'}>
            03 • Focus
          </span>
          <span className={step === 4 ? 'font-bold text-[#657258]' : 'text-[#29211E]/50'}>
            04 • Selection
          </span>
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-10">
        {/* STEP 1: About You */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Age Range */}
            <div className="space-y-3">
              <label className="font-mono text-[10.5px] uppercase tracking-editorial font-semibold text-[#3A2721] block">
                Age Range
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'teen', label: '13 – 19' },
                  { id: 'young-adult', label: '20 – 35' },
                  { id: 'adult', label: '36 – 55' },
                  { id: 'senior', label: '55+' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAnswers({ ...answers, ageGroup: item.id as any })}
                    className={`py-3 px-4 text-xs font-mono uppercase tracking-editorial transition-colors border ${
                      answers.ageGroup === item.id
                        ? 'bg-[#3A2721] text-[#FAF5ED] border-[#3A2721] font-semibold'
                        : 'bg-transparent border-[#3A2721]/20 text-[#29211E] hover:border-[#3A2721]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Activity */}
            <div className="space-y-3">
              <label className="font-mono text-[10.5px] uppercase tracking-editorial font-semibold text-[#3A2721] block">
                Daily Activity Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'sedentary', label: 'Light / Desk-bound', desc: 'Low-sugar snacking with steady energy.' },
                  { id: 'moderate', label: 'Moderate Exercise', desc: 'Balanced nutrition with prebiotic fiber.' },
                  { id: 'active', label: 'High Energy / Athletic', desc: 'Higher plant proteins and nutrient density.' },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setAnswers({ ...answers, activityLevel: act.id as any })}
                    className={`p-5 text-left border transition-colors ${
                      answers.activityLevel === act.id
                        ? 'border-[#3A2721] bg-[#3A2721]/5 ring-1 ring-[#3A2721]'
                        : 'border-[#3A2721]/15 hover:border-[#3A2721]/40'
                    }`}
                  >
                    <span className="font-serif text-lg text-[#3A2721] block">{act.label}</span>
                    <span className="text-xs sm:text-[13px] text-[#29211E]/75 mt-1 block leading-[1.6]">{act.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-7 py-3.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-[11px] font-mono uppercase tracking-editorial font-semibold transition-colors flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Preferences & Allergens */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="space-y-3">
              <label className="font-mono text-[10.5px] uppercase tracking-editorial font-semibold text-[#3A2721] block">
                Dietary Framework
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'standard', label: 'Omnivore' },
                  { id: 'vegetarian', label: 'Vegetarian' },
                  { id: 'plant-forward', label: 'Plant-Forward' },
                  { id: 'gut-sensitive', label: 'Gut Sensitive' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setAnswers({ ...answers, dietaryPreference: d.id as any })}
                    className={`py-3 px-4 text-xs font-mono uppercase tracking-editorial transition-colors border ${
                      answers.dietaryPreference === d.id
                        ? 'bg-[#3A2721] text-[#FAF5ED] border-[#3A2721] font-semibold'
                        : 'bg-transparent border-[#3A2721]/20 text-[#29211E] hover:border-[#3A2721]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-mono text-[10.5px] uppercase tracking-editorial font-semibold text-[#3A2721] block">
                Exclude Allergens
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'nuts', label: 'Tree Nuts' },
                  { id: 'gluten', label: 'Gluten / Wheat' },
                  { id: 'dairy', label: 'Dairy' },
                  { id: 'eggs', label: 'Eggs' },
                ].map((alg) => {
                  const isExcluded = answers.allergenRestrictions.includes(alg.id);
                  return (
                    <button
                      key={alg.id}
                      onClick={() => toggleAllergen(alg.id)}
                      className={`py-2.5 px-3 text-xs font-mono uppercase tracking-editorial transition-colors border ${
                        isExcluded
                          ? 'bg-[#A96345] text-[#FAF5ED] border-[#A96345] font-semibold'
                          : 'bg-transparent border-[#3A2721]/20 text-[#29211E] hover:border-[#3A2721]'
                      }`}
                    >
                      {alg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="group inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-editorial text-[#3A2721] hover:text-[#A96345]"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-7 py-3.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-[11px] font-mono uppercase tracking-editorial font-semibold transition-colors flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Primary Wellness Goal */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="space-y-3">
              <label className="font-mono text-[10.5px] uppercase tracking-editorial font-semibold text-[#3A2721] block">
                Primary Nutritional Focus
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'higher-fiber',
                    title: 'Prebiotic Gut Health & Fiber',
                    desc: 'Maximize RS2 resistant starch and soluble dietary fiber for microbiome balance.'
                  },
                  {
                    id: 'energy-satiety',
                    title: 'Sustained Satiety & Fuel',
                    desc: 'Plant fats and protein density to reduce midday hunger dips without glucose spikes.'
                  },
                  {
                    id: 'glycemic-control',
                    title: 'Glycemic Balance & Low Sugar',
                    desc: 'Formulations naturally sweetened with fruit purees and slow-digesting starches.'
                  },
                  {
                    id: 'family-friendly',
                    title: 'Wholesome Family Nutrition',
                    desc: 'Gentle, comforting bakes packed with wholesome nutrients for lunchboxes.'
                  }
                ].map((goal) => {
                  const isSelected = answers.primaryGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setAnswers({ ...answers, primaryGoal: goal.id as any })}
                      className={`p-6 text-left border transition-colors ${
                        isSelected
                          ? 'border-[#3A2721] bg-[#3A2721]/5 ring-1 ring-[#3A2721]'
                          : 'border-[#3A2721]/15 hover:border-[#3A2721]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-serif text-lg text-[#3A2721]">{goal.title}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#3A2721] shrink-0 mt-1" />}
                      </div>
                      <p className="text-xs sm:text-[13px] text-[#29211E]/75 mt-2 leading-[1.6]">{goal.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="group inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-editorial text-[#3A2721] hover:text-[#A96345]"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={generateRecommendations}
                className="px-7 py-3.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-[11px] font-mono uppercase tracking-editorial font-semibold transition-colors"
              >
                View Recommendations
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Results (Editorial Format) */}
        {step === 4 && recommendationResults && (
          <div className="space-y-12 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#3A2721]/15">
              <div className="space-y-1">
                <span className="font-display text-[10.5px] uppercase tracking-luxury font-semibold text-[#657258] block">
                  Results Matrix
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#3A2721] font-normal tracking-snug-title">
                  Your Curated Formulations
                </h2>
              </div>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-editorial font-semibold text-[#3A2721] hover:text-[#A96345] transition-colors self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over</span>
              </button>
            </div>

            <div className="space-y-12">
              {recommendationResults.slice(0, 3).map((match, idx) => {
                const p = match.product;
                const saved = isProductSaved(p.id);

                return (
                  <div
                    key={p.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-12 border-b border-[#3A2721]/15 last:border-b-0"
                  >
                    <div 
                      onClick={() => openProductDetail(p.id)}
                      className="md:col-span-4 aspect-4/3 overflow-hidden bg-[#EFE6D8] cursor-pointer group"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    </div>

                    <div className="md:col-span-8 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="font-mono text-[9.5px] uppercase tracking-editorial font-semibold text-[#657258] block">
                            0{idx + 1} • {match.matchScore}% Match Index
                          </span>
                          <h3 
                            onClick={() => openProductDetail(p.id)}
                            className="font-serif text-2xl text-[#3A2721] hover:text-[#A96345] cursor-pointer transition-colors font-normal"
                          >
                            {p.name}
                          </h3>
                          <p className="text-xs sm:text-[13px] text-[#A96345] font-medium italic">{p.tagline}</p>
                        </div>

                        <button
                          onClick={() => toggleSaveProduct(p.id)}
                          className={`p-2 transition-colors ${
                            saved ? 'text-[#A96345]' : 'text-[#3A2721]/40 hover:text-[#3A2721]'
                          }`}
                          title="Save product"
                        >
                          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : 'stroke-[1.5]'}`} />
                        </button>
                      </div>

                      <p className="text-xs sm:text-[13.5px] text-[#29211E]/80 flex items-start gap-2.5 leading-[1.6]">
                        <CheckCircle2 className="w-4 h-4 text-[#657258] shrink-0 mt-0.5" />
                        <span>{match.reasons.nutritionMatch}</span>
                      </p>

                      <div className="pt-2 border-t border-[#3A2721]/10 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 font-mono font-tabular text-xs text-[#29211E]/70 font-normal">
                          <span>{p.nutrition.calories} kcal</span>
                          <span>•</span>
                          <span className="text-[#657258] font-bold">+{p.nutrition.dietaryFiberGrams}g fiber</span>
                          <span>•</span>
                          <span>{p.nutrition.proteinGrams}g protein</span>
                        </div>

                        <button
                          onClick={() => openProductDetail(p.id)}
                          className="group inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-editorial font-semibold text-[#3A2721] hover:text-[#A96345] transition-colors"
                        >
                          <span>Explore Monograph</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
