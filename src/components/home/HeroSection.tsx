import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Sparkles, Heart, ShieldCheck, Cookie, Info } from 'lucide-react';
import heroBakeryImage from '../../assets/images/hero_bakery_still_life_1788459814680.jpg';
import { ThemeLogo, OfficialLogoIcon } from '../common/ThemeLogo';

export const HeroSection: React.FC = () => {
  const { navigateTo, websiteContent } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<number>(0);

  const heroData = websiteContent?.hero || {
    badgeText: 'NutriBake Botanical Bakery',
    title: 'Better Nutrition.',
    titleHighlight: 'Baked with Love.',
    description: 'Pure prebiotic bakes crafted with sweet green banana flour, wholesome California almonds, and natural dietary fiber. Wholesome bakery comfort made gentle on your digestion.',
    ctaPrimaryText: 'Taste the Bakes',
    ctaSecondaryText: 'Our Bakery Story'
  };

  const bakeryHighlights = (websiteContent?.heroHighlights && websiteContent.heroHighlights.length > 0)
    ? websiteContent.heroHighlights
    : [
    {
      emoji: '🍯',
      title: 'Naturally Sweetened',
      desc: 'Sweetened gently with unripe green banana and organic dates—zero refined cane sugars.'
    },
    {
      emoji: '🌾',
      title: '7.2g Prebiotic RS2',
      desc: 'Type-2 resistant starch ferments deeply in the microbiome to foster sustained satiety.'
    },
    {
      emoji: '🧁',
      title: 'Melt-in-Mouth Softness',
      desc: 'Golden crumb elasticity developed through cold-milled almonds and defatted coconut.'
    },
    {
      emoji: '💛',
      title: 'Baked with Whole Heart',
      desc: 'Validated research from Univ. of Sindh Food Science meets everyday family nourishment.'
    }
  ];

  return (
    <section 
      aria-label="NutriBake Hero"
      className="relative w-full bg-[#FAF7F2] border-b border-[#E8DDCF]/60 flex flex-col justify-center min-h-[85vh] lg:min-h-[calc(90vh-76px)] xl:min-h-[calc(92vh-76px)] py-10 sm:py-14 lg:py-16 overflow-hidden"
    >
      {/* Soft warm ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#F4E3D0]/40 via-[#F7EDE1]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full relative z-10">
        {/* Asymmetric Desktop Layout (45% Story, 55% Photography) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14 xl:gap-20 items-center">
          
          {/* LEFT / CENTER TYPOGRAPHY COLUMN (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8">
            
            {/* Top Identity Markers: Soft Rounded Pills */}
            <div className="space-y-3.5 animate-in fade-in duration-700">
              <div className="flex items-center gap-3">
                <ThemeLogo variant="mark" size="sm" />
                <span className="font-sans text-[11px] tracking-wider uppercase font-semibold text-[#3D261E]/80">
                  {heroData.badgeText}
                </span>
                <span className="h-px w-6 bg-[#C97D36]/40" aria-hidden="true" />
              </div>

              {/* Soft Sweet Bakery Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                <button
                  onClick={() => navigateTo('products')}
                  className="bg-[#EEF3EB] text-[#556948] px-3 py-1 rounded-full border border-[#D4E0CD] hover:bg-[#E3EBDC] transition-all shadow-2xs"
                >
                  🧁 Golden Cupcakes
                </button>
                <button
                  onClick={() => navigateTo('products')}
                  className="bg-[#FAF0E4] text-[#A6672C] px-3 py-1 rounded-full border border-[#EAD2B9] hover:bg-[#F5E6D3] transition-all shadow-2xs"
                >
                  🍪 Cocolina Cookies
                </button>
                <button
                  onClick={() => navigateTo('products')}
                  className="bg-[#FDF1EB] text-[#B35E44] px-3 py-1 rounded-full border border-[#F2D3C8] hover:bg-[#F9E5DC] transition-all shadow-2xs"
                >
                  ✨ Vitality NutriBalls
                </button>
              </div>
            </div>

            {/* Dominant Headline: Soft & Sweet Elegance */}
            <h1 className="font-serif text-3xl xs:text-4xl sm:text-6xl lg:text-[4.25rem] xl:text-[5.15rem] text-[#3D261E] font-normal tracking-tight-title leading-[1.04] sm:leading-[0.98] break-words text-balance animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
              {heroData.title}<br />
              <span className="italic font-light text-[#C97D36]">{heroData.titleHighlight}</span>
            </h1>

            {/* Short, Warm Editorial Description */}
            <p className="text-sm sm:text-[15.5px] text-[#2A1F1B]/80 font-normal leading-[1.7] max-w-md animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
              {heroData.description}
            </p>

            {/* Restrained CTAs: Soft Rounded Pill Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 pt-1 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
              <button
                type="button"
                onClick={() => navigateTo('products')}
                className="btn-sweet group w-full sm:w-auto justify-center px-7 sm:px-8 py-3.5 bg-[#3D261E] hover:bg-[#C97D36] text-[#FAF7F2] text-xs font-semibold tracking-wide transition-all inline-flex items-center gap-2.5 shadow-md active:scale-95"
              >
                <span>{heroData.ctaPrimaryText}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('about')}
                className="btn-sweet group w-full sm:w-auto justify-center px-6 py-3.5 bg-white/80 hover:bg-white text-[#3D261E] hover:text-[#C97D36] border border-[#E6D9CC] text-xs font-semibold tracking-wide transition-all inline-flex items-center gap-2 shadow-xs hover:border-[#C97D36]"
              >
                <span>{heroData.ctaSecondaryText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#C97D36]" aria-hidden="true" />
              </button>
            </div>

            {/* Interactive Sweetness & Wholesome Delights Dock */}
            <div className="pt-3 border-t border-[#E8DDCF]/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#3D261E] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C97D36]" />
                  <span>Wholesome Sensory Promise:</span>
                </span>
                <span className="text-[10px] text-[#2A1F1B]/60">Tap to discover</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {bakeryHighlights.map((item, idx) => (
                  <button
                    key={item.title}
                    onClick={() => setActiveHighlight(idx)}
                    className={`p-2 rounded-2xl text-left transition-all border ${
                      activeHighlight === idx
                        ? 'bg-white border-[#C97D36] shadow-xs ring-1 ring-[#C97D36]/20'
                        : 'bg-white/60 hover:bg-white border-[#E8DDCF]/80'
                    }`}
                  >
                    <span className="text-base block">{item.emoji}</span>
                    <span className="text-[10.5px] font-semibold text-[#3D261E] block truncate mt-0.5">
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active detail tooltip card */}
              <div className="mt-2.5 p-3 rounded-2xl bg-white/90 border border-[#E8DDCF] text-xs text-[#2A1F1B]/85 flex items-start gap-2.5 animate-in fade-in duration-300 shadow-2xs">
                <span className="text-lg shrink-0">{bakeryHighlights[activeHighlight].emoji}</span>
                <div>
                  <strong className="text-[#3D261E] block font-semibold">
                    {bakeryHighlights[activeHighlight].title}
                  </strong>
                  <p className="text-[12px] leading-relaxed text-[#2A1F1B]/75 mt-0.5">
                    {bakeryHighlights[activeHighlight].desc}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT / PHOTOGRAPHY COLUMN (lg:col-span-7) */}
          <div className="lg:col-span-7 relative flex flex-col justify-center animate-in fade-in duration-1000 delay-150">
            
            <div className="relative flex items-center">
              {/* Soft Vertical Accent Tag */}
              <div 
                className="hidden lg:flex items-center justify-center pr-4 xl:pr-6 select-none"
                aria-hidden="true"
              >
                <span className="[writing-mode:vertical-rl] rotate-180 font-sans text-[9.5px] uppercase tracking-wider font-semibold text-[#3D261E]/45 whitespace-nowrap">
                  BAKED WITH PURPOSE & HEART · PREBIOTIC DELIGHT
                </span>
              </div>

              {/* Editorial Photograph Container with Soft Organic Curves & Warm Shadow */}
              <div className="relative w-full overflow-hidden rounded-3xl bg-[#F6EFE6] border border-[#E6D9CC] shadow-[0_16px_40px_-8px_rgba(61,38,30,0.10)] transition-all hover:shadow-[0_24px_50px_-8px_rgba(61,38,30,0.14)]">
                <div className="aspect-4/3 sm:aspect-16/11 lg:aspect-4/3 xl:aspect-16/11 w-full overflow-hidden relative">
                  <img
                    src={heroBakeryImage}
                    alt="Artisanal functional NutriBake muffin and loaf composition with green banana flour, almonds, and coconut in natural warm morning sunlight"
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover contrast-[1.01] transition-all duration-1000 ${
                      imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
                    } hover:scale-[1.015]`}
                    referrerPolicy="no-referrer"
                  />

                  {/* Official Logo Seal Overlay on Hero Photography (Soft Pill Style) */}
                  <div className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-[#E6D9CC] shadow-md flex items-center gap-2.5">
                    <div className="w-5 h-5 shrink-0">
                      <OfficialLogoIcon className="w-full h-full object-contain" strokeWidth={5.5} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-[#3D261E] leading-none">
                        NutriBake
                      </span>
                      <span className="text-[8.5px] text-[#5E7252] font-semibold leading-none mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5E7252] inline-block" />
                        Official Hearth Recipe
                      </span>
                    </div>
                  </div>

                  {/* Sweet Bakery Fresh Badge */}
                  <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E6D9CC] text-[#3D261E] shadow-sm flex items-center gap-1.5">
                    <span className="text-xs">✨</span>
                    <span className="text-[10px] font-semibold tracking-wide">
                      Fresh Daily Batches
                    </span>
                  </div>
                </div>

                {/* Soft Nutrition & Ingredient Highlight Bar */}
                <div className="p-4 sm:p-5 bg-white/95 border-t border-[#E6D9CC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] uppercase tracking-wider font-bold text-[#C97D36] block">
                      HONEST ARTISAN INGREDIENTS
                    </span>
                    <p className="font-serif text-base text-[#3D261E] font-medium">
                      Unripe Banana Flour · Whole Almonds · Defatted Coconut
                    </p>
                  </div>

                  <div className="text-[11px] text-[#5E7252] font-semibold flex items-center gap-2 bg-[#EEF3EB] px-3 py-1.5 rounded-full border border-[#D4E0CD] self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-[#5E7252] animate-pulse" />
                    <span>Type-2 Prebiotic Resistant Starch</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Soft Ambient Reassurance below photography */}
            <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#2A1F1B]/65 px-2">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#C86B52] fill-[#C86B52]" />
                <span>Crafted with wholesome care</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5E7252]" />
                <span>University of Sindh Tested Assays</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
