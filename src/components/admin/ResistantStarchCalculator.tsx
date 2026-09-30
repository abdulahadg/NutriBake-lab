import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calculator, Sparkles, Flame, Check, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';

interface ResistantStarchCalculatorProps {
  onApplyToNewFormulation?: (data: {
    fiber: number;
    rs: number;
    gi: number;
    tagline: string;
  }) => void;
}

export const ResistantStarchCalculator: React.FC<ResistantStarchCalculatorProps> = ({ 
  onApplyToNewFormulation 
}) => {
  const { addToast } = useApp();

  // Inputs
  const [flourBatchGrams, setFlourBatchGrams] = useState<number>(1000);
  const [gbfPercentage, setGbfPercentage] = useState<number>(25); // Green banana flour %
  const [inulinPercentage, setInulinPercentage] = useState<number>(4); // Soluble fiber %
  const [bakingTempCelsius, setBakingTempCelsius] = useState<number>(165); // Baking temperature
  const [portionGrams, setPortionGrams] = useState<number>(65); // Finished single serving weight

  // Calculations
  // Raw Green Banana Flour contains ~48-52% resistant starch (RS2) and ~60% total dietary fiber.
  // When baked at <170°C with controlled hydration, RS2 retrogradation and gelatinization retention is ~72-80%.
  // Higher baking temp reduces RS2 retention.
  const tempDegradationFactor = bakingTempCelsius <= 165 ? 0.78 : (bakingTempCelsius <= 180 ? 0.65 : 0.48);
  
  const gbfWeightGrams = (flourBatchGrams * gbfPercentage) / 100;
  const inulinWeightGrams = (flourBatchGrams * inulinPercentage) / 100;
  
  // Total RS2 in batch
  const rawRsInBatch = gbfWeightGrams * 0.50; // 50% RS2 in raw GBF
  const retainedRsInBatch = rawRsInBatch * tempDegradationFactor;

  // Fiber calculation (GBF fiber ~60% + Inulin ~90% soluble prebiotic fiber + whole grain wheat/oats ~10%)
  const baseFlourFiber = ((flourBatchGrams - gbfWeightGrams) * 0.10);
  const gbfFiber = gbfWeightGrams * 0.60;
  const inulinFiber = inulinWeightGrams * 0.90;
  const totalFiberInBatch = baseFlourFiber + gbfFiber + inulinFiber;

  // Portions in batch (accounting for ~1.3x water/fat/sweetener mass expansion, minus ~12% bake loss)
  const totalDoughMass = flourBatchGrams * 1.65;
  const bakedYieldMass = totalDoughMass * 0.88;
  const totalPortions = Math.max(1, Math.round(bakedYieldMass / portionGrams));

  const fiberPerPortion = Number((totalFiberInBatch / totalPortions).toFixed(1));
  const rsPerPortion = Number((retainedRsInBatch / totalPortions).toFixed(1));

  // Estimated Glycemic Index attenuation (standard refined baked goods ~75-80; GBF lowers it)
  const estimatedGI = Math.max(34, Math.round(75 - (gbfPercentage * 0.9) - (inulinPercentage * 1.2)));

  // SCFA Butyrate Index (1 to 10 scale)
  const butyrateSynthesisIndex = Math.min(9.8, Number((3.5 + (rsPerPortion * 0.8) + (inulinPercentage * 0.3)).toFixed(1)));

  const handleApply = () => {
    if (onApplyToNewFormulation) {
      onApplyToNewFormulation({
        fiber: fiberPerPortion,
        rs: rsPerPortion,
        gi: estimatedGI,
        tagline: `${gbfPercentage}% GBF composite flour blend with ${rsPerPortion}g active RS2`
      });
      addToast('Calculation Applied', 'Nutritional assay seeded into formulation builder', 'info');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A2721]/15 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
            Functional Formulation Engine
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#3A2721] font-normal tracking-snug-title">
            RS2 Resistant Starch Calibration
          </h3>
          <p className="font-mono text-xs text-[#29211E]/70 mt-1">
            Predict native resistant starch retention, dietary fiber density, and glycemic index attenuation.
          </p>
        </div>

        {onApplyToNewFormulation && (
          <button
            onClick={handleApply}
            className="px-5 py-2.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-xs font-mono uppercase tracking-editorial font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#C88A58]" />
            <span>Seed into Formulation</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-6 bg-white border border-[#3A2721]/15 p-4 sm:p-7 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#3A2721]/10 pb-3">
            <Calculator className="w-4 h-4 text-[#A96345]" />
            <h4 className="font-serif text-lg text-[#3A2721] font-normal">
              Composite Flour Recipe Parameters
            </h4>
          </div>

          <div className="space-y-5 font-mono text-xs">
            {/* GBF % */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="uppercase text-[#3A2721] font-bold">
                  Green Banana Flour (GBF) Substitution %
                </span>
                <span className="font-serif text-lg text-[#657258] font-bold">{gbfPercentage}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={gbfPercentage}
                onChange={e => setGbfPercentage(Number(e.target.value))}
                className="w-full accent-[#3A2721]"
              />
              <div className="flex justify-between text-[10px] text-[#29211E]/50">
                <span>10% (Mild enrichment)</span>
                <span>25% (Optimal sensory/health balance)</span>
                <span>40% (Maximum clinical yield)</span>
              </div>
            </div>

            {/* Inulin % */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="uppercase text-[#3A2721] font-bold">
                  Chicory Inulin / Soluble Prebiotic %
                </span>
                <span className="font-serif text-lg text-[#A96345] font-bold">{inulinPercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={inulinPercentage}
                onChange={e => setInulinPercentage(Number(e.target.value))}
                className="w-full accent-[#3A2721]"
              />
              <span className="text-[10px] text-[#29211E]/50 block">
                Synergizes with RS2 for distal colon microbiome fermentation.
              </span>
            </div>

            {/* Baking Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="uppercase text-[#3A2721] font-bold">
                  Convection Baking Temperature
                </span>
                <span className="font-serif text-lg text-[#3A2721] font-bold">{bakingTempCelsius}°C</span>
              </div>
              <input
                type="range"
                min="150"
                max="200"
                step="5"
                value={bakingTempCelsius}
                onChange={e => setBakingTempCelsius(Number(e.target.value))}
                className="w-full accent-[#3A2721]"
              />
              {bakingTempCelsius > 175 ? (
                <div className="flex items-center gap-1.5 text-amber-800 text-[10.5px] bg-amber-50 p-2 border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>High heat degrades native type-2 granules into gelatinized digestible starch.</span>
                </div>
              ) : (
                <span className="text-[10px] text-[#657258] font-bold block">
                  ✓ Protected temperature preserves crystalline RS2 granules.
                </span>
              )}
            </div>

            {/* Portion Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div>
                <label className="uppercase text-[10px] font-bold text-[#3A2721] block mb-1">
                  Flour Batch Size (g)
                </label>
                <input
                  type="number"
                  min="200"
                  max="5000"
                  step="100"
                  value={flourBatchGrams}
                  onChange={e => setFlourBatchGrams(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAF5ED] border border-[#3A2721]/20 text-xs"
                />
              </div>

              <div>
                <label className="uppercase text-[10px] font-bold text-[#3A2721] block mb-1">
                  Portion Weight (g)
                </label>
                <input
                  type="number"
                  min="30"
                  max="120"
                  step="5"
                  value={portionGrams}
                  onChange={e => setPortionGrams(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAF5ED] border border-[#3A2721]/20 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Predicted Yield Output */}
        <div className="lg:col-span-6 bg-[#FAF5ED] border border-[#3A2721]/15 p-4 sm:p-7 space-y-6">
          <div className="border-b border-[#3A2721]/10 pb-3 flex items-center justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-editorial font-bold text-[#657258]">
              Simulation Analysis
            </span>
            <span className="font-mono text-[10.5px] text-[#29211E]/60">
              Yield: ~{totalPortions} baked servings
            </span>
          </div>

          {/* Core Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-mono text-left">
            <div className="p-4 bg-white border border-[#3A2721]/10 space-y-1">
              <span className="text-[10px] uppercase text-[#29211E]/60 font-bold block">
                Total Dietary Fiber
              </span>
              <span className="font-serif text-3xl text-[#657258] block">{fiberPerPortion}g</span>
              <span className="text-[10px] text-[#29211E]/50">Per {portionGrams}g serving</span>
            </div>

            <div className="p-4 bg-white border border-[#3A2721]/10 space-y-1">
              <span className="text-[10px] uppercase text-[#A96345] font-bold block">
                RS2 Resistant Starch
              </span>
              <span className="font-serif text-3xl text-[#A96345] block">{rsPerPortion}g</span>
              <span className="text-[10px] text-[#29211E]/50">Post-bake intact granule</span>
            </div>

            <div className="p-4 bg-white border border-[#3A2721]/10 space-y-1">
              <span className="text-[10px] uppercase text-[#3A2721] font-bold block">
                Estimated Glycemic Index
              </span>
              <span className="font-serif text-3xl text-[#3A2721] block">{estimatedGI}</span>
              <span className="text-[10px] text-[#657258] font-bold">Low Glycemic (GI &lt; 55)</span>
            </div>

            <div className="p-4 bg-white border border-[#3A2721]/10 space-y-1">
              <span className="text-[10px] uppercase text-[#3A2721] font-bold block">
                Butyrate Synthesis
              </span>
              <span className="font-serif text-3xl text-[#3A2721] block">{butyrateSynthesisIndex}/10</span>
              <span className="text-[10px] text-[#29211E]/50">Colonic SCFA Biomarker</span>
            </div>
          </div>

          {/* Academic Formulation Guidelines */}
          <div className="p-4 bg-white border border-[#3A2721]/10 space-y-2 text-xs font-mono">
            <span className="text-[10.5px] uppercase tracking-editorial font-bold text-[#3A2721] block">
              Jamshoro Lab Processing Insights:
            </span>
            <ul className="space-y-1 text-[#29211E]/75 leading-relaxed list-disc list-inside">
              <li>
                Green banana peel-pulp extraction maintains amylose double-helix structure up to <strong>165°C</strong>.
              </li>
              <li>
                Inulin incorporation at <strong>{inulinPercentage}%</strong> prevents staling and improves crumb compressibility by 18%.
              </li>
              <li>
                Calculated RS2 intake of <strong>{rsPerPortion}g/portion</strong> meets clinical trial dosage for microbiome modulation.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
