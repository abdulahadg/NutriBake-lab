export type ViewMode = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'nutrition' 
  | 'recommendations' 
  | 'family' 
  | 'science' 
  | 'research' 
  | 'about' 
  | 'contact' 
  | 'dashboard' 
  | 'admin' 
  | 'login' 
  | 'signup';

export interface NutritionFacts {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  dietaryFiberGrams: number;
  sugarsGrams: number;
  totalFatGrams: number;
  saturatedFatGrams: number;
  sodiumMg: number;
  resistantStarchGrams: number;
  glycemicIndexEst: number; // e.g., 42 (Low)
}

export interface SensoryScore {
  taste: number; // 0-100
  texture: number; // 0-100
  aroma: number; // 0-100
  appearance: number; // 0-100
  overallAcceptability: number; // 0-100
  panelNotes: string;
}

export type ProductCategory = 'cupcakes' | 'cookies' | 'nutriballs';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  whyThisProduct: string;
  nutritionScore: number; // 0 - 100
  nutrition: NutritionFacts;
  mainFunctionalIngredient: string;
  allIngredients: string[];
  functionalIngredients: {
    name: string;
    role: string;
    scientificBenefit: string;
  }[];
  allergens: string[];
  dietaryTags: string[];
  sensoryScores: SensoryScore;
  servingSize: string;
  portionSize?: string;
  netWeight?: string;
  pricePkr?: number;
  shelfLife: string;
  storageInstructions: string;
  allergenInformation?: string;
  crossContamination?: string;
  imageUrl: string;
  isFeatured?: boolean;
  childFriendly: boolean;
  batchCode?: string;
  labStatus?: 'Approved' | 'Formulation Testing' | 'Sensory Trial';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  department?: string;
  subRole?: string;
  idNumber?: string;
  institution?: string;
  expertise?: string[];
  focus?: string;
  displayOrder?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AcademicSupervisor {
  name: string;
  title: string;
  department: string;
  institution: string;
  role: string;
  bio: string;
  designation?: string;
  supervisoryFocus?: string;
  highlights?: string[];
  avatarUrl?: string;
  email?: string;
}

export interface IngredientProfile {
  id: string;
  name: string;
  category: 'Flour' | 'Nut' | 'Natural Fiber' | 'Seed' | 'Natural Sweetener';
  description: string;
  functionInBaking: string;
  nutritionalRole: string;
  scientificInsight: string;
  productsUsedIn: string[];
  imageUrl: string;
  fiberYield: string;
  glycemicRating: 'Very Low' | 'Low' | 'Moderate';
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  abstract: string;
  keyFinding: string;
  nutriBakeApplication: string;
  tags: string[];
}

export interface RecommendationAnswers {
  ageGroup: 'teen' | 'young-adult' | 'adult' | 'senior';
  activityLevel: 'sedentary' | 'moderate' | 'active';
  dietaryPreference: 'standard' | 'vegetarian' | 'vegan' | 'gluten-conscious';
  primaryGoal: 'everyday-health' | 'higher-fiber' | 'balanced-nutrition' | 'better-choices' | 'family-friendly';
  preferences: string[]; // e.g. ['low-sugar', 'nut-friendly', 'dairy-free', 'banana-flour']
  allergenRestrictions: string[];
}

export interface RecommendationMatch {
  product: Product;
  matchScore: number; // 0 - 100
  reasons: {
    nutritionMatch: string;
    ingredientMatch: string;
    preferenceMatch: string;
  };
}

export interface UserPreferences {
  dailyFiberTargetGrams?: number;
  dietaryGoal?: string;
  allergens?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  ageGroup?: string;
  dietaryPreference?: string;
  savedProductIds: string[];
  savedProducts?: string[];
  preferences?: UserPreferences;
  dailyFiberGoalGrams: number;
  currentFiberIntakeGrams: number;
  recommendationHistoryCount: number;
  memberSince: string;
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'nutrition-tip' | 'batch-update' | 'warning';
  date: string;
  read: boolean;
  relatedProductId?: string;
  active?: boolean;
}

export type ClinicalAlert = AlertNotification;

export interface AdminAnalytics {
  totalUsers: number;
  totalProducts: number;
  activeRecommendations: number;
  nutritionRecords: number;
  topCategories: { category: string; count: number; percentage: number }[];
  weeklyRecommendationRuns: { day: string; count: number }[];
  sensoryAcceptabilityAvg: number;
}

export interface DailyIntakeLogEntry {
  id: string;
  productId: string;
  productName: string;
  portionDescription: string;
  mealTime: 'breakfast' | 'morning-snack' | 'lunch' | 'afternoon-snack' | 'dinner';
  servings: number;
  fiberGrams: number;
  resistantStarchGrams: number;
  calories: number;
  proteinGrams: number;
  timestamp: string;
}

export type SampleOrderStatus = 
  | 'Pending Formulation' 
  | 'Lab Blended' 
  | 'Sensory Checked' 
  | 'Dispatched' 
  | 'Delivered';

export interface SampleOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  batchCode?: string;
}

export interface SampleTrialOrder {
  id: string;
  orderNumber: string;
  date: string;
  items: SampleOrderItem[];
  recipientName: string;
  email: string;
  address: string;
  status: SampleOrderStatus;
  trialType: 'Clinical Study' | 'Family Nutrition' | 'Consumer Tasting' | 'Academic Panel';
  trackingNotes?: string;
}

export interface SensoryTrialEntry {
  id: string;
  productId: string;
  productName: string;
  batchCode: string;
  panelistName: string;
  panelistType: 'Trained Descriptive' | 'Consumer Hedonic' | 'Faculty Supervisor' | 'Student Tester' | 'Student Researcher';
  date: string;
  taste: number;
  texture: number;
  aroma: number;
  appearance: number;
  overallAcceptability: number;
  hedonicScale9: number;
  panelNotes: string;
}

export interface ProductTastingNote {
  productId: string;
  rating: number;
  notes: string;
  date: string;
}

export interface ChildFamilyProfile {
  id: string;
  name: string;
  age: number;
  allergies: string[];
  favoriteProducts: string[];
  fiberTarget: number;
  notes: string;
}
