import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, CheckCircle, Sparkles, AlertCircle, Clock, Utensils, RotateCcw } from 'lucide-react';

export const DailyIntakeTracker: React.FC = () => {
  const { 
    user, 
    products, 
    dailyIntakeLogs, 
    addIntakeLog, 
    removeIntakeLog, 
    clearDailyLogs 
  } = useApp();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [servings, setServings] = useState<number>(1);
  const [mealTime, setMealTime] = useState<'breakfast' | 'morning-snack' | 'lunch' | 'afternoon-snack' | 'dinner'>('morning-snack');

  const targetFiber = user?.preferences?.dailyFiberTargetGrams || user?.dailyFiberGoalGrams || 28;
  const currentFiber = dailyIntakeLogs.reduce((sum, item) => sum + item.fiberGrams, 0);
  const currentRS = dailyIntakeLogs.reduce((sum, item) => sum + item.resistantStarchGrams, 0);
  const currentCalories = dailyIntakeLogs.reduce((sum, item) => sum + item.calories, 0);
  const currentProtein = dailyIntakeLogs.reduce((sum, item) => sum + item.proteinGrams, 0);

  const percentage = Math.min(100, Math.round((currentFiber / targetFiber) * 100));

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const fiberGrams = Number((product.nutrition.dietaryFiberGrams * servings).toFixed(1));
    const resistantStarchGrams = Number((product.nutrition.resistantStarchGrams * servings).toFixed(1));
    const calories = Math.round(product.nutrition.calories * servings);
    const proteinGrams = Number((product.nutrition.proteinGrams * servings).toFixed(1));

    addIntakeLog({
      productId: product.id,
      productName: product.name,
      portionDescription: `${servings}x ${product.servingSize}`,
      mealTime,
      servings,
      fiberGrams,
      resistantStarchGrams,
      calories,
      proteinGrams
    });

    setIsLogModalOpen(false);
    setServings(1);
  };

  const getMealLabel = (time: string) => {
    switch (time) {
      case 'breakfast': return 'Breakfast';
      case 'morning-snack': return 'Morning Snack';
      case 'lunch': return 'Lunch';
      case 'afternoon-snack': return 'Afternoon Snack';
      case 'dinner': return 'Dinner';
      default: return 'Snack';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Target Progress Banner */}
      <div className="bg-[#FAF5ED] border border-[#3A2721]/15 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-[#3A2721]/10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10.5px] uppercase tracking-editorial font-bold text-[#657258]">
                NutriBake Clinical Target
              </span>
              {percentage >= 100 && (
                <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-editorial bg-[#657258] text-white px-2 py-0.5 font-bold">
                  <CheckCircle className="w-3 h-3" /> Goal Achieved
                </span>
              )}
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#3A2721] font-normal tracking-snug-title mt-1 break-words">
              Daily Dietary Fiber & Prebiotic Matrix
            </h3>
            <p className="font-mono text-xs text-[#29211E]/70 mt-1 break-words">
              Green banana flour RS2 resistant starch escapes small intestine digestion, fueling beneficial gut flora.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 min-h-[38px] bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-xs font-mono uppercase tracking-editorial font-semibold transition-colors flex items-center justify-center gap-2 shrink-0 text-center"
            >
              <Plus className="w-4 h-4" />
              <span>Log Baked Serving</span>
            </button>
            {dailyIntakeLogs.length > 0 && (
              <button
                onClick={clearDailyLogs}
                className="p-2.5 min-h-[38px] min-w-[38px] border border-[#3A2721]/20 hover:bg-[#3A2721]/5 text-[#3A2721] text-xs font-mono transition-colors shrink-0 flex items-center justify-center"
                title="Reset Today's Log"
                aria-label="Reset Today's Log"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar & Macro Grid */}
        <div className="pt-5 sm:pt-6 space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <div className="flex items-end justify-between font-mono gap-2 flex-wrap">
              <span className="text-xs text-[#29211E]/80">
                Current Intake: <strong className="text-base text-[#3A2721]">{currentFiber.toFixed(1)}g</strong> of {targetFiber}g goal
              </span>
              <span className="text-xs font-bold text-[#657258]">{percentage}% Complete</span>
            </div>
            <div className="w-full h-3 bg-[#3A2721]/10 overflow-hidden">
              <div 
                className="h-full bg-[#657258] transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 font-mono text-left pt-2">
            <div className="p-2.5 sm:p-4 bg-white border border-[#3A2721]/10 min-w-0">
              <span className="text-[9.5px] sm:text-[10px] uppercase tracking-tight sm:tracking-editorial text-[#29211E]/60 block font-bold truncate">Total Fiber</span>
              <span className="font-serif text-lg sm:text-2xl text-[#657258] block mt-0.5">{currentFiber.toFixed(1)}g</span>
              <span className="text-[9px] sm:text-[10px] text-[#29211E]/50 block truncate">Prebiotic & Soluble</span>
            </div>

            <div className="p-2.5 sm:p-4 bg-white border border-[#3A2721]/10 min-w-0">
              <span className="text-[9.5px] sm:text-[10px] uppercase tracking-tight sm:tracking-editorial text-[#A96345] block font-bold truncate">Resistant Starch</span>
              <span className="font-serif text-lg sm:text-2xl text-[#A96345] block mt-0.5">{currentRS.toFixed(1)}g</span>
              <span className="text-[9px] sm:text-[10px] text-[#29211E]/50 block truncate">Colonic SCFA Yield</span>
            </div>

            <div className="p-2.5 sm:p-4 bg-white border border-[#3A2721]/10 min-w-0">
              <span className="text-[9.5px] sm:text-[10px] uppercase tracking-tight sm:tracking-editorial text-[#29211E]/60 block font-bold truncate">Energy Intake</span>
              <span className="font-serif text-lg sm:text-2xl text-[#3A2721] block mt-0.5">{currentCalories}</span>
              <span className="text-[9px] sm:text-[10px] text-[#29211E]/50 block truncate">kcal from bakery</span>
            </div>

            <div className="p-2.5 sm:p-4 bg-white border border-[#3A2721]/10 min-w-0">
              <span className="text-[9.5px] sm:text-[10px] uppercase tracking-tight sm:tracking-editorial text-[#29211E]/60 block font-bold truncate">Plant Protein</span>
              <span className="font-serif text-lg sm:text-2xl text-[#3A2721] block mt-0.5">{currentProtein.toFixed(1)}g</span>
              <span className="text-[9px] sm:text-[10px] text-[#29211E]/50 block truncate">Nuts, Tahini & Oats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intake Timeline */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#3A2721]/15 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#A96345] shrink-0" />
            <h4 className="font-serif text-lg sm:text-xl text-[#3A2721] font-normal">Today's Consumption Timeline</h4>
          </div>
          <span className="font-mono text-[11px] text-[#29211E]/60">
            {dailyIntakeLogs.length} logged item{dailyIntakeLogs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {dailyIntakeLogs.length === 0 ? (
          <div className="bg-white border border-[#3A2721]/15 p-8 sm:p-12 text-center space-y-3">
            <Sparkles className="w-6 h-6 text-[#A96345]/50 mx-auto" />
            <p className="font-serif text-lg text-[#3A2721]">No NutriBake servings logged today.</p>
            <p className="text-xs text-[#29211E]/70 max-w-sm mx-auto leading-relaxed">
              Track your daily fiber and resistant starch intake by logging your breakfast muffin, afternoon cookie, or nutriballs.
            </p>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="mt-2 px-5 py-2.5 bg-[#3A2721] text-[#FAF5ED] text-xs font-mono uppercase tracking-editorial font-semibold"
            >
              + Log First Serving
            </button>
          </div>
        ) : (
          <div className="border border-[#3A2721]/15 bg-white divide-y divide-[#3A2721]/10">
            {dailyIntakeLogs.map((log) => (
              <div key={log.id} className="p-3.5 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 hover:bg-[#FAF5ED]/40 transition-colors">
                <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                  <div className="p-2 bg-[#FAF5ED] border border-[#3A2721]/10 text-[#3A2721] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#A96345]" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] uppercase tracking-editorial font-bold px-2 py-0.5 bg-[#3A2721]/5 text-[#3A2721]">
                        {getMealLabel(log.mealTime)}
                      </span>
                      <span className="font-mono text-[10.5px] text-[#29211E]/50">{log.timestamp}</span>
                    </div>
                    <h5 className="font-serif text-base text-[#3A2721] font-normal break-words">{log.productName}</h5>
                    <p className="font-mono text-xs text-[#29211E]/70 break-words">{log.portionDescription}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-6 font-mono text-right w-full md:w-auto pt-2.5 md:pt-0 border-t md:border-t-0 border-[#3A2721]/10 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-2.5 sm:gap-4 text-xs">
                    <div>
                      <span className="text-[9.5px] uppercase text-[#29211E]/50 block">Fiber</span>
                      <span className="font-bold text-[#657258]">+{log.fiberGrams}g</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase text-[#29211E]/50 block">RS2</span>
                      <span className="font-bold text-[#A96345]">+{log.resistantStarchGrams}g</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase text-[#29211E]/50 block">Energy</span>
                      <span className="text-[#3A2721]">{log.calories} kcal</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeIntakeLog(log.id)}
                    className="p-2 text-[#29211E]/40 hover:text-rose-700 transition-colors shrink-0 ml-2"
                    title="Remove Entry"
                    aria-label="Remove Entry"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Serving Modal */}
      {isLogModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-[#29211E]/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setIsLogModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#FAF5ED] border border-[#3A2721] p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#3A2721]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
                  Dietary Diary
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#3A2721] font-normal break-words">Log NutriBake Serving</h4>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="font-mono text-xs uppercase hover:text-[#A96345] p-1.5"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                  Select Product *
                </label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#3A2721]/20 font-sans text-xs text-[#3A2721] focus:outline-none focus:border-[#3A2721]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.servingSize} • +{p.nutrition.dietaryFiberGrams}g fiber)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                    Meal / Snack Time
                  </label>
                  <select
                    value={mealTime}
                    onChange={e => setMealTime(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-white border border-[#3A2721]/20 text-xs focus:outline-none focus:border-[#3A2721]"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="morning-snack">Morning Snack</option>
                    <option value="lunch">Lunch</option>
                    <option value="afternoon-snack">Afternoon Snack</option>
                    <option value="dinner">Dinner / Evening</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                    Number of Servings
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={servings}
                    onChange={e => setServings(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2.5 bg-white border border-[#3A2721]/20 text-xs focus:outline-none focus:border-[#3A2721]"
                  />
                </div>
              </div>

              {/* Quick nutritional preview */}
              {(() => {
                const prod = products.find(p => p.id === selectedProductId);
                if (!prod) return null;
                return (
                  <div className="p-3.5 sm:p-4 bg-white border border-[#3A2721]/15 space-y-2">
                    <span className="font-bold text-[#3A2721] text-[10px] sm:text-[10.5px] uppercase tracking-editorial block">
                      Nutrient Addition Preview ({servings} serving{servings > 1 ? 's' : ''}):
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                      <div className="p-2 bg-[#FAF5ED] min-w-0">
                        <span className="text-[8.5px] sm:text-[9px] uppercase text-[#29211E]/60 block truncate">Fiber</span>
                        <span className="font-bold text-xs sm:text-sm text-[#657258] block">
                          +{(prod.nutrition.dietaryFiberGrams * servings).toFixed(1)}g
                        </span>
                      </div>
                      <div className="p-2 bg-[#FAF5ED] min-w-0">
                        <span className="text-[8.5px] sm:text-[9px] uppercase text-[#29211E]/60 block truncate">RS2 Starch</span>
                        <span className="font-bold text-xs sm:text-sm text-[#A96345] block">
                          +{(prod.nutrition.resistantStarchGrams * servings).toFixed(1)}g
                        </span>
                      </div>
                      <div className="p-2 bg-[#FAF5ED] min-w-0">
                        <span className="text-[8.5px] sm:text-[9px] uppercase text-[#29211E]/60 block truncate">Calories</span>
                        <span className="font-bold text-xs sm:text-sm text-[#3A2721] block">
                          {Math.round(prod.nutrition.calories * servings)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-[#3A2721]/10">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[40px] border border-[#3A2721]/25 text-[#3A2721] uppercase tracking-editorial font-semibold text-[11px] text-center flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 min-h-[40px] bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] uppercase tracking-editorial font-semibold text-[11px] flex items-center justify-center gap-2 text-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save to Timeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
