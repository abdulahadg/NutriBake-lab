import React, { useState, useRef } from 'react';
import { Product, ProductCategory } from '../../types';
import { 
  X, 
  Save, 
  Upload, 
  Image as ImageIcon, 
  RefreshCw, 
  Check, 
  Layers, 
  Flame, 
  Wheat, 
  Info,
  DollarSign,
  FileText,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { resolveProductImageUrl } from '../../lib/supabase';
import {
  formatToTitleCase,
  validateEveryWordCapitalized,
  validatePrice,
  validateNumericField,
  validateImageSource
} from '../../utils/validation';

interface FormulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialProduct?: Product | null;
  seedData?: {
    fiber: number;
    rs: number;
    gi: number;
    tagline: string;
  } | null;
}

export const FormulationModal: React.FC<FormulationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
  seedData
}) => {
  if (!isOpen) return null;

  // Active form section tab
  const [activeTab, setActiveTab] = useState<'basic' | 'nutrition' | 'details' | 'image'>('basic');

  // Basic Information
  const [name, setName] = useState(initialProduct?.name || 'Sindh Date & Flax Functional NutriBall');
  const [category, setCategory] = useState<ProductCategory>(initialProduct?.category || 'nutriballs');
  const [pricePkr, setPricePkr] = useState<number>(
    initialProduct?.pricePkr ?? (initialProduct?.category === 'cupcakes' ? 50 : initialProduct?.category === 'cookies' ? 35 : 45)
  );
  const [tagline, setTagline] = useState(
    initialProduct?.tagline || seedData?.tagline || 'High-amylose composite snack fortified with organic flax and chicory inulin'
  );
  const [description, setDescription] = useState(
    initialProduct?.description || 'Dense, cold-pressed functional snack calibrated for steady colonic fermentation and sustained morning satiety.'
  );

  // Nutrition Facts
  const [calories, setCalories] = useState(initialProduct?.nutrition.calories || 175);
  const [proteinGrams, setProteinGrams] = useState(initialProduct?.nutrition.proteinGrams || 5.2);
  const [carbsGrams, setCarbsGrams] = useState(initialProduct?.nutrition.carbsGrams || 26);
  const [dietaryFiberGrams, setDietaryFiberGrams] = useState(
    initialProduct?.nutrition.dietaryFiberGrams || seedData?.fiber || 7.5
  );
  const [resistantStarchGrams, setResistantStarchGrams] = useState(
    initialProduct?.nutrition.resistantStarchGrams || seedData?.rs || 4.2
  );
  const [sugarsGrams, setSugarsGrams] = useState(initialProduct?.nutrition.sugarsGrams || 8);
  const [totalFatGrams, setTotalFatGrams] = useState(initialProduct?.nutrition.totalFatGrams || 6.5);
  const [saturatedFatGrams, setSaturatedFatGrams] = useState(initialProduct?.nutrition.saturatedFatGrams || 0.8);
  const [sodiumMg, setSodiumMg] = useState(initialProduct?.nutrition.sodiumMg || 45);
  const [glycemicIndexEst, setGlycemicIndexEst] = useState(
    initialProduct?.nutrition.glycemicIndexEst || seedData?.gi || 39
  );

  // Product Details & Specifications
  const [servingSize, setServingSize] = useState(initialProduct?.servingSize || '2 balls (50g)');
  const [batchCode, setBatchCode] = useState(initialProduct?.batchCode || `NB-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [labStatus, setLabStatus] = useState<'Approved' | 'Formulation Testing' | 'Sensory Trial'>(
    initialProduct?.labStatus || 'Approved'
  );
  const [childFriendly, setChildFriendly] = useState(initialProduct?.childFriendly ?? true);
  const [mainFunctionalIngredient, setMainFunctionalIngredient] = useState(
    initialProduct?.mainFunctionalIngredient || 'Green Banana Flour (Musa acuminata)'
  );
  const [allIngredientsText, setAllIngredientsText] = useState(
    initialProduct?.allIngredients.join(', ') || 'Green Banana Flour, Rolled Oats, Ground Flaxseed, Aseel Dates, Chicory Inulin, Raw Honey'
  );
  const [allergensText, setAllergensText] = useState(
    initialProduct?.allergens.join(', ') || 'Tree Nuts (Almonds)'
  );

  // Sensory Targets
  const [taste, setTaste] = useState(initialProduct?.sensoryScores.taste || 95);
  const [texture, setTexture] = useState(initialProduct?.sensoryScores.texture || 96);
  const [aroma, setAroma] = useState(initialProduct?.sensoryScores.aroma || 94);
  const [appearance, setAppearance] = useState(initialProduct?.sensoryScores.appearance || 95);

  // Image Management
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.imageUrl || resolveProductImageUrl(initialProduct?.id, initialProduct?.imageUrl)
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation Error State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nameAutoFormatted, setNameAutoFormatted] = useState(false);

  // Helper to check which tabs contain validation issues
  const hasBasicErrors = Boolean(errors.name || errors.pricePkr || errors.category);
  const hasNutritionErrors = Boolean(
    errors.calories || errors.dietaryFiberGrams || errors.resistantStarchGrams ||
    errors.proteinGrams || errors.carbsGrams || errors.sugarsGrams ||
    errors.totalFatGrams || errors.saturatedFatGrams || errors.sodiumMg || errors.glycemicIndexEst
  );
  const hasDetailsErrors = Boolean(errors.taste || errors.texture || errors.aroma || errors.appearance);
  const hasImageErrors = Boolean(errors.imageUrl);

  const GALLERY_PRESETS = [
    { label: 'Golden Cupcakes', path: '/src/assets/images/nutribake_cupcakes_1789159074122.jpg' },
    { label: 'Cocolina Cookies', path: '/src/assets/images/nutribake_cookies_1789159094420.jpg' },
    { label: 'NutriBalls', path: '/src/assets/images/nutribake_nutriballs_1789159111855.jpg' },
    { label: 'Bakery Still Life', path: '/src/assets/images/hero_bakery_still_life_1788459814680.jpg' },
  ];

  const handleNameBlur = () => {
    const formatted = formatToTitleCase(name);
    if (formatted && formatted !== name) {
      setName(formatted);
      setNameAutoFormatted(true);
      setTimeout(() => setNameAutoFormatted(false), 3000);
    }
    const val = validateEveryWordCapitalized(formatted || name);
    setErrors(prev => {
      const next = { ...prev };
      if (!val.isValid) {
        next.name = val.message || 'Every word must start with an uppercase letter.';
      } else {
        delete next.name;
      }
      return next;
    });
  };

  const handlePriceBlur = () => {
    const val = validatePrice(pricePkr);
    setErrors(prev => {
      const next = { ...prev };
      if (!val.isValid) {
        next.pricePkr = val.message || 'Please enter a valid price.';
      } else {
        delete next.pricePkr;
      }
      return next;
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const res = await fetch('/api/admin/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, dataUrl })
          });
          const json = await res.json();
          if (res.ok && json.url) {
            setImageUrl(json.url);
          } else {
            setImageUrl(dataUrl);
          }
        } catch {
          setImageUrl(reader.result as string);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
      setUploadError('Could not read image file.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Auto-format name to Title Case to assist user automatically
    const normalizedName = formatToTitleCase(name);
    setName(normalizedName);

    // 2. Perform field validations
    const newErrors: Record<string, string> = {};

    const nameCheck = validateEveryWordCapitalized(normalizedName);
    if (!nameCheck.isValid) {
      newErrors.name = nameCheck.message || 'Each word in the product name must start with an uppercase letter.';
    }

    const priceCheck = validatePrice(pricePkr);
    if (!priceCheck.isValid) {
      newErrors.pricePkr = priceCheck.message || 'Please enter a valid, non-negative price.';
    }

    const caloriesCheck = validateNumericField(calories, 'Calories', 0, 3000);
    if (!caloriesCheck.isValid) newErrors.calories = caloriesCheck.message!;

    const fiberCheck = validateNumericField(dietaryFiberGrams, 'Dietary Fiber', 0, 100);
    if (!fiberCheck.isValid) newErrors.dietaryFiberGrams = fiberCheck.message!;

    const rsCheck = validateNumericField(resistantStarchGrams, 'Prebiotic RS2', 0, 100);
    if (!rsCheck.isValid) newErrors.resistantStarchGrams = rsCheck.message!;

    const proteinCheck = validateNumericField(proteinGrams, 'Protein', 0, 200);
    if (!proteinCheck.isValid) newErrors.proteinGrams = proteinCheck.message!;

    const carbsCheck = validateNumericField(carbsGrams, 'Carbohydrates', 0, 300);
    if (!carbsCheck.isValid) newErrors.carbsGrams = carbsCheck.message!;

    const sugarsCheck = validateNumericField(sugarsGrams, 'Sugars', 0, 200);
    if (!sugarsCheck.isValid) newErrors.sugarsGrams = sugarsCheck.message!;

    const totalFatCheck = validateNumericField(totalFatGrams, 'Total Fat', 0, 200);
    if (!totalFatCheck.isValid) newErrors.totalFatGrams = totalFatCheck.message!;

    const satFatCheck = validateNumericField(saturatedFatGrams, 'Saturated Fat', 0, 100);
    if (!satFatCheck.isValid) newErrors.saturatedFatGrams = satFatCheck.message!;

    const sodiumCheck = validateNumericField(sodiumMg, 'Sodium', 0, 10000);
    if (!sodiumCheck.isValid) newErrors.sodiumMg = sodiumCheck.message!;

    const giCheck = validateNumericField(glycemicIndexEst, 'Estimated GI', 0, 150);
    if (!giCheck.isValid) newErrors.glycemicIndexEst = giCheck.message!;

    const imageCheck = validateImageSource(imageUrl);
    if (!imageCheck.isValid) {
      newErrors.imageUrl = imageCheck.message || 'Please provide a valid product image.';
    }

    // 3. If any validation fails, switch to the relevant tab and block submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.name || newErrors.pricePkr) {
        setActiveTab('basic');
      } else if (
        newErrors.calories || newErrors.dietaryFiberGrams || newErrors.resistantStarchGrams ||
        newErrors.proteinGrams || newErrors.carbsGrams || newErrors.sugarsGrams ||
        newErrors.totalFatGrams || newErrors.saturatedFatGrams || newErrors.sodiumMg || newErrors.glycemicIndexEst
      ) {
        setActiveTab('nutrition');
      } else if (newErrors.imageUrl) {
        setActiveTab('image');
      }
      return;
    }

    // Clear errors on success
    setErrors({});

    const allIngredients = allIngredientsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const allergens = allergensText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const overallAcceptability = Number(((taste + texture + aroma + appearance) / 4).toFixed(1));

    const updatedProduct: Product = {
      id: initialProduct?.id || `prod-${Date.now()}`,
      name: normalizedName,
      category,
      pricePkr: Number(pricePkr) || 45,
      tagline: tagline.trim(),
      description: description.trim(),
      whyThisProduct: initialProduct?.whyThisProduct || 'Engineered by University of Sindh food scientists to deliver therapeutic prebiotic fiber.',
      nutritionScore: Math.min(100, Math.round(70 + (dietaryFiberGrams * 2.5) + (resistantStarchGrams * 2))),
      nutrition: {
        calories: Number(calories) || 160,
        proteinGrams: Number(proteinGrams) || 5,
        carbsGrams: Number(carbsGrams) || 25,
        dietaryFiberGrams: Number(dietaryFiberGrams) || 6,
        resistantStarchGrams: Number(resistantStarchGrams) || 4,
        sugarsGrams: Number(sugarsGrams) || 7,
        totalFatGrams: Number(totalFatGrams) || 6,
        saturatedFatGrams: Number(saturatedFatGrams) || 1,
        sodiumMg: Number(sodiumMg) || 40,
        glycemicIndexEst: Number(glycemicIndexEst) || 38
      },
      mainFunctionalIngredient: mainFunctionalIngredient.trim(),
      allIngredients,
      functionalIngredients: initialProduct?.functionalIngredients || [
        {
          name: mainFunctionalIngredient.trim(),
          role: 'Resistant Starch Matrix',
          scientificBenefit: 'Colonic fermentation stimulates Bifidobacterium and short-chain fatty acid synthesis.'
        }
      ],
      allergens,
      dietaryTags: initialProduct?.dietaryTags || ['High Fiber', 'Prebiotic RS2', 'Low Glycemic'],
      sensoryScores: {
        taste,
        texture,
        aroma,
        appearance,
        overallAcceptability,
        panelNotes: initialProduct?.sensoryScores?.panelNotes || 'Optimal crumb cohesion, pleasant natural sweetness.'
      },
      servingSize: servingSize.trim(),
      portionSize: servingSize.trim(),
      shelfLife: initialProduct?.shelfLife || '14 days ambient, 45 days refrigerated',
      storageInstructions: initialProduct?.storageInstructions || 'Store in airtight glass container away from direct sunlight.',
      imageUrl: imageUrl.trim() || resolveProductImageUrl(initialProduct?.id),
      isFeatured: initialProduct?.isFeatured || false,
      childFriendly,
      batchCode: batchCode.trim(),
      labStatus
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#2A1A14]/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-[#FAF7F2] border border-[#E8DDCF] rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E8DDCF] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0E4] text-[#C97D36] flex items-center justify-center border border-[#E8DDCF] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#3D261E] font-normal leading-tight">
                {initialProduct ? `Edit ${initialProduct.name}` : 'Add New Product'}
              </h3>
              <p className="text-xs text-[#2A1F1B]/60 mt-0.5">
                {initialProduct ? 'Update product details, pricing, nutrition, and photography' : 'Fill in the basic product information and publish to catalog'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 rounded-xl text-[#2A1F1B]/60 hover:text-[#3D261E] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#E8DDCF] overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 relative ${
              activeTab === 'basic'
                ? 'bg-[#3D261E] text-white shadow-xs'
                : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>1. Basic Info & Price</span>
            {hasBasicErrors && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Requires attention" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nutrition')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 relative ${
              activeTab === 'nutrition'
                ? 'bg-[#3D261E] text-white shadow-xs'
                : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>2. Nutrition</span>
            {hasNutritionErrors && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Requires attention" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 relative ${
              activeTab === 'details'
                ? 'bg-[#3D261E] text-white shadow-xs'
                : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'
            }`}
          >
            <Wheat className="w-3.5 h-3.5" />
            <span>3. Ingredients & Specs</span>
            {hasDetailsErrors && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Requires attention" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 relative ${
              activeTab === 'image'
                ? 'bg-[#3D261E] text-white shadow-xs'
                : 'text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF0E4]/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>4. Product Image</span>
            {hasImageErrors && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Requires attention" />
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: BASIC INFORMATION & PRICING */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#3D261E]">
                      Product Name *
                    </label>
                    {nameAutoFormatted && (
                      <span className="text-[10px] font-semibold text-[#C97D36] flex items-center gap-1 bg-[#FAF0E4] px-2 py-0.5 rounded-md animate-in fade-in">
                        <Sparkles className="w-3 h-3" /> Auto-formatted to Title Case
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      if (errors.name) {
                        setErrors(prev => {
                          const next = { ...prev };
                          delete next.name;
                          return next;
                        });
                      }
                    }}
                    onBlur={handleNameBlur}
                    placeholder="e.g. Chocolate Almond Cake"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-[#2A1F1B] focus:outline-none transition-colors ${
                      errors.name ? 'border-red-500 focus:border-red-500 bg-red-50/20' : 'border-[#E8DDCF] focus:border-[#C97D36]'
                    }`}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-[#2A1F1B]/50">
                      Requirement: First letter of every word must be uppercase.
                    </p>
                    {errors.name && (
                      <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D261E] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] focus:outline-none focus:border-[#C97D36]"
                  >
                    <option value="cupcakes">Cupcakes</option>
                    <option value="cookies">Cookies</option>
                    <option value="nutriballs">NutriBalls</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D261E] mb-1.5">
                    Price (PKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#2A1F1B]/50">PKR</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      value={pricePkr}
                      onChange={e => {
                        setPricePkr(e.target.value === '' ? '' : Number(e.target.value));
                        if (errors.pricePkr) {
                          setErrors(prev => {
                            const next = { ...prev };
                            delete next.pricePkr;
                            return next;
                          });
                        }
                      }}
                      onBlur={handlePriceBlur}
                      placeholder="50"
                      className={`w-full pl-12 pr-3.5 py-2.5 bg-white border rounded-xl text-xs text-[#2A1F1B] focus:outline-none font-semibold ${
                        errors.pricePkr ? 'border-red-500 focus:border-red-500 bg-red-50/20' : 'border-[#E8DDCF] focus:border-[#C97D36]'
                      }`}
                    />
                  </div>
                  {errors.pricePkr && (
                    <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.pricePkr}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#3D261E] mb-1.5">
                    Tagline / Key Nutrition Claim (Optional)
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    placeholder="e.g. High-amylose prebiotic treat with green banana flour"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] focus:outline-none focus:border-[#C97D36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D261E] mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the product taste, texture, and bakery craftsmanship..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] focus:outline-none focus:border-[#C97D36]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: NUTRITION PROFILE */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className="text-xs text-[#2A1F1B]/60">
                Nutritional values calibrated per single serving.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div className="bg-white p-3 rounded-xl border border-[#E8DDCF]">
                  <label className="text-[11px] font-semibold text-[#2A1F1B]/70 block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={e => setCalories(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8DDCF] rounded-lg text-xs font-semibold text-[#3D261E]"
                  />
                </div>

                <div className="bg-[#FAF0E4]/60 p-3 rounded-xl border border-[#D4E0CD]">
                  <label className="text-[11px] font-bold text-[#5E7252] block mb-1">Dietary Fiber (g) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dietaryFiberGrams}
                    onChange={e => setDietaryFiberGrams(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#5E7252] rounded-lg text-xs font-bold text-[#5E7252]"
                  />
                </div>

                <div className="bg-[#FAF0E4]/60 p-3 rounded-xl border border-[#FED7AA]">
                  <label className="text-[11px] font-bold text-[#C97D36] block mb-1">Prebiotic RS2 (g) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={resistantStarchGrams}
                    onChange={e => setResistantStarchGrams(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#C97D36] rounded-lg text-xs font-bold text-[#C97D36]"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E8DDCF]">
                  <label className="text-[11px] font-semibold text-[#2A1F1B]/70 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={proteinGrams}
                    onChange={e => setProteinGrams(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8DDCF] rounded-lg text-xs font-semibold text-[#3D261E]"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E8DDCF]">
                  <label className="text-[11px] font-semibold text-[#2A1F1B]/70 block mb-1">Estimated GI</label>
                  <input
                    type="number"
                    value={glycemicIndexEst}
                    onChange={e => setGlycemicIndexEst(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8DDCF] rounded-lg text-xs font-semibold text-[#3D261E]"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E8DDCF]">
                  <label className="text-[11px] font-semibold text-[#2A1F1B]/70 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={carbsGrams}
                    onChange={e => setCarbsGrams(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8DDCF] rounded-lg text-xs font-semibold text-[#3D261E]"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E8DDCF]">
                  <label className="text-[11px] font-semibold text-[#2A1F1B]/70 block mb-1">Sugars (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sugarsGrams}
                    onChange={e => setSugarsGrams(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8DDCF] rounded-lg text-xs font-semibold text-[#3D261E]"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E8DDCF]">
                  <label className="text-[11px] font-semibold text-[#2A1F1B]/70 block mb-1">Total Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={totalFatGrams}
                    onChange={e => setTotalFatGrams(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8DDCF] rounded-lg text-xs font-semibold text-[#3D261E]"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E8DDCF]">
                  <label className="text-[11px] font-semibold text-[#2A1F1B]/70 block mb-1">Sat Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={saturatedFatGrams}
                    onChange={e => setSaturatedFatGrams(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8DDCF] rounded-lg text-xs font-semibold text-[#3D261E]"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E8DDCF]">
                  <label className="text-[11px] font-semibold text-[#2A1F1B]/70 block mb-1">Sodium (mg)</label>
                  <input
                    type="number"
                    value={sodiumMg}
                    onChange={e => setSodiumMg(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8DDCF] rounded-lg text-xs font-semibold text-[#3D261E]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INGREDIENTS & PRODUCT DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D261E] mb-1.5">
                    Serving / Portion Size (Optional)
                  </label>
                  <input
                    type="text"
                    value={servingSize}
                    onChange={e => setServingSize(e.target.value)}
                    placeholder="e.g. 1 Cupcake (65g)"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] focus:outline-none focus:border-[#C97D36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D261E] mb-1.5">
                    Batch Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={batchCode}
                    onChange={e => setBatchCode(e.target.value)}
                    placeholder="e.g. NB-BATCH-01"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] font-mono focus:outline-none focus:border-[#C97D36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D261E] mb-1.5">
                    Status *
                  </label>
                  <select
                    value={labStatus}
                    onChange={e => setLabStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] focus:outline-none focus:border-[#C97D36]"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Formulation Testing">Formulation Testing</option>
                    <option value="Sensory Trial">Sensory Trial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D261E] mb-1.5">
                  Core Functional Ingredient (Optional)
                </label>
                <input
                  type="text"
                  value={mainFunctionalIngredient}
                  onChange={e => setMainFunctionalIngredient(e.target.value)}
                  placeholder="e.g. Green Banana Flour (Musa acuminata)"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] focus:outline-none focus:border-[#C97D36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D261E] mb-1.5">
                  Full Ingredient Listing (Optional, comma-separated)
                </label>
                <textarea
                  rows={2}
                  value={allIngredientsText}
                  onChange={e => setAllIngredientsText(e.target.value)}
                  placeholder="Green Banana Flour, Rolled Oats, Chicory Inulin, Flaxseed..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] focus:outline-none focus:border-[#C97D36]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D261E] mb-1.5">
                    Allergens (Optional, comma-separated, or 'None')
                  </label>
                  <input
                    type="text"
                    value={allergensText}
                    onChange={e => setAllergensText(e.target.value)}
                    placeholder="None, or Tree Nuts (Almonds)"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] focus:outline-none focus:border-[#C97D36]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="childFriendly"
                    checked={childFriendly}
                    onChange={e => setChildFriendly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#3D261E] border-[#E8DDCF] focus:ring-0"
                  />
                  <label htmlFor="childFriendly" className="text-xs font-semibold text-[#3D261E] cursor-pointer">
                    Child & Family Friendly (School lunchbox safe)
                  </label>
                </div>
              </div>

              {/* Sensory Score Targets */}
              <div className="pt-2 border-t border-[#E8DDCF]">
                <span className="text-xs font-bold text-[#3D261E] block mb-2">
                  Sensory Quality Panel Targets (0 - 100%)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-[#2A1F1B]/70 block mb-1">Taste (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={taste}
                      onChange={e => setTaste(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E8DDCF] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#2A1F1B]/70 block mb-1">Texture (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={texture}
                      onChange={e => setTexture(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E8DDCF] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#2A1F1B]/70 block mb-1">Aroma (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={aroma}
                      onChange={e => setAroma(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E8DDCF] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#2A1F1B]/70 block mb-1">Appearance (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={appearance}
                      onChange={e => setAppearance(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E8DDCF] rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCT IMAGE */}
          {activeTab === 'image' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-white rounded-2xl border border-[#E8DDCF]">
                {/* Image Preview */}
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#FAF0E4] border border-[#E8DDCF] shrink-0 relative flex items-center justify-center shadow-xs">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="Product Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/hero_bakery_still_life_1788459814680.jpg';
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#C97D36]/40" />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-[#C97D36] animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#3D261E] mb-1">
                      Product Image * (Web URL or laboratory photo)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={e => {
                          setImageUrl(e.target.value);
                          if (errors.imageUrl) {
                            setErrors(prev => {
                              const next = { ...prev };
                              delete next.imageUrl;
                              return next;
                            });
                          }
                        }}
                        placeholder="/src/assets/images/nutribake_cupcakes_1789159074122.jpg"
                        className={`flex-1 px-3.5 py-2 bg-[#FAF7F2] border rounded-xl text-xs text-[#2A1F1B] focus:outline-none ${
                          errors.imageUrl ? 'border-red-500 bg-red-50/20' : 'border-[#E8DDCF] focus:border-[#C97D36]'
                        }`}
                      />
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-[#3D261E] hover:bg-[#C97D36] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                      </button>
                    </div>
                    {errors.imageUrl && (
                      <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.imageUrl}
                      </p>
                    )}
                    {uploadError && (
                      <p className="text-xs text-rose-600 mt-1">{uploadError}</p>
                    )}
                  </div>

                  {/* Preset Library Buttons */}
                  <div>
                    <span className="text-[11px] font-bold text-[#2A1F1B]/70 block mb-1.5">
                      Or select an existing laboratory bakery photo:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {GALLERY_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setImageUrl(preset.path);
                            if (errors.imageUrl) {
                              setErrors(prev => {
                                const next = { ...prev };
                                delete next.imageUrl;
                                return next;
                              });
                            }
                          }}
                          className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                            imageUrl === preset.path
                              ? 'bg-[#3D261E] text-white border-[#3D261E]'
                              : 'bg-[#FAF7F2] hover:bg-[#FAF0E4] text-[#3D261E] border-[#E8DDCF]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E8DDCF]">
            <div className="text-xs text-[#2A1F1B]/60">
              Tab {activeTab === 'basic' ? '1/4' : activeTab === 'nutrition' ? '2/4' : activeTab === 'details' ? '3/4' : '4/4'}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#E8DDCF] bg-white hover:bg-[#FAF0E4] text-[#3D261E] rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              {activeTab !== 'image' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'basic') setActiveTab('nutrition');
                    else if (activeTab === 'nutrition') setActiveTab('details');
                    else if (activeTab === 'details') setActiveTab('image');
                  }}
                  className="px-4 py-2 bg-[#FAF0E4] hover:bg-[#3D261E] text-[#3D261E] hover:text-white rounded-xl text-xs font-semibold transition-colors border border-[#E8DDCF]"
                >
                  Next Section →
                </button>
              ) : null}

              <button
                type="submit"
                className="px-5 py-2 bg-[#3D261E] hover:bg-[#2A1A14] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{initialProduct ? 'Save Changes' : 'Add Product'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
