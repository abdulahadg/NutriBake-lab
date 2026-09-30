import React from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { resolveProductImageUrl } from '../../lib/supabase';
import { 
  Layers, 
  Package, 
  Award, 
  Bell, 
  Users, 
  Database, 
  BarChart2, 
  Globe, 
  Calculator, 
  Plus, 
  ArrowRight, 
  Edit3, 
  Eye,
  CheckCircle2,
  Clock,
  FlaskConical,
  ShieldCheck
} from 'lucide-react';

interface AllOverviewProps {
  onNavigateTab: (
    tab:
      | 'all'
      | 'formulations'
      | 'website-content'
      | 'team'
      | 'sensory-trials'
      | 'rs2-calculator'
      | 'sample-orders'
      | 'alerts'
      | 'users'
      | 'database'
      | 'analytics'
  ) => void;
  onOpenNewFormulation?: () => void;
  onEditProduct?: (product: Product) => void;
}

export const AllOverview: React.FC<AllOverviewProps> = ({
  onNavigateTab,
  onOpenNewFormulation,
  onEditProduct
}) => {
  const {
    products,
    openProductDetail,
    sampleOrders,
    sensoryTrials,
    alerts,
    profilesList,
    websiteContent
  } = useApp();

  const pendingOrdersCount = sampleOrders.filter(
    o => o.status === 'Pending Formulation' || o.status === 'Lab Blended'
  ).length;

  const avgSensoryScore = sensoryTrials.length > 0
    ? (sensoryTrials.reduce((sum, t) => sum + (t.overallAcceptability || t.hedonicScale9 || 8), 0) / sensoryTrials.length).toFixed(0)
    : '95';

  const adminCount = profilesList.filter(p => p.role === 'admin').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. WELCOME & OVERVIEW METRIC CARDS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DDCF] pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#3D261E] font-normal tracking-tight">
              Dashboard Overview
            </h2>
            <p className="text-xs text-[#2A1F1B]/60 mt-1">
              Real-time summary of active products, pending dispatches, sensory trials, and user accounts.
            </p>
          </div>

          {onOpenNewFormulation && (
            <button
              onClick={onOpenNewFormulation}
              className="px-4 py-2.5 bg-[#3D261E] hover:bg-[#2A1A14] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          )}
        </div>

        {/* 5 Simple Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Products */}
          <button
            onClick={() => onNavigateTab('formulations')}
            className="p-4 bg-white border border-[#E8DDCF] rounded-2xl text-left hover:border-[#C97D36] hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between text-[#C97D36]">
              <div className="w-8 h-8 rounded-xl bg-[#FAF0E4] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-serif text-[#3D261E] block font-medium">
                {products.length}
              </span>
              <span className="text-xs font-semibold text-[#2A1F1B]/70 block">
                Products
              </span>
              <span className="text-[10px] text-[#5E7252] font-semibold mt-0.5 block">
                Catalog Active
              </span>
            </div>
          </button>

          {/* Card 2: Orders */}
          <button
            onClick={() => onNavigateTab('sample-orders')}
            className="p-4 bg-white border border-[#E8DDCF] rounded-2xl text-left hover:border-[#C86B52] hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between text-[#C86B52]">
              <div className="w-8 h-8 rounded-xl bg-[#FAF0E4] flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-serif text-[#3D261E] block font-medium">
                {sampleOrders.length}
              </span>
              <span className="text-xs font-semibold text-[#2A1F1B]/70 block">
                Trial Orders
              </span>
              <span className="text-[10px] text-[#C97D36] font-semibold mt-0.5 block">
                {pendingOrdersCount} Pending
              </span>
            </div>
          </button>

          {/* Card 3: Sensory Trials */}
          <button
            onClick={() => onNavigateTab('sensory-trials')}
            className="p-4 bg-white border border-[#E8DDCF] rounded-2xl text-left hover:border-[#5E7252] hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between text-[#5E7252]">
              <div className="w-8 h-8 rounded-xl bg-[#EEF3EB] flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-serif text-[#3D261E] block font-medium">
                {sensoryTrials.length}
              </span>
              <span className="text-xs font-semibold text-[#2A1F1B]/70 block">
                Sensory Trials
              </span>
              <span className="text-[10px] text-[#5E7252] font-semibold mt-0.5 block">
                {avgSensoryScore}% Avg Score
              </span>
            </div>
          </button>

          {/* Card 4: Users */}
          <button
            onClick={() => onNavigateTab('users')}
            className="p-4 bg-white border border-[#E8DDCF] rounded-2xl text-left hover:border-[#3D261E] hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between text-[#3D261E]">
              <div className="w-8 h-8 rounded-xl bg-[#FAF0E4] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-serif text-[#3D261E] block font-medium">
                {profilesList.length}
              </span>
              <span className="text-xs font-semibold text-[#2A1F1B]/70 block">
                Users
              </span>
              <span className="text-[10px] text-[#2A1F1B]/60 font-medium mt-0.5 block">
                {adminCount} Admin Accounts
              </span>
            </div>
          </button>

          {/* Card 5: Alerts */}
          <button
            onClick={() => onNavigateTab('alerts')}
            className="p-4 bg-white border border-[#E8DDCF] rounded-2xl text-left hover:border-amber-600 hover:shadow-xs transition-all group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between text-amber-600">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-serif text-[#3D261E] block font-medium">
                {alerts.length}
              </span>
              <span className="text-xs font-semibold text-[#2A1F1B]/70 block">
                Alerts
              </span>
              <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
                Active Notices
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. PRODUCTS IN CLEAN SCANNING LAYOUT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="font-serif text-xl sm:text-2xl text-[#3D261E] font-normal">
              Products
            </h3>
            <span className="px-2.5 py-0.5 bg-[#FAF0E4] text-[#3D261E] rounded-full text-xs font-bold border border-[#E8DDCF]">
              {products.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenNewFormulation && (
              <button
                onClick={onOpenNewFormulation}
                className="px-3 py-1.5 bg-[#FAF0E4] hover:bg-[#3D261E] text-[#3D261E] hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#E8DDCF]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            )}
            <button
              onClick={() => onNavigateTab('formulations')}
              className="px-3.5 py-1.5 bg-[#3D261E] text-white hover:bg-[#2A1A14] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>View Full Table</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((prod) => {
            const resolvedImg = resolveProductImageUrl(prod.id, prod.imageUrl);
            return (
              <div
                key={prod.id}
                className="bg-white border border-[#E8DDCF] rounded-2xl p-4 flex flex-col justify-between hover:shadow-xs transition-all group"
              >
                <div className="space-y-3">
                  {/* Actual Product Image */}
                  <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-[#FAF0E4] border border-[#E8DDCF]">
                    <img
                      src={resolvedImg}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const fallback = resolveProductImageUrl(prod.id);
                        if ((e.currentTarget as HTMLImageElement).src !== fallback) {
                          (e.currentTarget as HTMLImageElement).src = fallback;
                        }
                      }}
                    />

                    {/* Category & Status Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 bg-white/95 backdrop-blur-xs text-[10.5px] rounded-full font-semibold text-[#3D261E] border border-[#E8DDCF] capitalize shadow-2xs">
                        {prod.category}
                      </span>
                      <span className={`px-2 py-0.5 text-[9.5px] font-bold rounded-full border shadow-2xs ${
                        prod.labStatus === 'Approved'
                          ? 'bg-[#EEF3EB]/95 text-[#5E7252] border-[#D4E0CD]'
                          : 'bg-[#FFF7ED]/95 text-[#C2410C] border-[#FED7AA]'
                      }`}>
                        {prod.labStatus || 'Approved'}
                      </span>
                    </div>

                    {/* Price Badge in Warm Gold */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2.5 py-0.5 bg-[#C97D36] text-[11px] font-bold text-white rounded-full shadow-2xs">
                        PKR {prod.pricePkr ?? (prod.category === 'cupcakes' ? 50 : prod.category === 'cookies' ? 35 : 45)}
                      </span>
                    </div>

                    {/* Serving size pill */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[10px] rounded-full text-white/90">
                        {prod.servingSize || prod.portionSize || '1 Serving'}
                      </span>
                    </div>
                  </div>

                  {/* Product Name & Calories */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-lg font-medium text-[#3D261E] leading-snug">
                        {prod.name}
                      </h4>
                      <span className="text-[11px] font-bold text-[#3D261E] bg-[#FAF0E4] px-2 py-0.5 rounded-md shrink-0">
                        {prod.nutrition?.calories || 160} kcal
                      </span>
                    </div>
                    <p className="text-xs text-[#2A1F1B]/70 line-clamp-2 mt-1">
                      {prod.tagline || prod.description}
                    </p>
                  </div>

                  {/* Key Nutrition Metrics */}
                  <div className="grid grid-cols-2 gap-2 p-2 bg-[#FAF7F2] rounded-xl border border-[#E8DDCF] text-xs">
                    <div>
                      <span className="text-[10px] text-[#2A1F1B]/60 block">Fiber</span>
                      <span className="text-xs font-bold text-[#5E7252] block">
                        +{prod.nutrition?.dietaryFiberGrams}g Fiber
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#2A1F1B]/60 block">RS2 Starch</span>
                      <span className="text-xs font-bold text-[#C97D36] block">
                        +{prod.nutrition?.resistantStarchGrams}g RS2
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer: Simple Edit Action */}
                <div className="pt-3 mt-3 border-t border-[#E8DDCF] flex items-center gap-2">
                  <button
                    onClick={() => onEditProduct ? onEditProduct(prod) : onNavigateTab('formulations')}
                    className="flex-1 py-2 px-3 bg-[#FAF0E4] hover:bg-[#3D261E] text-[#3D261E] hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DDCF]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Product</span>
                  </button>

                  <button
                    onClick={() => openProductDetail(prod.id)}
                    className="py-2 px-3 bg-white hover:bg-[#FAF7F2] text-[#3D261E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border border-[#E8DDCF] transition-colors"
                    title="View Product Monograph"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. OTHER ADMIN SECTIONS: SIMPLE QUICK-ACCESS BLOCKS */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-[#E8DDCF] pb-3">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#3D261E] font-normal">
              Admin Sections
            </h3>
            <p className="text-xs text-[#2A1F1B]/60 mt-0.5">
              Quick access to trial fulfillment, sensory panels, calculators, and system configurations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Section 1: Orders */}
          <div className="p-4 bg-white border border-[#E8DDCF] rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF0E4] text-[#C86B52] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base text-[#3D261E] font-medium">
                  Trial Orders
                </h4>
              </div>
              <p className="text-xs text-[#2A1F1B]/70 line-clamp-2">
                Track dispatches, participant delivery addresses, and batch fulfillment status.
              </p>
              <div className="mt-2 text-xs font-semibold text-[#C86B52]">
                {sampleOrders.length} orders ({pendingOrdersCount} pending)
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('sample-orders')}
              className="mt-4 w-full py-2 px-3 bg-[#FAF7F2] hover:bg-[#FAF0E4] text-[#3D261E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DDCF]"
            >
              <span>Manage Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 2: Sensory Trials */}
          <div className="p-4 bg-white border border-[#E8DDCF] rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF3EB] text-[#5E7252] flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base text-[#3D261E] font-medium">
                  Sensory Trials
                </h4>
              </div>
              <p className="text-xs text-[#2A1F1B]/70 line-clamp-2">
                Taste, texture, aroma, and appearance scores logged by trained panelists.
              </p>
              <div className="mt-2 text-xs font-semibold text-[#5E7252]">
                {sensoryTrials.length} evaluations recorded
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('sensory-trials')}
              className="mt-4 w-full py-2 px-3 bg-[#FAF7F2] hover:bg-[#FAF0E4] text-[#3D261E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DDCF]"
            >
              <span>View Sensory Trials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 3: RS2 Calculator */}
          <div className="p-4 bg-white border border-[#E8DDCF] rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF0E4] text-[#C97D36] flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base text-[#3D261E] font-medium">
                  RS2 Calculator
                </h4>
              </div>
              <p className="text-xs text-[#2A1F1B]/70 line-clamp-2">
                Formulate composite flours and calculate thermal resistant starch retention.
              </p>
              <div className="mt-2 text-xs font-semibold text-[#C97D36]">
                Flour & starch calibration
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('rs2-calculator')}
              className="mt-4 w-full py-2 px-3 bg-[#FAF7F2] hover:bg-[#FAF0E4] text-[#3D261E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DDCF]"
            >
              <span>Open Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 4: Website Presentation */}
          <div className="p-4 bg-white border border-[#E8DDCF] rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF0E4] text-[#3D261E] flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base text-[#3D261E] font-medium">
                  Website
                </h4>
              </div>
              <p className="text-xs text-[#2A1F1B]/70 line-clamp-2">
                Configure hero headlines, scientific badges, and research lab text.
              </p>
              <div className="mt-2 text-xs font-semibold text-[#3D261E]">
                {websiteContent?.heroBadge || 'Academic Lab Monograph'}
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('website-content')}
              className="mt-4 w-full py-2 px-3 bg-[#FAF7F2] hover:bg-[#FAF0E4] text-[#3D261E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DDCF]"
            >
              <span>Edit Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 5: Alerts */}
          <div className="p-4 bg-white border border-[#E8DDCF] rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base text-[#3D261E] font-medium">
                  Alerts
                </h4>
              </div>
              <p className="text-xs text-[#2A1F1B]/70 line-clamp-2">
                Publish clinical advisories, batch announcements, and allergen notices.
              </p>
              <div className="mt-2 text-xs font-semibold text-amber-700">
                {alerts.length} announcements live
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('alerts')}
              className="mt-4 w-full py-2 px-3 bg-[#FAF7F2] hover:bg-[#FAF0E4] text-[#3D261E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DDCF]"
            >
              <span>Manage Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 6: Users & Access */}
          <div className="p-4 bg-white border border-[#E8DDCF] rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF3EB] text-[#5E7252] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base text-[#3D261E] font-medium">
                  Users & Roles
                </h4>
              </div>
              <p className="text-xs text-[#2A1F1B]/70 line-clamp-2">
                Manage registered user accounts, formulator permissions, and admin access.
              </p>
              <div className="mt-2 text-xs font-semibold text-[#5E7252]">
                {profilesList.length} profiles ({adminCount} Admins)
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('users')}
              className="mt-4 w-full py-2 px-3 bg-[#FAF7F2] hover:bg-[#FAF0E4] text-[#3D261E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DDCF]"
            >
              <span>Manage Users</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 7: Database */}
          <div className="p-4 bg-white border border-[#E8DDCF] rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF0E4] text-[#3D261E] flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base text-[#3D261E] font-medium">
                  Database
                </h4>
              </div>
              <p className="text-xs text-[#2A1F1B]/70 line-clamp-2">
                View Supabase table counts, connection health, and row-level synchronization.
              </p>
              <div className="mt-2 text-xs font-semibold text-emerald-700">
                Connected & Synchronized
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('database')}
              className="mt-4 w-full py-2 px-3 bg-[#FAF7F2] hover:bg-[#FAF0E4] text-[#3D261E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DDCF]"
            >
              <span>Database Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 8: Analytics */}
          <div className="p-4 bg-white border border-[#E8DDCF] rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF3EB] text-[#5E7252] flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base text-[#3D261E] font-medium">
                  Analytics
                </h4>
              </div>
              <p className="text-xs text-[#2A1F1B]/70 line-clamp-2">
                University research summary, SCFA metrics, and clinical research digests.
              </p>
              <div className="mt-2 text-xs font-semibold text-[#5E7252]">
                Research Reports
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="mt-4 w-full py-2 px-3 bg-[#FAF7F2] hover:bg-[#FAF0E4] text-[#3D261E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DDCF]"
            >
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
