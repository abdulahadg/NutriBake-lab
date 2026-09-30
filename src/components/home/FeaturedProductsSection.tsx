import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { OfficialLogoIcon } from '../common/ThemeLogo';

export const FeaturedProductsSection: React.FC = () => {
  const { products, openProductDetail, navigateTo, toggleSaveProduct, isProductSaved } = useApp();

  // Pick 3 signature products featuring Cupcakes, Cookies, and NutriBalls
  const showcaseProducts = [
    products.find(p => p.id === 'prod-cupcakes') || products[0],
    products.find(p => p.id === 'prod-cookies') || products[1],
    products.find(p => p.id === 'prod-nutriballs') || products[2],
  ].filter(Boolean);

  return (
    <section className="py-16 sm:py-20 lg:py-28 border-t border-[#E8DDCF] bg-[#FAF7F2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header - Sweet bakery warmth */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-14 border-b border-[#E8DDCF]">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF3EB] border border-[#D4E0CD] text-[11px] font-bold text-[#5E7252]">
              <Sparkles className="w-3 h-3 text-[#5E7252]" />
              <span>Artisan Functional Pastries</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-[#3D261E] tracking-tight leading-[1.12] sm:leading-[1.08] break-words">
              Formulations crafted for <span className="italic text-[#C97D36]">gut wellness & pure delight</span>.
            </h2>
          </div>

          <button
            onClick={() => navigateTo('products')}
            className="btn-sweet inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#3D261E] text-[#3D261E] hover:text-white border border-[#E6D9CC] text-xs font-semibold rounded-full shadow-2xs self-start md:self-auto transition-all"
          >
            <span>Explore All Treats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Soft Tactile Showcase Cards */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-20 pt-10 sm:pt-14">
          {/* Showcase Item 1: Cupcake */}
          {showcaseProducts[0] && (
            <div className="bg-white/85 rounded-3xl p-4 sm:p-10 border border-[#E8DDCF] shadow-[0_8px_32px_rgba(61,38,30,0.05)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <div 
                onClick={() => openProductDetail(showcaseProducts[0].id)}
                className="lg:col-span-7 group cursor-pointer relative overflow-hidden rounded-2xl bg-[#F6EFE6] border border-[#E6D9CC]"
              >
                <div className="aspect-16/11 overflow-hidden">
                  <img
                    src={showcaseProducts[0].imageUrl}
                    alt={showcaseProducts[0].name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                {/* Official Logo Pill */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-[#E6D9CC] shadow-xs">
                  <div className="w-3.5 h-3.5 shrink-0">
                    <OfficialLogoIcon className="w-full h-full object-contain" strokeWidth={5.5} />
                  </div>
                  <span className="font-sans text-[9px] uppercase font-bold text-[#3D261E]">NutriBake</span>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className="space-y-2.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#5E7252] font-bold px-3 py-1 rounded-full bg-[#EEF3EB] inline-block">
                    01 • Signature Cupcake
                  </span>
                  <h3 
                    onClick={() => openProductDetail(showcaseProducts[0].id)}
                    className="font-serif text-2xl sm:text-3xl text-[#3D261E] hover:text-[#C97D36] cursor-pointer transition-colors leading-tight font-normal"
                  >
                    {showcaseProducts[0].name}
                  </h3>
                  <p className="text-sm text-[#2A1F1B]/75 leading-relaxed">
                    {showcaseProducts[0].description}
                  </p>
                </div>

                <div className="py-2.5 px-3 sm:px-4 bg-[#FDF7F0] rounded-2xl border border-[#F5E6D3] text-xs text-[#3D261E] flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 font-medium">
                  <span className="text-[#5E7252] font-semibold">{showcaseProducts[0].nutrition.dietaryFiberGrams}g RS2 Fiber</span>
                  <span>•</span>
                  <span>Natural Dates</span>
                  <span>•</span>
                  <span className="font-bold text-[#C97D36]">PKR {showcaseProducts[0].pricePkr || 180}</span>
                </div>

                <div>
                  <button
                    onClick={() => openProductDetail(showcaseProducts[0].id)}
                    className="btn-sweet inline-flex items-center gap-2 px-5 py-2.5 bg-[#3D261E] hover:bg-[#C97D36] text-[#FAF7F2] text-xs font-semibold rounded-full shadow-xs transition-all"
                  >
                    <span>Taste Dossier & Nutrition</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Showcase Item 2: Cookie */}
          {showcaseProducts[1] && (
            <div className="bg-white/85 rounded-3xl p-4 sm:p-10 border border-[#E8DDCF] shadow-[0_8px_32px_rgba(61,38,30,0.05)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1 space-y-5">
                <div className="space-y-2.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#C97D36] font-bold px-3 py-1 rounded-full bg-[#FDF1EB] inline-block">
                    02 • Wholesome Cookie
                  </span>
                  <h3 
                    onClick={() => openProductDetail(showcaseProducts[1].id)}
                    className="font-serif text-2xl sm:text-3xl text-[#3D261E] hover:text-[#C97D36] cursor-pointer transition-colors leading-tight font-normal"
                  >
                    {showcaseProducts[1].name}
                  </h3>
                  <p className="text-sm text-[#2A1F1B]/75 leading-relaxed">
                    {showcaseProducts[1].description}
                  </p>
                </div>

                <div className="py-2.5 px-3 sm:px-4 bg-[#FDF7F0] rounded-2xl border border-[#F5E6D3] text-xs text-[#3D261E] flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 font-medium">
                  <span className="text-[#C86B52] font-semibold">{showcaseProducts[1].nutrition.proteinGrams}g Protein</span>
                  <span>•</span>
                  <span>Pure Almonds</span>
                  <span>•</span>
                  <span className="font-bold text-[#C97D36]">PKR {showcaseProducts[1].pricePkr || 150}</span>
                </div>

                <div>
                  <button
                    onClick={() => openProductDetail(showcaseProducts[1].id)}
                    className="btn-sweet inline-flex items-center gap-2 px-5 py-2.5 bg-[#3D261E] hover:bg-[#C97D36] text-[#FAF7F2] text-xs font-semibold rounded-full shadow-xs transition-all"
                  >
                    <span>Taste Dossier & Nutrition</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div 
                onClick={() => openProductDetail(showcaseProducts[1].id)}
                className="lg:col-span-7 order-1 lg:order-2 group cursor-pointer relative overflow-hidden rounded-2xl bg-[#F6EFE6] border border-[#E6D9CC]"
              >
                <div className="aspect-16/11 overflow-hidden">
                  <img
                    src={showcaseProducts[1].imageUrl}
                    alt={showcaseProducts[1].name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-[#E6D9CC] shadow-xs">
                  <div className="w-3.5 h-3.5 shrink-0">
                    <OfficialLogoIcon className="w-full h-full object-contain" strokeWidth={5.5} />
                  </div>
                  <span className="font-sans text-[9px] uppercase font-bold text-[#3D261E]">NutriBake</span>
                </div>
              </div>
            </div>
          )}

          {/* Showcase Item 3: NutriBalls */}
          {showcaseProducts[2] && (
            <div className="bg-white/85 rounded-3xl p-4 sm:p-10 border border-[#E8DDCF] shadow-[0_8px_32px_rgba(61,38,30,0.05)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <div 
                onClick={() => openProductDetail(showcaseProducts[2].id)}
                className="lg:col-span-6 group cursor-pointer relative overflow-hidden rounded-2xl bg-[#F6EFE6] border border-[#E6D9CC]"
              >
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={showcaseProducts[2].imageUrl}
                    alt={showcaseProducts[2].name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-[#E6D9CC] shadow-xs">
                  <div className="w-3.5 h-3.5 shrink-0">
                    <OfficialLogoIcon className="w-full h-full object-contain" strokeWidth={5.5} />
                  </div>
                  <span className="font-sans text-[9px] uppercase font-bold text-[#3D261E]">NutriBake</span>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5 lg:pl-4">
                <div className="space-y-2.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#5E7252] font-bold px-3 py-1 rounded-full bg-[#EEF3EB] inline-block">
                    03 • Vitality NutriBalls
                  </span>
                  <h3 
                    onClick={() => openProductDetail(showcaseProducts[2].id)}
                    className="font-serif text-2xl sm:text-3xl text-[#3D261E] hover:text-[#C97D36] cursor-pointer transition-colors leading-tight font-normal"
                  >
                    {showcaseProducts[2].name}
                  </h3>
                  <p className="text-sm text-[#2A1F1B]/75 leading-relaxed">
                    {showcaseProducts[2].description}
                  </p>
                </div>

                <div className="py-2.5 px-3 sm:px-4 bg-[#FDF7F0] rounded-2xl border border-[#F5E6D3] text-xs text-[#3D261E] flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 font-medium">
                  <span className="text-[#5E7252] font-semibold">{showcaseProducts[2].nutrition.dietaryFiberGrams}g Fiber</span>
                  <span>•</span>
                  <span>Raw Coconut</span>
                  <span>•</span>
                  <span className="font-bold text-[#C97D36]">PKR {showcaseProducts[2].pricePkr || 120}</span>
                </div>

                <div>
                  <button
                    onClick={() => openProductDetail(showcaseProducts[2].id)}
                    className="btn-sweet inline-flex items-center gap-2 px-5 py-2.5 bg-[#3D261E] hover:bg-[#C97D36] text-[#FAF7F2] text-xs font-semibold rounded-full shadow-xs transition-all"
                  >
                    <span>Taste Dossier & Nutrition</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
