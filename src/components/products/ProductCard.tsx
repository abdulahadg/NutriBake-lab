import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { OfficialLogoIcon } from '../common/ThemeLogo';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductDetail, toggleSaveProduct, isProductSaved } = useApp();
  const saved = isProductSaved(product.id);

  // Sweetness & sensory hint
  const sweetnessHint = product.category === 'Cupcakes'
    ? '🍯 Mild Date & Banana Sweetness'
    : product.category === 'Cookies'
    ? '🥥 Toasted Coconut & Almond Sweetness'
    : '✨ Natural Dried Fruits & Nut Crunch';

  return (
    <div 
      onClick={() => openProductDetail(product.id)}
      className="group cursor-pointer card-soft p-4 sm:p-5 flex flex-col justify-between bg-white/85 hover:bg-white rounded-3xl border border-[#E9DDD0] shadow-[0_4px_24px_rgba(61,38,30,0.04)] hover:shadow-[0_16px_36px_rgba(61,38,30,0.09)] transition-all duration-300 hover:-translate-y-1"
    >
      <div className="space-y-4">
        {/* Soft Rounded Image Frame */}
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#F6EFE6]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Official NutriBake Logo Seal on Image (Soft Pill) */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full border border-[#E6D9CC] shadow-xs">
            <div className="w-3.5 h-3.5 shrink-0">
              <OfficialLogoIcon className="w-full h-full object-contain" strokeWidth={5.5} />
            </div>
            <span className="font-sans text-[9px] uppercase tracking-wider font-bold text-[#3D261E]">
              NutriBake
            </span>
          </div>

          {/* Sweet Save Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveProduct(product.id);
            }}
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-xs active:scale-125 ${
              saved 
                ? 'bg-[#C86B52] text-white shadow-sm' 
                : 'bg-white/90 text-[#3D261E]/70 hover:text-[#C86B52] hover:bg-white hover:scale-110'
            }`}
            title={saved ? 'Remove from saved' : 'Save treat'}
            aria-label={saved ? 'Remove from saved' : 'Save treat'}
          >
            <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current text-white' : 'stroke-[1.8]'}`} />
          </button>

          {/* Category Pill & Price Tag in Soft Badges */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[10px] rounded-full font-semibold text-[#3D261E] border border-[#E6D9CC] shadow-2xs">
              {product.category}
            </span>
            {product.pricePkr && (
              <span className="px-3 py-1 bg-[#C97D36] text-[10.5px] font-bold text-white rounded-full tracking-wide shadow-xs">
                PKR {product.pricePkr}
              </span>
            )}
          </div>
        </div>

        {/* Sensory & Macro Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] gap-1">
            <span className="inline-flex items-center gap-1 font-semibold text-[#5E7252] bg-[#EEF3EB] px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-[#5E7252]" />
              <span>{product.nutrition.dietaryFiberGrams}g Fiber (RS2)</span>
            </span>
            {product.netWeight && (
              <span className="text-[11px] text-[#2A1F1B]/60 font-medium">{product.netWeight}</span>
            )}
          </div>

          <h3 className="font-serif text-xl sm:text-[22px] font-normal text-[#3D261E] group-hover:text-[#C97D36] transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-[13px] text-[#2A1F1B]/75 line-clamp-2 leading-relaxed">
            {product.tagline || product.description}
          </p>

          {/* Sweetness Profile Micro-hint */}
          <div className="text-[11px] text-[#C97D36] font-medium bg-[#FDF7F0] px-2.5 py-1 rounded-xl border border-[#F5E6D3]/60 flex items-center gap-1.5">
            <span>{sweetnessHint}</span>
          </div>
        </div>
      </div>

      {/* Card Footer with Tactile Action */}
      <div className="pt-3.5 mt-3 border-t border-[#F0E6DA] flex items-center justify-between text-xs">
        <span className="text-xs text-[#2A1F1B]/70 font-medium">
          {product.portionSize ? `${product.portionSize} • ` : ''}{product.nutrition.calories} kcal
        </span>
        <span className="btn-sweet inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAF7F2] group-hover:bg-[#3D261E] group-hover:text-white text-[#3D261E] font-semibold text-[11.5px] border border-[#E6D9CC] group-hover:border-[#3D261E] transition-all shadow-2xs">
          <span>Taste Profile</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  );
};
