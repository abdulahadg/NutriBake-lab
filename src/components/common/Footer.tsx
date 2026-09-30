import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import { ThemeLogo } from './ThemeLogo';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  const links: { label: string; mode: ViewMode }[] = [
    { label: 'Products', mode: 'products' },
    { label: 'Nutrition', mode: 'nutrition' },
    { label: 'Recommendations', mode: 'recommendations' },
    { label: 'About', mode: 'about' },
    { label: 'Contact', mode: 'contact' },
  ];

  return (
    <footer className="bg-[#29211E] text-[#FAF5ED] py-8 sm:py-10 border-t border-[#3A2721]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-6 sm:space-y-8">
        {/* Editorial Top Section */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-6 sm:pb-8 border-b border-[#FAF5ED]/10">
          <div className="space-y-3 max-w-lg">
            <ThemeLogo
              variant="full"
              theme="dark"
              size="lg"
              onClick={() => navigateTo('home')}
            />
            <p className="text-xs sm:text-sm text-[#FAF5ED]/70 leading-relaxed font-normal pt-1">
              Functional bakery products crafted with thoughtful ingredients, prebiotic dietary fiber, and authentic craftsmanship. Specializing in gut-friendly cupcakes, cookies, and nutriballs.
            </p>
          </div>

          {/* Parallel Columns: Tabs and Portals */}
          <div className="flex flex-row flex-wrap sm:flex-nowrap gap-10 sm:gap-16">
            {/* Column 1: Tabs */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A96345] block">
                Tabs
              </span>
              <nav className="flex flex-col gap-2 text-[12px] font-medium text-[#FAF5ED]/80">
                {links.map((link) => (
                  <button
                    key={link.mode}
                    onClick={() => navigateTo(link.mode)}
                    className="text-left hover:text-[#FAF5ED] transition-colors py-0.5"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Column 2: Portals */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A96345] block">
                Portals
              </span>
              <div className="flex flex-col gap-2 text-[12px] font-medium text-[#FAF5ED]/80">
                <button
                  onClick={() => navigateTo('dashboard')}
                  className="text-left hover:text-[#FAF5ED] transition-colors py-0.5"
                >
                  User Portal
                </button>
                <button
                  onClick={() => navigateTo('admin')}
                  className="text-left hover:text-[#FAF5ED] transition-colors py-0.5"
                >
                  Admin Portal
                </button>
                <button
                  onClick={() => navigateTo('about')}
                  className="text-left hover:text-[#FAF5ED] transition-colors py-0.5"
                >
                  Academic Leadership
                </button>
                <a 
                  href="mailto:hello@nutribake.com"
                  className="text-left hover:text-[#FAF5ED] transition-colors py-0.5"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Line at the Bottom */}
        <div className="pt-2">
          <p className="text-[11.5px] text-[#FAF5ED]/60">
            © {new Date().getFullYear()} NutriBake · Nutrition Meets Baking. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
