import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Heart, Share2, ArrowRight, Sparkles, Plus, Check } from 'lucide-react';
import { OfficialLogoIcon } from '../common/ThemeLogo';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    toggleSaveProduct, 
    isProductSaved, 
    navigateTo, 
    addToast,
    addIntakeLog 
  } = useApp();

  const [logged, setLogged] = React.useState(false);

  if (!selectedProduct) return null;

  const saved = isProductSaved(selectedProduct.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link Copied', `Shareable link for ${selectedProduct.name} copied to clipboard.`, 'info');
    }
  };

  const handleGetRecommendation = () => {
    setSelectedProduct(null);
    navigateTo('recommendations');
  };

  const handleQuickLog = () => {
    addIntakeLog({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      portionCount: 1,
      fiberGrams: selectedProduct.nutrition.dietaryFiberGrams,
      resistantStarchGrams: Math.round(selectedProduct.nutrition.dietaryFiberGrams * 0.75 * 10) / 10,
      calories: selectedProduct.nutrition.calories,
      mealType: 'Snack'
    });
    setLogged(true);
    setTimeout(() => setLogged(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#2A1F1B]/60 backdrop-blur-sm overflow-y-auto"
      onClick={() => setSelectedProduct(null)}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl border border-[#E6D9CC] my-auto max-h-[92vh] flex flex-col shadow-2xl text-[#2A1F1B] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Controls */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#E8DDCF] bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm shrink-0">🧁</span>
            <span className="text-[11px] uppercase tracking-wider text-[#5E7252] font-semibold truncate">
              Artisan Formulation • {selectedProduct.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-1.5 sm:p-2 rounded-full hover:bg-[#F6EFE6] text-[#3D261E]/70 hover:text-[#3D261E] transition-colors"
              title="Share treat"
            >
              <Share2 className="w-4 h-4 stroke-[1.8]" />
            </button>
            <button
              onClick={() => toggleSaveProduct(selectedProduct.id)}
              className={`p-1.5 sm:p-2 rounded-full transition-all ${
                saved ? 'bg-[#FDF1EB] text-[#C86B52]' : 'hover:bg-[#F6EFE6] text-[#3D261E]/70 hover:text-[#C86B52]'
              }`}
              title={saved ? 'Remove from saved' : 'Save treat'}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current text-[#C86B52]' : 'stroke-[1.8]'}`} />
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-[#F6EFE6] text-[#3D261E]/70 hover:text-[#3D261E] transition-colors ml-0.5 sm:ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-8 space-y-6 sm:space-y-7">
          {/* Product Header & Photography */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-7 items-start">
            <div className="relative md:col-span-6 aspect-4/3 overflow-hidden rounded-2xl bg-[#F6EFE6] border border-[#E6D9CC]">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Official NutriBake Seal Overlay on Image */}
              <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-[#E6D9CC] shadow-xs">
                <div className="w-4 h-4 shrink-0">
                  <OfficialLogoIcon className="w-full h-full object-contain" strokeWidth={5.5} />
                </div>
                <span className="font-sans text-[9px] uppercase tracking-wider font-bold text-[#3D261E]">
                  NutriBake Official
                </span>
              </div>
            </div>

            <div className="md:col-span-6 space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider px-3 py-1 bg-[#EEF3EB] font-bold text-[#5E7252] rounded-full border border-[#D4E0CD]">
                    {selectedProduct.category}
                  </span>
                  {selectedProduct.pricePkr && (
                    <span className="text-xs sm:text-sm font-bold text-white px-3.5 py-1 bg-[#C97D36] rounded-full shadow-xs tracking-wide">
                      PKR {selectedProduct.pricePkr}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3D261E] tracking-tight-title leading-tight pt-1 break-words">
                  {selectedProduct.name}
                </h2>
                <p className="font-sans text-xs uppercase tracking-wider text-[#C97D36] font-semibold">
                  {selectedProduct.tagline}
                </p>
              </div>

              <p className="text-xs sm:text-[13.5px] text-[#2A1F1B]/80 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Sweet Direct Action: Log Serving Button */}
              <div className="pt-2">
                <button
                  onClick={handleQuickLog}
                  className={`w-full btn-sweet py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                    logged
                      ? 'bg-[#EEF3EB] text-[#5E7252] border-[#D4E0CD]'
                      : 'bg-white hover:bg-[#FAF0E4] text-[#3D261E] border-[#E6D9CC] shadow-2xs hover:border-[#C97D36]'
                  }`}
                >
                  {logged ? (
                    <>
                      <Check className="w-4 h-4 text-[#5E7252]" />
                      <span>Added to Daily Fiber Log (+{selectedProduct.nutrition.dietaryFiberGrams}g)</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-[#C97D36]" />
                      <span>Log 1 Serving to Today's Fiber Tracker</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-3 text-xs border-t border-[#F0E6DA] text-[#2A1F1B]/85">
                <div className="bg-white/70 p-2.5 rounded-xl border border-[#F0E6DA]">
                  <span className="text-[#5E7252] block text-[9.5px] uppercase font-bold tracking-wider">Portion Size</span>
                  <span className="font-semibold text-[#3D261E] text-xs">{selectedProduct.portionSize || selectedProduct.servingSize}</span>
                </div>
                {selectedProduct.netWeight && (
                  <div className="bg-white/70 p-2.5 rounded-xl border border-[#F0E6DA]">
                    <span className="text-[#5E7252] block text-[9.5px] uppercase font-bold tracking-wider">Net Weight</span>
                    <span className="font-semibold text-[#3D261E] text-xs">{selectedProduct.netWeight}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Clean Nutritional Panel (Soft Rounded Box) */}
          <div className="bg-white/85 rounded-2xl border border-[#E8DDCF] p-4 sm:p-5 shadow-2xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 text-center sm:divide-x divide-[#F0E6DA]">
              <div className="space-y-0.5 p-2 sm:p-0 bg-[#FAF7F2] sm:bg-transparent rounded-xl sm:rounded-none">
                <span className="text-[10px] uppercase tracking-wider text-[#2A1F1B]/60 block font-semibold">Calories</span>
                <span className="text-xl sm:text-2xl text-[#3D261E] font-bold">{selectedProduct.nutrition.calories}</span>
                <span className="text-[10px] text-[#2A1F1B]/60 block">kcal</span>
              </div>
              <div className="space-y-0.5 p-2 sm:p-0 bg-[#FAF7F2] sm:bg-transparent rounded-xl sm:rounded-none">
                <span className="text-[10px] uppercase tracking-wider text-[#5E7252] font-bold block">RS2 Fiber</span>
                <span className="text-xl sm:text-2xl text-[#5E7252] font-bold">{selectedProduct.nutrition.dietaryFiberGrams}g</span>
                <span className="text-[10px] text-[#2A1F1B]/60 block">prebiotic</span>
              </div>
              <div className="space-y-0.5 p-2 sm:p-0 bg-[#FAF7F2] sm:bg-transparent rounded-xl sm:rounded-none">
                <span className="text-[10px] uppercase tracking-wider text-[#3D261E] block font-semibold">Protein</span>
                <span className="text-xl sm:text-2xl text-[#3D261E] font-bold">{selectedProduct.nutrition.proteinGrams}g</span>
                <span className="text-[10px] text-[#2A1F1B]/60 block">clean plant</span>
              </div>
              <div className="space-y-0.5 p-2 sm:p-0 bg-[#FAF7F2] sm:bg-transparent rounded-xl sm:rounded-none">
                <span className="text-[10px] uppercase tracking-wider text-[#C97D36] block font-semibold">Fruit Sugar</span>
                <span className="text-xl sm:text-2xl text-[#C97D36] font-bold">{selectedProduct.nutrition.sugarsGrams}g</span>
                <span className="text-[10px] text-[#2A1F1B]/60 block">natural</span>
              </div>
            </div>
          </div>

          {/* Functional Inclusions & Allergens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-white/70 p-5 rounded-2xl border border-[#E8DDCF] space-y-3">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#5E7252] block">
                🌿 Functional Inclusions
              </span>
              <div className="space-y-3">
                {selectedProduct.functionalIngredients.map((item, idx) => (
                  <div key={idx} className="pb-2 border-b border-[#F0E6DA] last:border-none last:pb-0">
                    <span className="font-serif text-sm font-medium text-[#3D261E] block">{item.name}</span>
                    <p className="text-[#2A1F1B]/75 text-xs leading-relaxed mt-0.5">{item.scientificBenefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/70 p-5 rounded-2xl border border-[#E8DDCF] space-y-3">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#3D261E] block">
                💛 Composition & Care
              </span>
              <div className="space-y-2.5 text-[#2A1F1B]/80 text-xs leading-relaxed">
                <div>
                  <strong className="text-[#3D261E] block">Ingredients:</strong>
                  <p>{selectedProduct.allIngredients.join(', ')}.</p>
                </div>
                <div>
                  <strong className="text-[#3D261E] block">Allergen Safety:</strong>
                  <p>
                    {selectedProduct.allergenInformation || 
                      (selectedProduct.allergens.length > 0 
                        ? `Contains ${selectedProduct.allergens.join(', ')}.`
                        : 'No major declared priority allergens.')}
                  </p>
                </div>
                <div>
                  <strong className="text-[#3D261E] block">Storage:</strong>
                  <p>{selectedProduct.storageInstructions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Understated Recommendation Link */}
          <div className="pt-2">
            <button
              onClick={handleGetRecommendation}
              className="w-full btn-sweet py-3.5 bg-[#3D261E] hover:bg-[#C97D36] text-[#FAF7F2] text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Explore My Personalized Recommendation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
