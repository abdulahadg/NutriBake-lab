import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, products, openProductDetail, navigateTo } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products.slice(0, 4);
    const q = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.mainFunctionalIngredient.toLowerCase().includes(q) ||
      p.dietaryTags.some(t => t.toLowerCase().includes(q)) ||
      p.allIngredients.some(i => i.toLowerCase().includes(q))
    );
  }, [products, query]);

  if (!searchOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-24 px-3 sm:px-4 bg-[#29211E]/60 backdrop-blur-xs transition-opacity"
      onClick={() => setSearchOpen(false)}
    >
      <div 
        className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-[#E8DDCF] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] shadow-[0_25px_60px_-15px_rgba(61,38,30,0.18)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="p-3.5 sm:p-5 border-b border-[#E8DDCF] flex items-center gap-2.5 sm:gap-3 bg-white/80">
          <Search className="w-5 h-5 text-[#C97D36] shrink-0 stroke-[2]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search formulation, banana flour, fiber..."
            className="w-full bg-transparent text-[#3D261E] text-sm sm:text-base placeholder-[#2A1F1B]/40 focus:outline-none font-normal"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-[#2A1F1B]/40 hover:text-[#3D261E] p-1.5 rounded-full hover:bg-[#FAF0E4]"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="btn-sweet text-[11px] font-semibold px-2.5 sm:px-3 py-1 rounded-full border border-[#E6D9CC] bg-[#FAF7F2] text-[#3D261E] hover:bg-[#3D261E] hover:text-white transition-all shadow-2xs shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Sweet Pills */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-[#E8DDCF]/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar bg-[#FAF7F2]/50">
          <span className="text-[#2A1F1B]/50 shrink-0 font-bold text-[11px] uppercase tracking-wider">Quick:</span>
          <button
            onClick={() => setQuery('banana')}
            className="btn-sweet px-3 py-1 rounded-full bg-white border border-[#E8DDCF] text-[#3D261E] hover:bg-[#3D261E] hover:text-white transition-all whitespace-nowrap text-xs font-medium shadow-2xs"
          >
            🍌 Green Banana Flour
          </button>
          <button
            onClick={() => setQuery('fiber')}
            className="btn-sweet px-3 py-1 rounded-full bg-white border border-[#E8DDCF] text-[#3D261E] hover:bg-[#3D261E] hover:text-white transition-all whitespace-nowrap text-xs font-medium shadow-2xs"
          >
            ✨ Prebiotic RS2
          </button>
          <button
            onClick={() => setQuery('cupcake')}
            className="btn-sweet px-3 py-1 rounded-full bg-white border border-[#E8DDCF] text-[#3D261E] hover:bg-[#3D261E] hover:text-white transition-all whitespace-nowrap text-xs font-medium shadow-2xs"
          >
            🧁 Cupcakes
          </button>
          <button
            onClick={() => setQuery('cookie')}
            className="btn-sweet px-3 py-1 rounded-full bg-white border border-[#E8DDCF] text-[#3D261E] hover:bg-[#3D261E] hover:text-white transition-all whitespace-nowrap text-xs font-medium shadow-2xs"
          >
            🍪 Cookies
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-[#5E7252] bg-[#EEF3EB] px-3 py-0.5 rounded-full border border-[#D4E0CD]">
              Formulations ({filteredProducts.length})
            </span>
            <button
              onClick={() => {
                setSearchOpen(false);
                navigateTo('products');
              }}
              className="btn-sweet text-xs font-semibold text-[#3D261E] hover:text-[#C97D36] flex items-center gap-1.5 transition-colors"
            >
              <span>View full catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-xs sm:text-sm text-[#2A1F1B]/60">
              No matching formulations found for "{query}".
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSearchOpen(false);
                    openProductDetail(p.id);
                  }}
                  className="p-3 flex items-center gap-4 hover:bg-[#FAF7F2] rounded-2xl cursor-pointer transition-all border border-transparent hover:border-[#E8DDCF] group shadow-2xs hover:shadow-xs"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-14 h-14 object-cover shrink-0 rounded-xl border border-[#E8DDCF] shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base text-[#3D261E] group-hover:text-[#C97D36] transition-colors truncate font-medium">
                      {p.name}
                    </h4>
                    <p className="text-xs text-[#2A1F1B]/65 truncate mt-0.5">
                      {p.mainFunctionalIngredient} • <span className="text-[#5E7252] font-semibold">+{p.nutrition.dietaryFiberGrams}g fiber</span>
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#3D261E]/40 group-hover:text-[#C97D36] group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
