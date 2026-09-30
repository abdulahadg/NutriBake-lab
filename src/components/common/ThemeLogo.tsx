import React from 'react';
import nbLogoPng from '../../assets/images/NB-logo.png';
import officialLogoJpg from '../../assets/images/nutribake_official_logo_1789230811697.jpg';
import officialLogoSvg from '../../assets/images/nutribake_official_logo.svg';

export const OFFICIAL_LOGO_IMAGE = nbLogoPng;
export const OFFICIAL_LOGO_SVG_PATH = nbLogoPng;

/**
 * Official NutriBake Logo Icon
 * Uses the authentic brand logo asset (NB-logo.png)
 */
export const OfficialLogoIcon: React.FC<{
  className?: string;
  strokeWidth?: number;
}> = ({ className = 'w-full h-full' }) => (
  <img
    src={nbLogoPng}
    alt="NutriBake Logo"
    className={className}
    referrerPolicy="no-referrer"
  />
);

interface ThemeLogoProps {
  variant?: 'full' | 'mark' | 'stamp' | 'emblem' | 'official';
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ThemeLogo: React.FC<ThemeLogoProps> = ({
  variant = 'full',
  theme = 'light',
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const isDark = theme === 'dark';

  // Sizing parameters
  const sizeMap = {
    sm: {
      mark: 'w-8 h-8',
      text: 'text-lg',
      sub: 'text-[8px]',
      gap: 'gap-2',
      stamp: 'w-12 h-12',
    },
    md: {
      mark: 'w-10 h-10',
      text: 'text-2xl',
      sub: 'text-[9px]',
      gap: 'gap-2.5',
      stamp: 'w-16 h-16',
    },
    lg: {
      mark: 'w-14 h-14',
      text: 'text-3xl',
      sub: 'text-[10px]',
      gap: 'gap-3',
      stamp: 'w-20 h-20',
    },
    xl: {
      mark: 'w-20 h-20',
      text: 'text-4xl',
      sub: 'text-[11px]',
      gap: 'gap-4',
      stamp: 'w-28 h-28',
    },
  }[size];

  // Colors
  const primaryTextColor = isDark ? 'text-[#FAF5ED]' : 'text-[#3A2721]';
  const accentTextColor = isDark ? 'text-[#D88D6A]' : 'text-[#A96345]';
  const subtitleColor = isDark ? 'text-[#FAF5ED]/70' : 'text-[#657258]';
  const badgeBorderColor = isDark
    ? 'border-[#FAF5ED]/20 bg-[#3A2721]'
    : 'border-[#3A2721]/15 bg-[#FAF5ED]';

  // Standalone Official Mark
  const VectorMark = (
    <div
      className={`relative ${sizeMap.mark} rounded-xl flex items-center justify-center border ${badgeBorderColor} shadow-xs shrink-0 p-1 transition-transform duration-300 group-hover:scale-105 ${
        isDark ? 'bg-[#3A2721]' : 'bg-[#FAF5ED]'
      }`}
    >
      <OfficialLogoIcon className="w-full h-full object-contain" />
    </div>
  );

  // Full Emblem Variant with official high-res logo
  if (variant === 'emblem' || variant === 'official') {
    return (
      <div
        onClick={onClick}
        className={`group inline-flex items-center ${sizeMap.gap} select-none cursor-pointer ${className}`}
      >
        <div
          className={`relative ${sizeMap.mark} rounded-xl overflow-hidden border ${badgeBorderColor} shadow-xs shrink-0 p-1 transition-transform duration-300 group-hover:scale-105 ${
            isDark ? 'bg-[#3A2721]' : 'bg-[#FAF5ED]'
          } flex items-center justify-center`}
        >
          <img
            src={nbLogoPng}
            alt="NutriBake Official Logo"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {showSubtitle && (
          <div className="flex flex-col text-left">
            <div className="flex items-baseline gap-1.5">
              <span
                className={`font-serif ${sizeMap.text} tracking-[-0.02em] font-normal ${primaryTextColor} leading-none transition-colors group-hover:text-[#A96345]`}
              >
                Nutri<span className={`italic font-light ${accentTextColor} pl-0.5`}>Bake</span>
              </span>
              <span className="font-mono text-[8.5px] uppercase tracking-wider font-semibold text-[#657258] bg-[#657258]/10 border border-[#657258]/25 px-1.5 py-0.5 rounded-xs">
                OFFICIAL
              </span>
            </div>
            <span
              className={`font-sans text-[8.5px] uppercase tracking-luxury font-semibold ${subtitleColor} mt-1`}
            >
              Therapeutic Nutrition & Confectionery Lab
            </span>
          </div>
        )}
      </div>
    );
  }

  // Standalone Mark
  if (variant === 'mark') {
    return (
      <div
        onClick={onClick}
        className={`group inline-flex items-center justify-center cursor-pointer ${className}`}
        title="NutriBake Official Insignia"
      >
        {VectorMark}
      </div>
    );
  }

  // Circular Artisan Bakery Stamp/Seal featuring the official logo
  if (variant === 'stamp') {
    return (
      <div
        onClick={onClick}
        className={`group relative ${sizeMap.stamp} rounded-full border border-dashed ${
          isDark ? 'border-[#D88D6A]/50 bg-[#3A2721]' : 'border-[#A96345]/50 bg-[#FAF5ED]'
        } p-1 flex items-center justify-center text-center cursor-pointer shadow-xs transition-transform duration-300 hover:rotate-6 ${className}`}
      >
        <div className="w-full h-full rounded-full border border-[#3A2721]/15 flex flex-col items-center justify-center p-1 bg-[#FAF5ED]">
          <div className="w-6 h-6 shrink-0 mb-0.5">
            <OfficialLogoIcon className="w-full h-full object-contain" strokeWidth={5.5} />
          </div>
          <span className={`font-display text-[9px] font-semibold ${primaryTextColor} leading-none`}>
            NUTRI<span className={accentTextColor}>BAKE</span>
          </span>
          <span className={`font-mono text-[6px] uppercase tracking-editorial ${subtitleColor} mt-0.5`}>
            OFFICIAL · 2025
          </span>
        </div>
      </div>
    );
  }

  // Full Brand Logo (Official Logo Mark + Typography)
  return (
    <div
      onClick={onClick}
      className={`group inline-flex items-center ${sizeMap.gap} select-none cursor-pointer ${className}`}
      aria-label="NutriBake — Therapeutic Nutrition & Confectionery Laboratory"
    >
      {VectorMark}

      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-serif ${sizeMap.text} tracking-[-0.02em] font-normal ${primaryTextColor} leading-none transition-colors group-hover:text-[#A96345]`}
          >
            Nutri<span className={`italic font-light ${accentTextColor} pl-0.5`}>Bake</span>
          </span>
          <span
            className="font-mono text-[8.5px] uppercase tracking-wider font-semibold text-[#657258] hidden sm:inline-block bg-[#657258]/10 border border-[#657258]/25 px-1.5 py-0.5 rounded-xs"
          >
            LAB
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`font-sans text-[8.5px] sm:text-[9.5px] uppercase tracking-luxury font-semibold ${subtitleColor} mt-1`}
          >
            Therapeutic Nutrition & Confectionery Lab
          </span>
        )}
      </div>
    </div>
  );
};
