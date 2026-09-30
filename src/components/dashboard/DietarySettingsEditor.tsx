import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Shield, FileText, Check, Printer } from 'lucide-react';

export const DietarySettingsEditor: React.FC = () => {
  const { user, updateUserProfile, dailyIntakeLogs, savedProductIds, products } = useApp();

  const [fiberTarget, setFiberTarget] = useState<number>(
    user?.preferences?.dailyFiberTargetGrams || user?.dailyFiberGoalGrams || 28
  );
  const [dietaryGoal, setDietaryGoal] = useState<string>(
    user?.preferences?.dietaryGoal || user?.dietaryPreference || 'High Fiber & Gut Vitality'
  );
  const [allergens, setAllergens] = useState<string[]>(user?.preferences?.allergens || []);

  const allergenList = ['Peanuts', 'Tree Nuts', 'Gluten', 'Dairy', 'Sesame', 'Eggs', 'Soy'];

  const toggleAllergen = (item: string) => {
    if (allergens.includes(item)) {
      setAllergens(allergens.filter(a => a !== item));
    } else {
      setAllergens([...allergens, item]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      dailyFiberGoalGrams: fiberTarget,
      dietaryPreference: dietaryGoal,
      preferences: {
        dailyFiberTargetGrams: fiberTarget,
        dietaryGoal,
        allergens
      }
    });
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const savedList = products.filter(p => savedProductIds.includes(p.id));

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white border border-[#3A2721]/15 p-4 sm:p-8 space-y-8">
        <div className="border-b border-[#3A2721]/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
              Metabolic Calibration
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#3A2721] font-normal tracking-snug-title break-words">
              Dietary Protocol & Clinical Parameters
            </h3>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-xs font-mono uppercase tracking-editorial font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Check className="w-4 h-4" />
            <span>Update Parameters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fiber Target */}
          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10.5px] uppercase tracking-editorial font-bold text-[#3A2721] block">
                Daily Dietary Fiber Target (Grams / Day)
              </label>
              <p className="text-xs text-[#29211E]/70 mt-0.5">
                Clinical trials at University of Sindh calibrate 28g–35g/day for optimal butyrate production.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-[#FAF5ED] p-4 border border-[#3A2721]/10">
              <input
                type="range"
                min="20"
                max="45"
                step="1"
                value={fiberTarget}
                onChange={e => setFiberTarget(Number(e.target.value))}
                className="flex-1 accent-[#3A2721]"
              />
              <span className="font-serif text-3xl text-[#657258] font-bold w-16 text-right">
                {fiberTarget}g
              </span>
            </div>
          </div>

          {/* Dietary Focus */}
          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10.5px] uppercase tracking-editorial font-bold text-[#3A2721] block">
                Primary Metabolic Protocol
              </label>
              <p className="text-xs text-[#29211E]/70 mt-0.5">
                Align recommendations with your continuous glucose and gut microbiome goals.
              </p>
            </div>

            <select
              value={dietaryGoal}
              onChange={e => setDietaryGoal(e.target.value)}
              className="w-full p-3.5 bg-[#FAF5ED] border border-[#3A2721]/20 font-mono text-xs text-[#3A2721] font-semibold"
            >
              <option value="High Fiber & Gut Vitality">High Fiber & Gut Vitality (Microbiome Priority)</option>
              <option value="Low Glycemic Blood Sugar Balance">Low Glycemic Blood Sugar Balance (Type 2 / Pre-diabetes)</option>
              <option value="Athletic Satiety & Sustained Energy">Athletic Satiety & Sustained Energy (RS2 Slow Starch)</option>
              <option value="Pediatric Nutrition & Healthy Digestion">Pediatric Nutrition & Healthy Digestion (Child Friendly)</option>
              <option value="Post-Antibiotic Microbiome Recovery">Post-Antibiotic Microbiome Recovery (Inulin & RS2)</option>
            </select>
          </div>
        </div>

        {/* Allergen Filters */}
        <div className="space-y-3 pt-4 border-t border-[#3A2721]/10">
          <label className="font-mono text-[10.5px] uppercase tracking-editorial font-bold text-[#3A2721] block">
            Exclusionary Allergen Flags
          </label>
          <p className="text-xs text-[#29211E]/70">
            Formulations containing checked allergens will be highlighted with red warnings in your catalog.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {allergenList.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleAllergen(item)}
                className={`px-3 py-1.5 font-mono text-xs border transition-colors ${
                  allergens.includes(item)
                    ? 'bg-rose-100 border-rose-400 text-rose-800 font-bold'
                    : 'bg-[#FAF5ED] border-[#3A2721]/20 text-[#29211E]/70 hover:border-[#3A2721]'
                }`}
              >
                {allergens.includes(item) ? `✕ Exclude ${item}` : `+ ${item}`}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Clinical Summary Report Card */}
      <div className="bg-[#FAF5ED] border border-[#3A2721]/15 p-4 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A2721]/10 pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
              Clinical Export
            </span>
            <h4 className="font-serif text-2xl text-[#3A2721] font-normal">
              Physician & Nutritionist Report Sheet
            </h4>
            <p className="font-mono text-xs text-[#29211E]/70 mt-1">
              Formatted patient summary for presentation at clinical or dietary consultations.
            </p>
          </div>

          <button
            onClick={handlePrintSummary}
            className="px-4 py-2 border border-[#3A2721]/25 bg-white hover:bg-[#FAF5ED] text-[#3A2721] text-xs font-mono uppercase tracking-editorial font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report Sheet</span>
          </button>
        </div>

        {/* Printable Section */}
        <div className="bg-white p-4 sm:p-6 border border-[#3A2721]/10 space-y-4 font-mono text-xs overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-[#3A2721]/10 pb-3 gap-2">
            <div>
              <p className="font-bold text-sm text-[#3A2721]">NutriBake Functional Formulation Patient Monograph</p>
              <p className="text-[#29211E]/60 text-[10.5px]">University of Sindh, Jamshoro • Dept of Nutrition & Food Science</p>
            </div>
            <div className="text-left sm:text-right text-[10.5px] text-[#29211E]/60">
              Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-b border-[#3A2721]/10">
            <div>
              <span className="text-[10px] uppercase text-[#29211E]/60 block">Patient Name</span>
              <span className="font-bold text-[#3A2721]">{user?.name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#29211E]/60 block">Fiber Target</span>
              <span className="font-bold text-[#657258]">{fiberTarget}g / day</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#29211E]/60 block">Current Daily Intake</span>
              <span className="font-bold text-[#3A2721]">
                {dailyIntakeLogs.reduce((s, i) => s + i.fiberGrams, 0).toFixed(1)}g
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#29211E]/60 block">Allergen Flags</span>
              <span className="font-bold text-rose-700">
                {allergens.length > 0 ? allergens.join(', ') : 'None'}
              </span>
            </div>
          </div>

          <div>
            <span className="font-bold uppercase tracking-editorial text-[10px] text-[#3A2721] block mb-1">
              Active Prescribed Functional Formulations:
            </span>
            <ul className="list-disc list-inside space-y-1 text-[#29211E]/80">
              {savedList.map(p => (
                <li key={p.id}>
                  <strong>{p.name}</strong> — {p.servingSize} (+{p.nutrition.dietaryFiberGrams}g fiber, {p.nutrition.resistantStarchGrams}g RS2, {p.nutrition.glycemicIndexEst} Est. GI)
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
