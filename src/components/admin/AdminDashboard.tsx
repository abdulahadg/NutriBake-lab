import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import { resolveProductImageUrl } from '../../lib/supabase';
import { FormulationModal } from './FormulationModal';
import { SensoryTrialsPanel } from './SensoryTrialsPanel';
import { ResistantStarchCalculator } from './ResistantStarchCalculator';
import { AdminSampleOrders } from './AdminSampleOrders';
import { AlertsManager } from './AlertsManager';
import { UsersManager } from './UsersManager';
import { AllOverview } from './AllOverview';
import { TeamManager } from './TeamManager';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Copy, 
  Printer, 
  FlaskConical, 
  Layers, 
  Package, 
  Sparkles,
  Calculator,
  Award,
  Bell,
  Users,
  UserCheck,
  LayoutGrid,
  Menu,
  X,
  Eye,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  LayoutList
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    openProductDetail,
    sampleOrders, 
    sensoryTrials, 
    alerts,
    profilesList,
    teamMembers,
    user, 
    setUser, 
    addToast,
    navigateTo 
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'all' | 'formulations' | 'sample-orders' | 'nutrition' | 'sensory-trials' | 'team' | 'users' | 'alerts'
  >('all');

  // Mobile sidebar open state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search & Filter in Formulations
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProductCategory>('all');
  const [productViewMode, setProductViewMode] = useState<'table' | 'grid'>('table');

  // Modal State for Create / Edit Formulation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [seedData, setSeedData] = useState<{
    fiber: number;
    rs: number;
    gi: number;
    tagline: string;
  } | null>(null);

  // Strict Role Protection: Only Admins can access the Admin Management Console
  if (user?.role !== 'admin') {
    return (
      <div className="py-24 px-6 max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FDF1EB] border border-[#E8DDCF] flex items-center justify-center text-[#C86B52]">
          <ShieldAlert className="w-8 h-8 stroke-[1.8]" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C86B52] block">
            Restricted Console
          </span>
          <h2 className="font-serif text-3xl font-normal text-[#3D261E]">
            Admin Access Required
          </h2>
          <p className="text-xs sm:text-sm text-[#2A1F1B]/75 leading-relaxed">
            The Admin Management Console is restricted to authorized laboratory administrators. Normal users cannot access administrative controls or internal records.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigateTo('dashboard')}
            className="btn-sweet px-5 py-2.5 bg-[#3D261E] text-white hover:bg-[#C97D36] text-xs font-semibold rounded-xl"
          >
            Open User Panel
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="btn-sweet px-5 py-2.5 bg-white text-[#3D261E] border border-[#E8DDCF] hover:bg-[#FAF0E4] text-xs font-semibold rounded-xl"
          >
            Back to Public Website
          </button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mainFunctionalIngredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.batchCode && p.batchCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSaveFormulation = (prod: Product) => {
    const exists = products.some(p => p.id === prod.id);
    if (exists) {
      updateProduct(prod);
      addToast('Product Updated', `Successfully saved changes to ${prod.name}`, 'success');
    } else {
      addProduct(prod);
      addToast('Product Added', `Added ${prod.name} to catalog`, 'success');
    }
    setSeedData(null);
  };

  const handleDuplicateProduct = (original: Product) => {
    const cloned: Product = {
      ...original,
      id: `prod-clone-${Date.now()}`,
      name: `${original.name} (Copy)`,
      batchCode: `NB-2026-ITR${Math.floor(100 + Math.random() * 900)}`,
      labStatus: 'Formulation Testing'
    };
    addProduct(cloned);
    addToast('Product Duplicated', `Created prototype copy: ${cloned.name}`, 'info');
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from the catalog?`)) {
      deleteProduct(productId);
      addToast('Product Deleted', `Removed ${productName} from catalog`, 'info');
    }
  };

  const handleSeedFromCalculator = (data: {
    fiber: number;
    rs: number;
    gi: number;
    tagline: string;
  }) => {
    setSeedData(data);
    setEditingProduct(null);
    setIsModalOpen(true);
    setActiveAdminTab('formulations');
  };

  const pendingOrdersCount = sampleOrders.filter(
    o => o.status === 'Pending Formulation' || o.status === 'Lab Blended'
  ).length;

  // Primary bakery management tabs (Clean, operational, useful)
  const NAV_ITEMS = [
    { id: 'all', label: 'All', icon: LayoutGrid, count: null },
    { id: 'formulations', label: 'Products / Formulation', icon: Layers, count: products.length },
    { id: 'sample-orders', label: 'Orders', icon: Package, count: sampleOrders.length },
    { id: 'nutrition', label: 'Nutrition / Intake', icon: Calculator, count: null },
    { id: 'sensory-trials', label: 'Sensory / Tasting', icon: Award, count: sensoryTrials.length },
    { id: 'team', label: 'Team', icon: UserCheck, count: teamMembers.length },
    { id: 'users', label: 'Users / Profiles', icon: Users, count: profilesList.length },
    { id: 'alerts', label: 'Alerts', icon: Bell, count: alerts.length },
  ] as const;

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#FAF7F2] text-[#2A1F1B] flex flex-col">
      {/* MOBILE TOP BAR - Positioned cleanly below sticky header */}
      <div className="lg:hidden flex items-center justify-between p-3.5 sm:p-4 bg-white border-b border-[#E8DDCF] sticky top-[65px] z-30 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E8DDCF] text-[#3D261E] hover:bg-[#FAF0E4] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <span className="font-serif text-base font-normal text-[#3D261E]">NutriBake Admin</span>
            <span className="text-[10px] text-[#5E7252] font-semibold block capitalize">
              {activeAdminTab.replace('-', ' ')}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setSeedData(null);
            setIsModalOpen(true);
          }}
          className="px-3 py-1.5 bg-[#3D261E] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#C97D36] transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Product</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row flex-1">
        {/* ========================================================= */}
        {/* ADMIN SIDEBAR */}
        {/* ========================================================= */}
        <aside 
          className={`
            fixed lg:sticky lg:top-[65px] left-0 h-screen lg:h-[calc(100vh-65px)] z-50 lg:z-10
            w-64 bg-white border-r border-[#E8DDCF] flex flex-col justify-between shrink-0
            transition-transform duration-200 ease-in-out
            ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Sidebar Branding Header */}
            <div className="p-5 border-b border-[#E8DDCF]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF0E4] text-[#C97D36] flex items-center justify-center border border-[#E8DDCF] shrink-0 shadow-2xs">
                    <FlaskConical className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h1 className="font-serif text-lg text-[#3D261E] font-medium leading-none">
                      NutriBake
                    </h1>
                    <span className="text-[10px] font-bold text-[#5E7252] uppercase tracking-wider block mt-1">
                      Admin Portal
                    </span>
                  </div>
                </div>

                {/* Close button on mobile */}
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="lg:hidden p-1.5 rounded-lg text-[#2A1F1B]/60 hover:text-[#3D261E]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 text-[11px] text-[#2A1F1B]/60">
                Univ. of Sindh Nutrition & Food Science
              </div>
            </div>

            {/* Sidebar Navigation Items */}
            <nav className="p-3 space-y-1 flex-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2A1F1B]/50">
                Menu
              </div>

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeAdminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveAdminTab(item.id as any);
                      setMobileSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold
                      transition-all text-left
                      ${isActive 
                        ? 'bg-[#3D261E] text-white shadow-xs' 
                        : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF7F2]' : 'text-[#C97D36]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== null && (
                      <span 
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-[#FAF0E4] text-[#3D261E] border border-[#E8DDCF]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Footer: Authenticated Admin Status */}
            <div className="p-4 border-t border-[#E8DDCF] bg-[#FAF7F2] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#2A1F1B]/60">Console Access:</span>
                <span className="px-2 py-0.5 rounded-md bg-[#3D261E] text-white text-[10px] font-bold uppercase tracking-wider">
                  Admin Verified
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-[#E8DDCF] space-y-0.5 shadow-2xs">
                <p className="text-xs font-semibold text-[#3D261E] truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-[#2A1F1B]/60 truncate">{user?.email || 'admin@nutribake.edu'}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-[#2A1A14]/50 backdrop-blur-xs"
          />
        )}

        {/* ========================================================= */}
        {/* MAIN CONTENT AREA */}
        {/* ========================================================= */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* TAB 1: ALL OVERVIEW */}
          {activeAdminTab === 'all' && (
            <AllOverview 
              onNavigateTab={setActiveAdminTab}
              onOpenNewFormulation={() => {
                setEditingProduct(null);
                setSeedData(null);
                setIsModalOpen(true);
              }}
              onEditProduct={(product) => {
                setEditingProduct(product);
                setSeedData(null);
                setIsModalOpen(true);
              }}
            />
          )}

          {/* TAB 2: FORMULATION / PRODUCTS MANAGEMENT */}
          {activeAdminTab === 'formulations' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Clean Header & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCF] pb-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#3D261E] font-normal tracking-tight">
                    Products
                  </h2>
                  <p className="text-xs text-[#2A1F1B]/60 mt-1">
                    Manage catalog monographs, pricing, nutritional assays, and formulation testing.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setSeedData(null);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-[#3D261E] hover:bg-[#2A1A14] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs self-start sm:self-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Clean Search, Filter & View Controls */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3D261E]/40" />
                  <input
                    type="text"
                    placeholder="Search by name, category, or batch code..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] placeholder-[#2A1F1B]/40 focus:outline-none focus:border-[#C97D36]"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E8DDCF] text-xs font-semibold">
                    {(['all', 'cupcakes', 'cookies', 'nutriballs'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg whitespace-nowrap capitalize transition-all ${
                          categoryFilter === cat
                            ? 'bg-[#3D261E] text-white shadow-2xs'
                            : 'text-[#2A1F1B]/70 hover:text-[#3D261E]'
                        }`}
                      >
                        {cat === 'all' ? 'All' : cat}
                      </button>
                    ))}
                  </div>

                  {/* View Mode Toggle: Table or Cards */}
                  <div className="flex items-center p-1 bg-white rounded-xl border border-[#E8DDCF]">
                    <button
                      onClick={() => setProductViewMode('table')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        productViewMode === 'table' ? 'bg-[#3D261E] text-white' : 'text-[#2A1F1B]/60 hover:text-[#3D261E]'
                      }`}
                      title="Table View"
                    >
                      <LayoutList className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setProductViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        productViewMode === 'grid' ? 'bg-[#3D261E] text-white' : 'text-[#2A1F1B]/60 hover:text-[#3D261E]'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* PRODUCTS LIST / TABLE (Clean Structure: Image -> Name -> Category -> Price -> Status -> Edit) */}
              {productViewMode === 'table' ? (
                <div className="bg-white border border-[#E8DDCF] rounded-2xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F2] border-b border-[#E8DDCF] text-[#3D261E] font-bold text-[11px]">
                        <tr>
                          <th className="p-3.5 pl-5">Product</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Price</th>
                          <th className="p-3.5">Nutrition Focus</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 pr-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2ECE4] text-[#2A1F1B]">
                        {filteredProducts.map((p) => {
                          const resolvedImg = resolveProductImageUrl(p.id, p.imageUrl);
                          const price = p.pricePkr ?? (p.category === 'cupcakes' ? 50 : p.category === 'cookies' ? 35 : 45);
                          return (
                            <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                              {/* 1. Image & Name */}
                              <td className="p-3.5 pl-5 flex items-center gap-3">
                                <img 
                                  src={resolvedImg} 
                                  alt={p.name} 
                                  className="w-12 h-12 rounded-xl object-cover border border-[#E8DDCF] shrink-0 bg-[#FAF0E4]" 
                                  onError={(e) => {
                                    const fallback = resolveProductImageUrl(p.id);
                                    if ((e.currentTarget as HTMLImageElement).src !== fallback) {
                                      (e.currentTarget as HTMLImageElement).src = fallback;
                                    }
                                  }}
                                />
                                <div>
                                  <span className="font-serif text-sm font-medium text-[#3D261E] block">
                                    {p.name}
                                  </span>
                                  <span className="text-[11px] text-[#2A1F1B]/60">
                                    {p.servingSize} • {p.nutrition?.calories || 160} kcal
                                  </span>
                                </div>
                              </td>

                              {/* 2. Category */}
                              <td className="p-3.5 capitalize text-xs text-[#2A1F1B]/80 font-medium">
                                <span className="px-2.5 py-1 bg-[#FAF7F2] rounded-lg border border-[#E8DDCF]">
                                  {p.category}
                                </span>
                              </td>

                              {/* 3. Price */}
                              <td className="p-3.5 font-semibold text-[#3D261E]">
                                PKR {price}
                              </td>

                              {/* 4. Nutrition Focus */}
                              <td className="p-3.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#5E7252]">
                                    +{p.nutrition?.dietaryFiberGrams}g Fiber
                                  </span>
                                  <span className="text-[#2A1F1B]/40">•</span>
                                  <span className="font-bold text-[#C97D36]">
                                    +{p.nutrition?.resistantStarchGrams}g RS2
                                  </span>
                                </div>
                              </td>

                              {/* 5. Status */}
                              <td className="p-3.5">
                                <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                  p.labStatus === 'Approved'
                                    ? 'bg-[#EEF3EB] border-[#D4E0CD] text-[#5E7252]'
                                    : 'bg-[#FFF7ED] border-[#FED7AA] text-[#C2410C]'
                                }`}>
                                  {p.labStatus || 'Approved'}
                                </span>
                              </td>

                              {/* 6. Edit & Actions */}
                              <td className="p-3.5 pr-5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingProduct(p);
                                      setSeedData(null);
                                      setIsModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 bg-[#FAF0E4] hover:bg-[#3D261E] text-[#3D261E] hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-[#E8DDCF]"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    onClick={() => handleDuplicateProduct(p)}
                                    className="p-1.5 hover:bg-[#FAF7F2] text-[#2A1F1B]/60 hover:text-[#3D261E] rounded-lg transition-colors"
                                    title="Duplicate / Copy"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteProduct(p.id, p.name)}
                                    className="p-1.5 hover:bg-rose-50 text-[#2A1F1B]/50 hover:text-rose-600 rounded-lg transition-colors"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* GRID VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map((p) => {
                    const resolvedImg = resolveProductImageUrl(p.id, p.imageUrl);
                    const price = p.pricePkr ?? (p.category === 'cupcakes' ? 50 : p.category === 'cookies' ? 35 : 45);
                    return (
                      <div
                        key={p.id}
                        className="bg-white border border-[#E8DDCF] rounded-2xl p-4 flex flex-col justify-between hover:shadow-xs transition-all group"
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-[#FAF0E4] border border-[#E8DDCF]">
                            <img
                              src={resolvedImg}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                              onError={(e) => {
                                const fallback = resolveProductImageUrl(p.id);
                                if ((e.currentTarget as HTMLImageElement).src !== fallback) {
                                  (e.currentTarget as HTMLImageElement).src = fallback;
                                }
                              }}
                            />
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                              <span className="px-2.5 py-0.5 bg-white/95 text-[10.5px] rounded-full font-semibold text-[#3D261E] border border-[#E8DDCF] capitalize">
                                {p.category}
                              </span>
                            </div>
                            <div className="absolute top-2.5 right-2.5">
                              <span className="px-2.5 py-0.5 bg-[#C97D36] text-[11px] font-bold text-white rounded-full">
                                PKR {price}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-serif text-base font-medium text-[#3D261E]">
                                {p.name}
                              </h4>
                              <span className="text-[10.5px] font-bold text-[#5E7252] bg-[#EEF3EB] px-2 py-0.5 rounded-full">
                                {p.labStatus || 'Approved'}
                              </span>
                            </div>
                            <p className="text-xs text-[#2A1F1B]/60 line-clamp-2 mt-1">
                              {p.tagline || p.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-[#E8DDCF] flex items-center justify-between">
                          <div className="text-xs">
                            <span className="font-bold text-[#5E7252]">+{p.nutrition?.dietaryFiberGrams}g Fiber</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setSeedData(null);
                                setIsModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-[#FAF0E4] hover:bg-[#3D261E] text-[#3D261E] hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-[#E8DDCF]"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDuplicateProduct(p)}
                              className="p-1.5 text-[#2A1F1B]/60 hover:text-[#3D261E] rounded-lg"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-[#2A1F1B]/50 hover:text-rose-600 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRIAL ORDERS FULFILLMENT */}
          {activeAdminTab === 'sample-orders' && (
            <AdminSampleOrders />
          )}

          {/* TAB 4: NUTRITION / INTAKE ASSAYS */}
          {activeAdminTab === 'nutrition' && (
            <ResistantStarchCalculator onApplyToNewFormulation={handleSeedFromCalculator} />
          )}

          {/* TAB 5: SENSORY TRIALS LAB */}
          {activeAdminTab === 'sensory-trials' && (
            <SensoryTrialsPanel />
          )}

          {/* TAB 6: TEAM DIRECTORY */}
          {activeAdminTab === 'team' && (
            <TeamManager />
          )}

          {/* TAB 7: USERS & PROFILES */}
          {activeAdminTab === 'users' && (
            <UsersManager />
          )}

          {/* TAB 8: ALERTS & INVENTORY ANNOUNCEMENTS */}
          {activeAdminTab === 'alerts' && (
            <AlertsManager />
          )}
        </main>
      </div>

      {/* Product Add / Edit Formulation Modal */}
      <FormulationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          setSeedData(null);
        }}
        onSave={handleSaveFormulation}
        initialProduct={editingProduct}
        seedData={seedData}
      />
    </div>
  );
};
