import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../products/ProductCard';
import { DailyIntakeTracker } from './DailyIntakeTracker';
import { SampleOrdersManager } from './SampleOrdersManager';
import { FamilyProfileManager } from './FamilyProfileManager';
import { DietarySettingsEditor } from './DietarySettingsEditor';
import { TastingNoteModal } from './TastingNoteModal';
import { 
  Heart, 
  ArrowRight, 
  LogOut, 
  Sparkles, 
  Activity, 
  Package, 
  Users, 
  Sliders, 
  Star, 
  MessageSquarePlus, 
  CheckCircle, 
  ShieldCheck,
  Wheat,
  Plus,
  Search,
  Truck,
  ChevronDown
} from 'lucide-react';
import { Product } from '../../types';

export const UserDashboard: React.FC = () => {
  const { 
    user, 
    products, 
    savedProductIds, 
    toggleSaveProduct,
    dailyIntakeLogs,
    sampleOrders,
    familyProfiles,
    productTastingNotes,
    navigateTo, 
    setUser, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'intake' | 'samples' | 'saved' | 'family' | 'settings'
  >('overview');

  const [selectedProductForNote, setSelectedProductForNote] = useState<Product | null>(null);
  const [productCategoryFilter, setProductCategoryFilter] = useState<'all' | 'cupcakes' | 'cookies' | 'nutriballs'>('all');
  const [productSearch, setProductSearch] = useState('');

  if (!user) {
    return (
      <div className="py-12 sm:py-24 px-4 sm:px-6 max-w-md mx-auto text-center space-y-5 sm:space-y-6 w-full">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-[#657258] block">
          Client Portal
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3A2721]">Sign In</h2>
        <p className="text-xs sm:text-sm text-[#29211E]/75 leading-relaxed">
          Access your saved formulations, dietary targets, and personalized bakery pairings.
        </p>
        <button
          onClick={() => {
            setUser({
              id: 'u-1',
              name: 'Dr. Sarah Lin',
              email: 'sarah.lin@example.com',
              role: 'user',
              savedProductIds: ['prod-cupcakes', 'prod-cookies', 'prod-nutriballs'],
              savedProducts: ['prod-cupcakes', 'prod-cookies', 'prod-nutriballs'],
              dailyFiberGoalGrams: 28,
              currentFiberIntakeGrams: 18.6,
              recommendationHistoryCount: 4,
              memberSince: 'March 2026',
              preferences: {
                dailyFiberTargetGrams: 28,
                dietaryGoal: 'High Fiber & Gut Vitality',
                allergens: []
              }
            });
            addToast('Welcome Back', 'Signed in as Dr. Sarah Lin', 'success');
          }}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-xs uppercase tracking-[0.14em] font-medium transition-colors"
        >
          Sign In (Demo Account)
        </button>
      </div>
    );
  }

  const savedProductsList = products.filter(p => savedProductIds.includes(p.id));
  const recommendedProducts = products.filter(p => p.isFeatured).slice(0, 3);
  
  // Filter products for client view-only tab
  const filteredUserProducts = products.filter(p => {
    const matchesCat = productCategoryFilter === 'all' || p.category.toLowerCase() === productCategoryFilter;
    const matchesSearch = 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.mainFunctionalIngredient.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(productSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });
  
  // Calculate aggregate daily stats
  const targetFiber = user.preferences?.dailyFiberTargetGrams || user.dailyFiberGoalGrams || 28;
  const currentFiber = dailyIntakeLogs.reduce((acc, log) => acc + log.fiberGrams, 0);
  const currentRS = dailyIntakeLogs.reduce((acc, log) => acc + log.resistantStarchGrams, 0);
  const totalSavedFiber = savedProductsList.reduce((acc, p) => acc + p.nutrition.dietaryFiberGrams, 0);
  const fiberPct = Math.min(100, Math.round((currentFiber / targetFiber) * 100));

  return (
    <div className="py-4 sm:py-8 px-3 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto space-y-5 sm:space-y-8 min-h-[calc(100vh-65px)] flex flex-col w-full overflow-x-hidden">
      {/* Header Profile Strip */}
      <div className="card-soft bg-white/90 rounded-2xl sm:rounded-3xl border border-[#E8DDCF] p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 shadow-[0_8px_30px_rgba(61,38,30,0.04)]">
        <div className="space-y-2 min-w-0 max-w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-[9.5px] sm:text-[11px] uppercase tracking-wider font-bold text-[#5E7252] bg-[#EEF3EB] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#D4E0CD]">
              🌾 Verified Research Participant
            </span>
            <span className="text-[9.5px] sm:text-[11px] font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#FAF0E4] text-[#C97D36] border border-[#E8DDCF]">
              Member since {user.memberSince || '2026'}
            </span>
          </div>
          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl text-[#3D261E] font-normal tracking-tight break-words">
            Welcome, {user.name}
          </h1>
          <p className="text-xs sm:text-[13px] text-[#2A1F1B]/75 break-words">
            {user.email} • Protocol: <span className="font-semibold text-[#3D261E]">{user.preferences?.dietaryGoal || user.dietaryPreference || 'High Fiber & Gut Vitality'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8DDCF]/60">
          <button
            onClick={() => setActiveTab('settings')}
            className="btn-sweet flex-1 sm:flex-initial min-h-[38px] px-4 sm:px-5 py-2 sm:py-2.5 bg-[#3D261E] hover:bg-[#C97D36] text-[#FAF7F2] text-xs font-semibold rounded-full shadow-xs transition-all text-center justify-center"
          >
            Edit Protocol
          </button>
          <button
            onClick={() => {
              setUser(null);
              navigateTo('home');
            }}
            className="btn-sweet flex-1 sm:flex-initial min-h-[38px] px-3.5 sm:px-4 py-2 sm:py-2.5 border border-[#E6D9CC] text-[#3D261E] bg-white hover:bg-[#FAF0E4] text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Subtabs Bar with Mobile Dropdown & Horizontal Pills */}
      <div className="space-y-2">
        {/* Mobile Dropdown Navigator (< 640px) */}
        <div className="block sm:hidden w-full">
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="w-full bg-white/95 border border-[#E8DDCF] rounded-xl py-2.5 pl-3.5 pr-10 text-xs font-semibold text-[#3D261E] shadow-2xs appearance-none focus:outline-none focus:border-[#C97D36]"
              aria-label="Select User Panel Section"
            >
              <option value="overview">✨ Overview & Snapshot</option>
              <option value="products">🌾 Available Products ({products.length})</option>
              <option value="intake">📊 Daily Fiber Tracker ({dailyIntakeLogs.length})</option>
              <option value="saved">❤️ Saved Formulations ({savedProductsList.length})</option>
              <option value="samples">📦 Sample Orders ({sampleOrders.length})</option>
              <option value="family">👥 Family Profiles ({familyProfiles.length})</option>
              <option value="settings">⚙️ Dietary Settings & Clinical Report</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#3D261E]">
              <ChevronDown className="w-4 h-4 text-[#C97D36]" />
            </div>
          </div>
        </div>

        {/* Sweet Pill Navigation Subtabs Bar (Horizontal scroll on mobile/tablet/desktop) */}
        <div className="w-full overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-full border border-[#E8DDCF] shadow-2xs min-w-max">
            <button
              onClick={() => setActiveTab('overview')}
              className={`shrink-0 min-h-[38px] sm:min-h-[40px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-[#3D261E] text-white shadow-xs'
                  : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`shrink-0 min-h-[38px] sm:min-h-[40px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-[#3D261E] text-white shadow-xs'
                  : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'
              }`}
            >
              <Wheat className="w-3.5 h-3.5 text-[#C97D36]" />
              <span>Available Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('intake')}
              className={`shrink-0 min-h-[38px] sm:min-h-[40px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'intake'
                  ? 'bg-[#3D261E] text-white shadow-xs'
                  : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#5E7252]" />
              <span>Daily Fiber Tracker ({dailyIntakeLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`shrink-0 min-h-[38px] sm:min-h-[40px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'saved'
                  ? 'bg-[#3D261E] text-white shadow-xs'
                  : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#C86B52]" />
              <span>Saved Formulations ({savedProductsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('samples')}
              className={`shrink-0 min-h-[38px] sm:min-h-[40px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'samples'
                  ? 'bg-[#3D261E] text-white shadow-xs'
                  : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#C97D36]" />
              <span>Sample Orders ({sampleOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('family')}
              className={`shrink-0 min-h-[38px] sm:min-h-[40px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'family'
                  ? 'bg-[#3D261E] text-white shadow-xs'
                  : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#5E7252]" />
              <span>Family Profiles ({familyProfiles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`shrink-0 min-h-[38px] sm:min-h-[40px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-[#3D261E] text-white shadow-xs'
                  : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Dietary Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 sm:space-y-12 animate-in fade-in duration-200">
          {/* Daily Quick Snapshot in Soft Rounded Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="card-soft p-4 sm:p-6 bg-white/90 rounded-2xl sm:rounded-3xl border border-[#E8DDCF] space-y-3.5 shadow-xs">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-[#5E7252] bg-[#EEF3EB] px-2.5 sm:px-3 py-0.5 rounded-full inline-block">
                Today's Fiber Intake
              </span>
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <span className="font-serif text-3xl sm:text-4xl text-[#3D261E]">{currentFiber.toFixed(1)}g</span>
                <span className="text-xs font-bold text-[#5E7252]">{fiberPct}% of {targetFiber}g goal</span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF0E4] rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-[#5E7252] to-[#8FA583] rounded-full transition-all duration-500" style={{ width: `${fiberPct}%` }} />
              </div>
              <div className="pt-2 flex justify-between items-center text-xs gap-2 flex-wrap">
                <span className="text-[#2A1F1B]/65 font-medium truncate">{dailyIntakeLogs.length} logged treat{dailyIntakeLogs.length !== 1 ? 's' : ''}</span>
                <button
                  onClick={() => setActiveTab('intake')}
                  className="btn-sweet shrink-0 px-3 py-1 bg-[#FAF7F2] text-[#3D261E] hover:bg-[#3D261E] hover:text-white rounded-full text-[11px] font-semibold border border-[#E6D9CC]"
                >
                  Log Daily Intake →
                </button>
              </div>
            </div>

            <div className="card-soft p-4 sm:p-6 bg-white/90 rounded-2xl sm:rounded-3xl border border-[#E8DDCF] space-y-3.5 shadow-xs">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-[#C97D36] bg-[#FDF1EB] px-2.5 sm:px-3 py-0.5 rounded-full inline-block">
                Resistant Starch (RS2)
              </span>
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <span className="font-serif text-3xl sm:text-4xl text-[#C97D36]">{currentRS.toFixed(1)}g</span>
                <span className="text-xs text-[#2A1F1B]/70 font-semibold">Prebiotic Butyrate</span>
              </div>
              <p className="text-xs text-[#2A1F1B]/75 leading-relaxed break-words">
                Green banana RS2 reaches the large intestine intact, feeding beneficial microflora without spiking glucose.
              </p>
              <div className="pt-2 flex justify-between items-center text-xs gap-2 flex-wrap">
                <span className="text-[#5E7252] font-bold">100% Functional</span>
                <button
                  onClick={() => navigateTo('science')}
                  className="btn-sweet shrink-0 px-3 py-1 bg-[#FAF7F2] text-[#3D261E] hover:bg-[#3D261E] hover:text-white rounded-full text-[11px] font-semibold border border-[#E6D9CC]"
                >
                  Read Science →
                </button>
              </div>
            </div>

            <div className="card-soft p-4 sm:p-6 bg-white/90 rounded-2xl sm:rounded-3xl border border-[#E8DDCF] space-y-3.5 shadow-xs md:col-span-2 lg:col-span-1">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-[#3D261E] bg-[#FAF0E4] px-2.5 sm:px-3 py-0.5 rounded-full inline-block">
                Trial Sample Orders
              </span>
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <span className="font-serif text-3xl sm:text-4xl text-[#3D261E]">{sampleOrders.length}</span>
                <span className="text-xs font-bold text-[#5E7252]">Parcels Active</span>
              </div>
              <p className="text-xs text-[#2A1F1B]/75 leading-relaxed break-words">
                {sampleOrders[0] 
                  ? `Latest: ${sampleOrders[0].orderNumber} (${sampleOrders[0].status})`
                  : 'Fresh laboratory sample batches ready to taste.'}
              </p>
              <div className="pt-2 flex justify-between items-center text-xs gap-2 flex-wrap">
                <span className="text-[#2A1F1B]/60 font-medium">Jamshoro Dispatch</span>
                <button
                  onClick={() => setActiveTab('samples')}
                  className="btn-sweet shrink-0 px-3 py-1 bg-[#FAF7F2] text-[#3D261E] hover:bg-[#3D261E] hover:text-white rounded-full text-[11px] font-semibold border border-[#E6D9CC]"
                >
                  Track Parcels →
                </button>
              </div>
            </div>
          </div>

          {/* Recommended Formulations */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#3A2721]/15">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
                  Metabolic Matching
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#3A2721] font-normal tracking-snug-title break-words">
                  Recommended For Your Profile
                </h3>
              </div>
              <button
                onClick={() => navigateTo('recommendations')}
                className="group inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-editorial font-semibold text-[#3A2721] hover:text-[#A96345] transition-colors self-start sm:self-auto"
              >
                <span>Retake Questionnaire</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: AVAILABLE PRODUCTS (STRICTLY VIEW-ONLY) */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#3A2721]/15 pb-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#5E7252] block">
                Bakery Catalog
              </span>
              <h3 className="font-serif text-xl sm:text-3xl text-[#3D261E] font-normal tracking-tight break-words">
                Available Functional Bakery Products
              </h3>
              <p className="text-xs text-[#2A1F1B]/70 mt-1 break-words">
                Explore our full line of functional baked goods with verified prebiotic resistant starch and fiber contents.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#5E7252] font-semibold bg-[#EEF3EB] px-3 py-1.5 rounded-full border border-[#D4E0CD] self-start sm:self-auto shrink-0">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Client View-Only Catalog</span>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A1F1B]/50 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, ingredients, or taglines..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white rounded-xl border border-[#E8DDCF] text-xs text-[#2A1F1B] placeholder-[#2A1F1B]/40 focus:outline-none focus:border-[#C97D36]"
              />
              {productSearch && (
                <button
                  type="button"
                  onClick={() => setProductSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#2A1F1B]/40 hover:text-[#2A1F1B] p-1 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="w-full sm:w-auto overflow-x-auto flex items-center gap-1.5 p-1 bg-white/70 rounded-xl border border-[#E8DDCF] shrink-0 [scrollbar-width:none]">
              {(['all', 'cupcakes', 'cookies', 'nutriballs'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProductCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all flex-1 sm:flex-initial text-center ${
                    productCategoryFilter === cat
                      ? 'bg-[#3D261E] text-white shadow-2xs'
                      : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredUserProducts.length === 0 ? (
            <div className="bg-white/80 rounded-2xl sm:rounded-3xl border border-[#E8DDCF] p-8 sm:p-12 text-center space-y-3 shadow-xs">
              <Wheat className="w-7 h-7 text-[#C97D36]/60 mx-auto" />
              <p className="font-serif text-lg sm:text-xl text-[#3D261E]">No products match your search.</p>
              <p className="text-xs text-[#2A1F1B]/70 max-w-sm mx-auto leading-relaxed">
                Try clearing your search query or switching category filters.
              </p>
              <button
                onClick={() => { setProductSearch(''); setProductCategoryFilter('all'); }}
                className="btn-sweet mt-2 px-5 py-2 bg-[#3D261E] hover:bg-[#C97D36] text-white text-xs font-semibold rounded-full shadow-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredUserProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DAILY INTAKE TRACKER */}
      {activeTab === 'intake' && (
        <DailyIntakeTracker />
      )}

      {/* TAB 3: SAVED FORMULATIONS & TASTING JOURNAL */}
      {activeTab === 'saved' && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#3A2721]/15 pb-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
                Curated Formulations
              </span>
              <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#3A2721] font-normal tracking-snug-title break-words">
                Saved Formulations & Sensory Notes ({savedProductsList.length})
              </h3>
              <p className="font-mono text-xs text-[#29211E]/70 mt-1 break-words">
                Your personal favorites with recorded tasting feedback and gastrointestinal notes.
              </p>
            </div>

            <button
              onClick={() => navigateTo('products')}
              className="btn-sweet px-4 sm:px-5 py-2 sm:py-2.5 bg-[#3D261E] hover:bg-[#C97D36] text-[#FAF7F2] text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2 self-start sm:self-auto shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Browse All Formulations</span>
            </button>
          </div>

          {savedProductsList.length === 0 ? (
            <div className="bg-white/80 rounded-2xl sm:rounded-3xl border border-[#E8DDCF] p-8 sm:p-12 text-center space-y-3 shadow-xs">
              <Heart className="w-7 h-7 text-[#C86B52]/60 mx-auto" />
              <p className="font-serif text-lg sm:text-xl text-[#3D261E]">No saved formulations yet.</p>
              <p className="text-xs text-[#2A1F1B]/70 max-w-sm mx-auto leading-relaxed">
                Bookmark items from our research bakery catalog to save their nutritional profiles and record your tasting notes.
              </p>
              <button
                onClick={() => navigateTo('products')}
                className="btn-sweet mt-2 px-6 py-2.5 bg-[#3D261E] hover:bg-[#C97D36] text-[#FAF7F2] text-xs font-semibold rounded-full shadow-xs"
              >
                Browse Bakery Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {savedProductsList.map((product) => {
                const userNote = productTastingNotes[product.id];
                return (
                  <div key={product.id} className="card-soft flex flex-col bg-white rounded-3xl border border-[#E8DDCF] overflow-hidden shadow-xs hover:shadow-md transition-all">
                    <ProductCard product={product} />

                    {/* Tasting Notes Strip */}
                    <div className="p-3.5 sm:p-4 bg-[#FAF7F2] border-t border-[#F0E6DA] space-y-2 mt-auto">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] sm:text-[10.5px] uppercase font-bold text-[#5E7252]">
                          My Sensory Notes:
                        </span>
                        <button
                          onClick={() => setSelectedProductForNote(product)}
                          className="btn-sweet text-xs text-[#C97D36] hover:text-[#3D261E] font-bold flex items-center gap-1 shrink-0"
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                          <span>{userNote ? 'Edit Review' : '+ Add Notes'}</span>
                        </button>
                      </div>

                      {userNote ? (
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1 text-[#C97D36] flex-wrap">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  className={`w-3.5 h-3.5 ${
                                    s <= userNote.rating ? 'fill-[#C97D36]' : 'text-[#3D261E]/20'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-[#2A1F1B]/60 ml-1">
                              • {userNote.date}
                            </span>
                          </div>
                          <p className="text-xs text-[#2A1F1B]/80 italic line-clamp-2 break-words">
                            "{userNote.notes}"
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-[#2A1F1B]/60 break-words">
                          No tasting review logged yet. Click to record flavor and digestion notes.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SAMPLE ORDERS */}
      {activeTab === 'samples' && (
        <SampleOrdersManager />
      )}

      {/* TAB 5: FAMILY PROFILES */}
      {activeTab === 'family' && (
        <FamilyProfileManager />
      )}

      {/* TAB 6: SETTINGS & CLINICAL REPORT */}
      {activeTab === 'settings' && (
        <DietarySettingsEditor />
      )}

      {/* Tasting Modal */}
      {selectedProductForNote && (
        <TastingNoteModal
          product={selectedProductForNote}
          isOpen={!!selectedProductForNote}
          onClose={() => setSelectedProductForNote(null)}
        />
      )}
    </div>
  );
};
