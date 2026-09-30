import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, ArrowRight, RefreshCw } from 'lucide-react';
import { ProductCategory } from '../../types';

export const ProductCatalog: React.FC = () => {
  const { products, navigateTo } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'fiber' | 'calories'>('score');

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All 3 Formulations' },
    { id: 'cupcakes', label: 'Cupcakes' },
    { id: 'cookies', label: 'Cookies' },
    { id: 'nutriballs', label: 'NutriBalls' },
  ];

  const dietaryTags = [
    { id: 'all', label: 'All Diets' },
    { id: 'High Fiber', label: 'High Fiber' },
    { id: 'Prebiotic RS2', label: 'Prebiotic RS2' },
    { id: 'Nutrient Dense', label: 'Nutrient Dense' },
    { id: 'Gluten Conscious', label: 'Gluten Conscious' },
    { id: 'Dairy Free', label: 'Dairy Free' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesTag = selectedTag === 'all' || p.dietaryTags.some(t => t.toLowerCase() === selectedTag.toLowerCase());
        const matchesSearch = 
          searchQuery.trim() === '' ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.functionalIngredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return matchesCategory && matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'fiber') {
          return b.nutrition.dietaryFiberGrams - a.nutrition.dietaryFiberGrams;
        }
        if (sortBy === 'calories') {
          return a.nutrition.calories - b.nutrition.calories;
        }
        return b.nutritionScore - a.nutritionScore;
      });
  }, [products, selectedCategory, selectedTag, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedTag('all');
    setSearchQuery('');
    setSortBy('score');
  };

  return (
    <div className="py-12 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-12 sm:space-y-16">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-3">
        <span className="font-display text-[11px] uppercase tracking-luxury font-semibold text-[#657258] block">
          Current Formulations
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#3D261E] tracking-tight-title leading-[1.04] break-words">
          The Bakery <span className="italic">Collection</span>.
        </h1>
        <p className="text-sm sm:text-[15px] text-[#29211E]/80 leading-[1.7] pt-1">
          Each batch is baked with unrefined green banana flour, California almonds, and prebiotic dietary fibers.
        </p>
      </div>

      {/* Filter and Search Controls (Soft, Rounded Pills) */}
      <div className="bg-white/80 backdrop-blur-sm border border-[#E8DDCF] rounded-3xl p-4 sm:p-7 shadow-xs space-y-5 sm:space-y-6">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#3D261E]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ingredient, prebiotic fiber, flavor..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E6D9CC] rounded-full text-xs sm:text-sm text-[#2A1F1B] placeholder-[#2A1F1B]/45 focus:outline-none focus:border-[#C97D36] focus:ring-2 focus:ring-[#C97D36]/15 transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto text-xs text-[#2A1F1B]/75">
            <SlidersHorizontal className="w-4 h-4 text-[#C97D36]" />
            <span className="text-xs font-semibold text-[#3D261E]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 bg-white border border-[#E6D9CC] rounded-full text-xs text-[#3D261E] font-medium focus:outline-none focus:border-[#C97D36] cursor-pointer shadow-2xs"
            >
              <option value="score">Highest Nutrition Score</option>
              <option value="fiber">Highest RS2 Fiber</option>
              <option value="calories">Gentlest Calories</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 border-t border-[#F0E6DA]">
          <span className="text-[#3D261E]/70 text-xs font-semibold mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs ${
                selectedCategory === cat.id
                  ? 'bg-[#3D261E] text-[#FAF7F2] shadow-sm'
                  : 'bg-white hover:bg-[#FAF0E4] text-[#2A1F1B]/80 hover:text-[#3D261E] border border-[#E6D9CC]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Gallery Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-4">
          <h3 className="font-serif text-2xl text-[#3A2721]">No Formulations Match</h3>
          <p className="text-xs sm:text-sm text-[#29211E]/70 leading-relaxed">
            No recipes found matching this exact filter combination.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3A2721] text-[#FAF5ED] text-xs uppercase tracking-[0.12em] hover:bg-[#2A1C18] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Understated Recommendation Invitation */}
      <div className="border-t border-[#3A2721]/15 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-serif text-xl sm:text-2xl text-[#3A2721]">
            Looking for personalized nutritional pairings?
          </h3>
          <p className="text-xs sm:text-sm text-[#29211E]/70">
            Take our guided recommendation flow to match formulations with your individual metabolic targets.
          </p>
        </div>

        <button
          onClick={() => navigateTo('recommendations')}
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium text-[#3A2721] hover:text-[#A96345] transition-colors whitespace-normal sm:whitespace-nowrap"
        >
          <span>Find your recommendation</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
