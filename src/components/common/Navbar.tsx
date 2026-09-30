import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Menu, X, User, LogOut, LayoutDashboard, ShieldAlert, Heart, Sparkles } from 'lucide-react';
import { ViewMode } from '../../types';
import { ThemeLogo } from './ThemeLogo';

export const Navbar: React.FC = () => {
  const { 
    viewMode, 
    setSearchOpen, 
    user, 
    setUser, 
    navigateTo,
    savedProductIds,
    websiteContent
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isPanelMode = viewMode === 'admin' || viewMode === 'dashboard';
  const announcement = websiteContent?.announcementBanner;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; mode: ViewMode }[] = [
    { label: 'Products', mode: 'products' },
    { label: 'Nutrition', mode: 'nutrition' },
    { label: 'Recommendations', mode: 'recommendations' },
    { label: 'About', mode: 'about' },
  ];

  const handleNavClick = (mode: ViewMode) => {
    navigateTo(mode);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <>
      {/* Warm Announcement Ribbon - ONLY rendered on public pages, NOT in Admin/User Panels */}
      {!isPanelMode && announcement?.enabled !== false && (
        <aside aria-label="Announcement" className="bg-[#3D261E] text-[#FAF7F2] py-1.5 px-4 text-center text-[11px] font-sans font-medium tracking-wide flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 text-[#E49A44]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{announcement?.badge || 'Warmly Baked with Love'}</span>
          </span>
          <span className="hidden sm:inline text-[#FAF7F2]/40">•</span>
          <span className="hidden sm:inline text-[#FAF7F2]/85">
            {announcement?.message || 'Type-2 Prebiotic Banana Starch & California Almonds'}
          </span>
          <span className="text-[#FAF7F2]/40">•</span>
          <button 
            onClick={() => handleNavClick('family')}
            className="text-[#E49A44] hover:text-[#FAF7F2] underline underline-offset-2 transition-colors font-semibold"
          >
            {announcement?.linkText || 'Family & Kids Treats →'}
          </button>
        </aside>
      )}

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6D9CC]/70 py-2.5 shadow-[0_4px_24px_-6px_rgba(61,38,30,0.06)]'
            : isPanelMode
              ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DDCF] py-3.5 shadow-2xs'
              : 'bg-[#FAF7F2]/90 py-4 border-b border-transparent'
        }`}
      >
        <div className={`max-w-7xl mx-auto px-3.5 sm:px-8 lg:px-12 flex items-center ${isPanelMode ? 'justify-start' : 'justify-between'}`}>
          {/* Left: Brand Wordmark with Theme Logo Design - Kept for all pages */}
          <button
            onClick={() => handleNavClick('home')}
            className="group flex items-center text-left focus:outline-none transition-transform hover:scale-[1.01]"
            aria-label="NutriBake Home"
          >
            <ThemeLogo variant="full" size="md" showSubtitle={false} />
          </button>

          {/* Center & Right Navigation & Controls - ONLY rendered on public pages, NOT in Admin/User Panels */}
          {!isPanelMode && (
            <>
              {/* Center: Soft Pill Navigation Links */}
              <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-[#E5D4C0] p-1 sm:p-1.5 rounded-full border border-[#D1BFA9] shadow-[inset_0_1px_2px_rgba(61,38,30,0.06)]">
                {navLinks.map((link) => {
                  const isActive = viewMode === link.mode;
                  return (
                    <button
                      key={link.mode}
                      onClick={() => handleNavClick(link.mode)}
                      className={`text-[11.5px] lg:text-xs px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full transition-all font-medium whitespace-nowrap ${
                        isActive
                          ? 'bg-[#3D261E] text-[#FAF7F2] font-semibold shadow-xs'
                          : 'text-[#3D261E]/80 hover:text-[#3D261E] hover:bg-[#FAF7F2] shadow-2xs'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </nav>

              {/* Right: Controls & Sweet Tactile CTAs */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Search Pill Button - Visible only on Desktop (lg and up) */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="hidden lg:flex p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/70 hover:bg-white border border-[#E6D9CC]/80 text-[#3D261E]/75 hover:text-[#3D261E] transition-all items-center gap-1.5 text-xs shadow-2xs"
                  title="Search treats and nutrients"
                  aria-label="Search products and nutrients"
                >
                  <Search className="w-3.5 h-3.5 stroke-[1.8]" />
                  <span className="text-[11.5px] text-[#2A1F1B]/60">Search treats...</span>
                </button>

                {/* Loved Treats Heart Button with Sweet Badge - Visible on Navbar for All Screen Sizes */}
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="relative p-2 rounded-full bg-white/70 hover:bg-[#FDF1EB] border border-[#E6D9CC]/80 text-[#3D261E] transition-all hover:scale-105 active:scale-95 shadow-2xs group flex items-center justify-center"
                  title="View your saved treats"
                  aria-label={`View your ${savedProductIds.length} saved treats`}
                >
                  <Heart className={`w-4 h-4 ${savedProductIds.length > 0 ? 'text-[#C86B52] fill-[#C86B52]' : 'text-[#3D261E]/70 group-hover:text-[#C86B52]'}`} />
                  {savedProductIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#C86B52] text-white text-[9.5px] font-bold flex items-center justify-center shadow-xs">
                      {savedProductIds.length}
                    </span>
                  )}
                </button>

                {/* S Icon / User Profile - Visible only on Desktop (lg and up) */}
                {user ? (
                  <div className="relative hidden lg:block">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="w-8 h-8 rounded-full bg-[#3D261E] text-[#FAF7F2] flex items-center justify-center text-xs font-serif font-medium hover:bg-[#C97D36] transition-all shadow-xs"
                      aria-label="Account options"
                    >
                      {user.name.charAt(0)}
                    </button>

                    {userDropdownOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-[#E6D9CC] py-2 z-50 shadow-xl text-left animate-in fade-in slide-in-from-top-2 duration-200"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-[#F4ECE2]">
                          <p className="text-xs font-semibold text-[#3D261E] truncate">{user.name}</p>
                          <p className="text-[10px] text-[#5E7252] font-medium capitalize mt-0.5">🌱 {user.role} Portal</p>
                        </div>
                        <button
                          onClick={() => handleNavClick('dashboard')}
                          className="w-full text-left px-4 py-2.5 text-xs text-[#2A1F1B] hover:bg-[#FAF7F2] flex items-center gap-2.5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#C97D36]" />
                          <span>User Panel & Logs</span>
                        </button>
                        {user.role === 'admin' && (
                          <button
                            onClick={() => handleNavClick('admin')}
                            className="w-full text-left px-4 py-2.5 text-xs text-[#2A1F1B] hover:bg-[#FAF7F2] flex items-center gap-2.5 transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4 text-[#3D261E]" />
                            <span>Laboratory Admin</span>
                          </button>
                        )}
                        <div className="border-t border-[#F4ECE2] my-1" />
                        <button
                          onClick={() => {
                            setUser(null);
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavClick('login')}
                    className="text-xs font-medium text-[#2A1F1B]/80 hover:text-[#3D261E] transition-colors hidden lg:block px-2.5 py-1.5"
                  >
                    Sign In
                  </button>
                )}

                {/* Sweet Primary CTA Pill Button - Visible only on Desktop (lg and up) */}
                <button
                  onClick={() => handleNavClick('recommendations')}
                  className="hidden lg:inline-flex btn-sweet px-4 sm:px-5 py-2 bg-[#3D261E] hover:bg-[#C97D36] text-[#FAF7F2] text-xs font-semibold tracking-wide transition-all items-center gap-1.5 shadow-sm"
                >
                  <span>Get Started</span>
                  <span aria-hidden="true">→</span>
                </button>

                {/* Menu Toggle Button - Visible on Mobile & Tablet (hidden only on lg and up) */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 rounded-full hover:bg-black/5 lg:hidden text-[#3D261E] transition-colors"
                  aria-label="Toggle Navigation"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile & Tablet Drawer - ONLY rendered on public pages, NOT in Admin/User Panels */}
        {!isPanelMode && mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E6D9CC] bg-[#FAF7F2] px-5 py-5 space-y-3.5 rounded-b-3xl shadow-lg animate-in slide-in-from-top-3">
            {/* 1. Search Button in Menu */}
            <button
              onClick={() => {
                setSearchOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-2xl bg-white/85 hover:bg-white border border-[#E6D9CC] text-xs font-medium text-[#3D261E] shadow-2xs transition-all text-left"
              aria-label="Search treats and nutrients"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#3D261E]/75 stroke-[1.8]" />
                <span className="text-[#2A1F1B]/75">Search treats & nutrients...</span>
              </div>
              <span className="text-[10px] text-[#C97D36] font-medium uppercase tracking-wider">Search</span>
            </button>

            {/* Main Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.mode}
                  onClick={() => handleNavClick(link.mode)}
                  className={`block w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-medium transition-all ${
                    viewMode === link.mode ? 'bg-white text-[#C97D36] font-semibold shadow-2xs' : 'text-[#2A1F1B]/80 hover:bg-white/60'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* 2. S Icon & Account / Authentication */}
            <div className="pt-2 border-t border-[#E6D9CC]/70 space-y-2">
              {user ? (
                <div className="p-3 bg-white/90 rounded-2xl border border-[#E6D9CC] space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {/* S Icon Avatar Badge */}
                      <div className="w-8 h-8 rounded-full bg-[#3D261E] text-[#FAF7F2] flex items-center justify-center text-xs font-serif font-medium shadow-2xs shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#3D261E]">{user.name}</p>
                        <p className="text-[10px] text-[#5E7252] font-medium capitalize">🌱 {user.role} Portal</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUser(null);
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs text-rose-700 hover:text-rose-800 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                  <div className={`grid ${user.role === 'admin' ? 'grid-cols-2' : 'grid-cols-1'} gap-2 pt-2 border-t border-[#F4ECE2]`}>
                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EAE0] text-xs text-[#2A1F1B] transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#C97D36]" />
                      <span className="truncate">User Panel & Logs</span>
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EAE0] text-xs text-[#2A1F1B] transition-colors"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-[#3D261E]" />
                        <span className="truncate">Lab Admin</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-2xl bg-white/85 hover:bg-white border border-[#E6D9CC] text-xs font-medium text-[#2A1F1B] shadow-2xs transition-all text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#E5D4C0] text-[#3D261E] flex items-center justify-center text-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span>Sign In to Account</span>
                  </div>
                  <span className="text-xs text-[#C97D36]">→</span>
                </button>
              )}
            </div>

            {/* 3. Get Started Button in Menu */}
            <div className="pt-2 border-t border-[#E6D9CC]">
              <button
                onClick={() => handleNavClick('recommendations')}
                className="btn-sweet w-full py-3 bg-[#3D261E] hover:bg-[#C97D36] text-[#FAF7F2] text-xs font-semibold tracking-wide transition-all inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Get Started</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
