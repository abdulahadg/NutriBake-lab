import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const NutritionExplorer: React.FC = () => {
  const { products, openProductDetail, navigateTo } = useApp();
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');

  const product = products.find(p => p.id === selectedProductId) || products[0];

  if (!product) return null;

  return (
    <div className="py-8 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-10 sm:space-y-16">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-3">
        <span className="font-display text-[11px] uppercase tracking-luxury font-semibold text-[#657258] block">
          Nutrition-Focused Formulation
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#3A2721] tracking-tight-title leading-[1.04] break-words">
          Nutritional <span className="italic">Specifications</span>.
        </h1>
        <p className="text-sm sm:text-[15px] text-[#29211E]/80 leading-[1.7] pt-1">
          Complete macronutrient, dietary fiber, and ingredient chemistry for our research-informed bakery formulations.
        </p>
      </div>

      {/* Minimal Product Selector Bar */}
      <div className="border-t border-b border-[#3A2721]/15 py-3 sm:py-4 flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
        <span className="font-mono text-[10px] uppercase tracking-editorial text-[#29211E]/60 font-semibold shrink-0">
          Formulation:
        </span>
        <div className="flex items-center gap-2 sm:gap-2.5">
          {products.map((p) => {
            const isSelected = p.id === selectedProductId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProductId(p.id)}
                className={`font-mono text-[10.5px] uppercase tracking-editorial whitespace-nowrap px-3 sm:px-3.5 py-1.5 transition-colors ${
                  isSelected
                    ? 'bg-[#3A2721] text-[#FAF5ED] font-semibold'
                    : 'text-[#29211E]/75 hover:text-[#3A2721] hover:bg-[#3A2721]/5 font-medium'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editorial Specification Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
        {/* Left Column: Authentic Packaging-Style Nutrition Table */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border-2 border-[#3A2721] p-4 sm:p-8 space-y-6 bg-[#FAF5ED]">
            <div className="space-y-1 pb-4 border-b-8 border-[#3A2721]">
              <span className="font-mono text-[10px] uppercase tracking-luxury font-semibold text-[#657258] block">
                Batch Specification Assay
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#3A2721] font-normal tracking-snug-title">
                {product.name}
              </h2>
              <p className="text-xs sm:text-[13px] text-[#29211E]/75 leading-relaxed">{product.tagline}</p>
            </div>

            <div className="flex justify-between items-baseline py-2.5 border-b border-[#3A2721]/20 text-xs">
              <span className="font-mono text-[11px] uppercase tracking-editorial font-semibold text-[#3A2721]">Serving Size</span>
              <span className="font-mono text-xs font-semibold text-[#3A2721]">{product.servingSize}</span>
            </div>

            <div className="flex justify-between items-baseline py-3 border-b-4 border-[#3A2721]">
              <span className="font-serif text-2xl sm:text-3xl font-normal text-[#3A2721] tracking-snug-title">Calories</span>
              <span className="font-mono text-3xl sm:text-4xl font-bold text-[#3A2721] tracking-tight">{product.nutrition.calories}</span>
            </div>

            {/* Nutrients List */}
            <div className="divide-y divide-[#3A2721]/15 text-xs text-[#29211E] font-tabular">
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-medium text-[12.5px]">Total Lipids (Healthy Plant Fats)</span>
                <span className="font-mono font-semibold text-[#3A2721]">{product.nutrition.totalFatGrams}g</span>
              </div>
              <div className="py-2.5 flex justify-between items-center pl-4 text-[#29211E]/80">
                <span className="text-[12px]">Saturated Fatty Acids</span>
                <span className="font-mono">{product.nutrition.saturatedFatGrams}g</span>
              </div>
              <div className="py-2.5 flex justify-between items-center font-medium bg-[#3A2721]/5 px-2.5 -mx-2.5">
                <span className="text-[#657258] font-bold text-[12.5px]">Total Dietary Fiber (Type-2 RS)</span>
                <span className="font-mono font-bold text-sm text-[#657258]">{product.nutrition.dietaryFiberGrams}g</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-medium text-[12.5px]">Total Carbohydrates</span>
                <span className="font-mono font-semibold text-[#3A2721]">{product.nutrition.carbsGrams}g</span>
              </div>
              <div className="py-2.5 flex justify-between items-center pl-4 text-[#29211E]/80">
                <span className="text-[12px]">Natural Fruit Sugars (Non-refined)</span>
                <span className="font-mono">{product.nutrition.sugarsGrams}g</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-medium text-[12.5px]">Protein (Almond & Seed Complex)</span>
                <span className="font-mono font-semibold text-[#3A2721]">{product.nutrition.proteinGrams}g</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-medium text-[12.5px]">Sodium</span>
                <span className="font-mono font-semibold text-[#3A2721]">{product.nutrition.sodiumMg}mg</span>
              </div>
            </div>

            <div className="pt-2 font-mono text-[10px] text-[#29211E]/60 leading-relaxed border-t border-[#3A2721]/20 uppercase tracking-editorial">
              Values calculated using certified nutritional composition assays at the Department of Software Engineering / Food Research laboratories.
            </div>
          </div>

          <div>
            <button
              onClick={() => openProductDetail(product.id)}
              className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-editorial font-semibold text-[#3A2721] hover:text-[#A96345] transition-colors"
            >
              <span>View full product monograph</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Research Context & Formulation Science */}
        <div className="lg:col-span-6 space-y-10">
          <div className="aspect-16/10 overflow-hidden bg-[#EFE6D8] border border-[#3A2721]/15">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <span className="font-display text-[11px] uppercase tracking-luxury font-semibold text-[#657258] block">
                Functional Composition
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#3A2721] tracking-snug-title">
                Active Botanical Inclusions
              </h3>
            </div>

            <div className="divide-y divide-[#3A2721]/15">
              {product.functionalIngredients.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-1">
                  <h4 className="font-serif text-base font-normal text-[#3A2721]">{item.name}</h4>
                  <p className="text-xs sm:text-[13px] text-[#29211E]/75 leading-[1.6]">{item.scientificBenefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#3A2721]/15 pt-8 space-y-3">
            <span className="font-mono text-[10.5px] uppercase tracking-editorial font-semibold text-[#A96345] block">
              Prebiotic Gut Dynamics
            </span>
            <p className="text-xs sm:text-[13.5px] text-[#29211E]/80 leading-[1.65]">
              Unlike industrial confectioneries sweetened with refined sugars and bleached flour, this formulation integrates {product.nutrition.dietaryFiberGrams}g of dietary fiber per serving to nourish short-chain fatty acid (SCFA) synthesis and support sustained metabolic balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
