import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { 
  Product, 
  UserProfile, 
  DailyIntakeLogEntry, 
  SampleTrialOrder, 
  SensoryTrialEntry, 
  ProductTastingNote, 
  ChildFamilyProfile, 
  AlertNotification,
  SampleOrderStatus,
  TeamMember 
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_USER, INITIAL_ALERTS, INITIAL_TEAM_MEMBERS } from '../data/mockData';
import { 
  INITIAL_DAILY_LOGS, 
  INITIAL_SAMPLE_ORDERS, 
  INITIAL_SENSORY_TRIALS, 
  INITIAL_TASTING_NOTES, 
  INITIAL_FAMILY_PROFILES 
} from '../data/portalMockData';
import cupcakesImg from '../assets/images/nutribake_cupcakes_1789159074122.jpg';
import cookiesImg from '../assets/images/nutribake_cookies_1789159094420.jpg';
import nutriballsImg from '../assets/images/nutribake_nutriballs_1789159111855.jpg';

const PRODUCT_IMAGE_FALLBACKS: Record<string, string> = {
  'prod-cupcakes': cupcakesImg,
  'prod-cookies': cookiesImg,
  'prod-nutriballs': nutriballsImg,
};

export const resolveProductImageUrl = (productId?: string, imageUrl?: string): string => {
  // If imageUrl is already a remote URL (http/https), data URL, blob URL, or asset path, keep it
  if (imageUrl && (
    imageUrl.startsWith('http://') || 
    imageUrl.startsWith('https://') || 
    imageUrl.startsWith('data:') ||
    imageUrl.startsWith('blob:') ||
    imageUrl.startsWith('/')
  )) {
    return imageUrl;
  }
  // Check known map by product ID
  if (productId && PRODUCT_IMAGE_FALLBACKS[productId]) {
    return PRODUCT_IMAGE_FALLBACKS[productId];
  }
  // Check product ID keywords
  if (productId) {
    const pLower = productId.toLowerCase();
    if (pLower.includes('cupcake')) return cupcakesImg;
    if (pLower.includes('cookie')) return cookiesImg;
    if (pLower.includes('nutriball') || pLower.includes('ball')) return nutriballsImg;
  }
  // If imageUrl contains product keywords
  if (imageUrl) {
    const iLower = imageUrl.toLowerCase();
    if (iLower.includes('cupcake')) return cupcakesImg;
    if (iLower.includes('cookie')) return cookiesImg;
    if (iLower.includes('nutriball') || iLower.includes('ball')) return nutriballsImg;
    return imageUrl;
  }
  return cupcakesImg;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export interface UserProfileRecord {
  id: string;
  email?: string;
  name: string;
  role: 'admin' | 'user';
  daily_fiber_target?: number;
  dietary_goal?: string;
  allergens?: string[];
  created_at?: string;
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
);

// Active role state for API security authorization
let currentAppUserRole: string | undefined = undefined;
export const setActiveUserRole = (role?: string) => {
  currentAppUserRole = role;
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (currentAppUserRole) {
    headers['X-User-Role'] = currentAppUserRole;
  }
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  } catch {
    // Ignore
  }
  return headers;
};

// ==========================================
// 1. DATA MAPPERS (Database Snake Case <-> App Types)
// ==========================================

export const mapDbProductToApp = (db: any): Product => ({
  id: db.id,
  name: db.name,
  category: db.category,
  tagline: db.tagline || '',
  description: db.description || '',
  whyThisProduct: db.why_this_product || '',
  nutritionScore: db.nutrition_score ?? 90,
  nutrition: db.nutrition || {
    calories: 180,
    proteinGrams: 5,
    carbsGrams: 24,
    dietaryFiberGrams: 6,
    sugarsGrams: 4,
    totalFatGrams: 7,
    saturatedFatGrams: 1,
    sodiumMg: 110,
    resistantStarchGrams: 3,
    glycemicIndexEst: 42
  },
  mainFunctionalIngredient: db.main_functional_ingredient || '',
  allIngredients: Array.isArray(db.all_ingredients) ? db.all_ingredients : [],
  functionalIngredients: Array.isArray(db.functional_ingredients) ? db.functional_ingredients : [],
  allergens: Array.isArray(db.allergens) ? db.allergens : [],
  dietaryTags: Array.isArray(db.dietary_tags) ? db.dietary_tags : [],
  sensoryScores: db.sensory_scores || {
    taste: 90,
    texture: 88,
    aroma: 92,
    appearance: 89,
    overallAcceptability: 91,
    panelNotes: 'Balanced formulation'
  },
  servingSize: db.serving_size || '',
  portionSize: db.portion_size,
  netWeight: db.net_weight,
  pricePkr: db.price_pkr != null ? Number(db.price_pkr) : undefined,
  shelfLife: db.shelf_life || '14 Days',
  storageInstructions: db.storage_instructions || 'Store in a cool, dry place',
  allergenInformation: db.allergen_information,
  crossContamination: db.cross_contamination,
  imageUrl: resolveProductImageUrl(db.id, db.image_url),
  isFeatured: db.is_featured ?? false,
  childFriendly: db.child_friendly ?? false,
  batchCode: db.batch_code,
  labStatus: db.lab_status || 'Approved',
});

export const mapAppProductToDb = (app: Product | Omit<Product, 'id'>, id?: string): any => ({
  id: id || ('id' in app ? app.id : `prod-${Date.now()}`),
  name: app.name,
  category: app.category,
  tagline: app.tagline,
  description: app.description,
  why_this_product: app.whyThisProduct,
  nutrition_score: app.nutritionScore,
  nutrition: app.nutrition,
  main_functional_ingredient: app.mainFunctionalIngredient,
  all_ingredients: app.allIngredients,
  functional_ingredients: app.functionalIngredients,
  allergens: app.allergens,
  dietary_tags: app.dietaryTags,
  sensory_scores: app.sensoryScores,
  serving_size: app.servingSize,
  portion_size: app.portionSize,
  net_weight: app.netWeight,
  price_pkr: app.pricePkr,
  shelf_life: app.shelfLife,
  storage_instructions: app.storageInstructions,
  allergen_information: app.allergenInformation,
  cross_contamination: app.crossContamination,
  image_url: app.imageUrl,
  is_featured: app.isFeatured ?? false,
  child_friendly: app.childFriendly ?? false,
  batch_code: app.batchCode,
  lab_status: app.labStatus || 'Approved',
  updated_at: new Date().toISOString()
});

export const mapDbProfileToApp = (db: any, emailFallback?: string): UserProfile => ({
  id: db.id,
  name: db.name || 'User',
  email: db.email || emailFallback || '',
  role: db.role === 'admin' ? 'admin' : 'user',
  avatar: db.avatar,
  ageGroup: db.age_group,
  dietaryPreference: db.dietary_preference,
  savedProductIds: Array.isArray(db.saved_product_ids) ? db.saved_product_ids : [],
  savedProducts: Array.isArray(db.saved_product_ids) ? db.saved_product_ids : [],
  preferences: db.preferences || {
    dailyFiberTargetGrams: 28,
    dietaryGoal: 'High Fiber & Gut Vitality',
    allergens: []
  },
  dailyFiberGoalGrams: db.daily_fiber_goal_grams != null ? Number(db.daily_fiber_goal_grams) : 28,
  currentFiberIntakeGrams: db.current_fiber_intake_grams != null ? Number(db.current_fiber_intake_grams) : 0,
  recommendationHistoryCount: db.recommendation_history_count ?? 0,
  memberSince: db.member_since || 'Recent Member'
});

export const mapDbIntakeLogToApp = (db: any): DailyIntakeLogEntry => ({
  id: db.id,
  productId: db.product_id,
  productName: db.product_name,
  portionDescription: db.portion_description || '',
  mealTime: db.meal_time,
  servings: Number(db.servings) || 1,
  fiberGrams: Number(db.fiber_grams) || 0,
  resistantStarchGrams: Number(db.resistant_starch_grams) || 0,
  calories: Number(db.calories) || 0,
  proteinGrams: Number(db.protein_grams) || 0,
  timestamp: db.timestamp || 'Today'
});

export const mapAppIntakeLogToDb = (app: DailyIntakeLogEntry, userId?: string): any => ({
  id: app.id,
  user_id: userId || null,
  product_id: app.productId || null,
  product_name: app.productName,
  portion_description: app.portionDescription || '',
  meal_time: app.mealTime || 'breakfast',
  servings: Number(app.servings) || 1,
  fiber_grams: Number(app.fiberGrams) || 0,
  resistant_starch_grams: Number(app.resistantStarchGrams) || 0,
  calories: Number(app.calories) || 0,
  protein_grams: Number(app.proteinGrams) || 0,
  timestamp: app.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
});

export const mapDbOrderToApp = (db: any): SampleTrialOrder => ({
  id: db.id,
  orderNumber: db.order_number,
  date: db.date,
  items: Array.isArray(db.items) ? db.items : [],
  recipientName: db.recipient_name,
  email: db.email,
  address: db.address,
  status: db.status as SampleOrderStatus,
  trialType: db.trial_type,
  trackingNotes: db.tracking_notes
});

export const mapAppOrderToDb = (app: SampleTrialOrder, userId?: string): any => ({
  id: app.id,
  user_id: userId || null,
  order_number: app.orderNumber,
  date: app.date,
  recipient_name: app.recipientName,
  email: app.email,
  address: app.address,
  status: app.status,
  trial_type: app.trialType,
  tracking_notes: app.trackingNotes,
  items: app.items,
  updated_at: new Date().toISOString()
});

export const mapDbSensoryToApp = (db: any): SensoryTrialEntry => ({
  id: db.id,
  productId: db.product_id || '',
  productName: db.product_name,
  batchCode: db.batch_code,
  panelistName: db.panelist_name,
  panelistType: db.panelist_type,
  date: db.date,
  taste: Number(db.taste) || 0,
  texture: Number(db.texture) || 0,
  aroma: Number(db.aroma) || 0,
  appearance: Number(db.appearance) || 0,
  overallAcceptability: Number(db.overall_acceptability) || 0,
  hedonicScale9: Number(db.hedonic_scale9) || 7,
  panelNotes: db.panel_notes || ''
});

export const mapAppSensoryToDb = (app: SensoryTrialEntry): any => ({
  id: app.id,
  product_id: app.productId || null,
  product_name: app.productName,
  batch_code: app.batchCode,
  panelist_name: app.panelistName,
  panelist_type: app.panelistType,
  date: app.date,
  taste: app.taste,
  texture: app.texture,
  aroma: app.aroma,
  appearance: app.appearance,
  overall_acceptability: app.overallAcceptability,
  hedonic_scale9: app.hedonicScale9,
  panel_notes: app.panelNotes
});

export const mapDbFamilyToApp = (db: any): ChildFamilyProfile => ({
  id: db.id,
  name: db.name,
  age: Number(db.age) || 0,
  allergies: Array.isArray(db.allergies) ? db.allergies : [],
  favoriteProducts: Array.isArray(db.favorite_products) ? db.favorite_products : [],
  fiberTarget: Number(db.fiber_target) || 25,
  notes: db.notes || ''
});

export const mapDbTeamToApp = (db: any): TeamMember => ({
  id: db.id,
  name: db.name || '',
  role: db.role || '',
  bio: db.bio || db.focus || '',
  focus: db.bio || db.focus || '',
  department: db.department || 'Department of Software Engineering',
  subRole: db.sub_role || db.subRole || '',
  idNumber: db.id_number || db.idNumber || '',
  institution: db.institution || 'University of Sindh, Jamshoro',
  expertise: Array.isArray(db.expertise) ? db.expertise : [],
  displayOrder: db.display_order != null ? Number(db.display_order) : undefined,
  created_at: db.created_at,
  updated_at: db.updated_at
});

export const mapAppTeamToDb = (app: TeamMember | Omit<TeamMember, 'id'>, id?: string): any => ({
  id: id || ('id' in app ? app.id : `team-${Date.now()}`),
  name: app.name,
  role: app.role,
  bio: app.bio || app.focus || '',
  department: app.department || 'Department of Software Engineering',
  sub_role: app.subRole || '',
  id_number: app.idNumber || '',
  institution: app.institution || 'University of Sindh, Jamshoro',
  expertise: Array.isArray(app.expertise) ? app.expertise : [],
  display_order: app.displayOrder ?? 99,
  updated_at: new Date().toISOString()
});

export const mapAppFamilyToDb = (app: ChildFamilyProfile, userId?: string): any => ({
  id: app.id,
  user_id: userId || null,
  name: app.name,
  age: app.age,
  allergies: app.allergies,
  favorite_products: app.favoriteProducts,
  fiber_target: app.fiberTarget,
  notes: app.notes,
  updated_at: new Date().toISOString()
});

export const mapDbAlertToApp = (db: any): AlertNotification => ({
  id: db.id,
  title: db.title,
  message: db.message,
  type: db.type,
  date: db.date,
  read: db.read ?? false
});

export const mapAppAlertToDb = (app: AlertNotification, userId?: string): any => ({
  id: app.id,
  user_id: userId || null,
  title: app.title,
  message: app.message,
  type: app.type,
  date: app.date,
  read: app.read ?? false
});

// ==========================================
// 2. SUPABASE CRUD DATA SERVICES
// ==========================================

export const productsService = {
  async getAll(): Promise<Product[]> {
    if (!isSupabaseConfigured) return INITIAL_PRODUCTS;
    // 1. Try server-side privileged endpoint
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch('/api/products');
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            return json.data.map(mapDbProductToApp);
          }
        }
      }
    } catch {
      // Fall through to direct Supabase client
    }

    // 2. Direct client query
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[NutriBake Supabase] Database unavailable or table uninitialized, using baseline catalog:', error.message);
        return INITIAL_PRODUCTS;
      }
      if (data && data.length > 0) {
        return data.map(mapDbProductToApp);
      }
      return INITIAL_PRODUCTS;
    } catch (e: any) {
      console.warn('[NutriBake Supabase] Products query caught error:', e?.message);
      return INITIAL_PRODUCTS;
    }
  },

  async insert(product: Product): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    const payload = mapAppProductToDb(product);

    // Try server endpoint
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const headers = await getAuthHeaders();
        const res = await fetch('/api/products', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        if (res.ok) return true;
        const errJson = await res.json().catch(() => ({}));
        if (res.status === 403) {
          throw new Error(errJson.error || 'Access denied: Admin role required to create products.');
        }
      }
    } catch (e: any) {
      if (e?.message?.includes('Access denied') || e?.message?.includes('Forbidden')) throw e;
      // Fall through
    }

    try {
      const { error } = await supabase.from('products').upsert(payload);
      return !error;
    } catch {
      return false;
    }
  },

  async update(id: string, updates: Partial<Product>): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.tagline !== undefined) dbUpdates.tagline = updates.tagline;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.whyThisProduct !== undefined) dbUpdates.why_this_product = updates.whyThisProduct;
    if (updates.nutritionScore !== undefined) dbUpdates.nutrition_score = updates.nutritionScore;
    if (updates.nutrition !== undefined) dbUpdates.nutrition = updates.nutrition;
    if (updates.mainFunctionalIngredient !== undefined) dbUpdates.main_functional_ingredient = updates.mainFunctionalIngredient;
    if (updates.allIngredients !== undefined) dbUpdates.all_ingredients = updates.allIngredients;
    if (updates.functionalIngredients !== undefined) dbUpdates.functional_ingredients = updates.functionalIngredients;
    if (updates.allergens !== undefined) dbUpdates.allergens = updates.allergens;
    if (updates.dietaryTags !== undefined) dbUpdates.dietary_tags = updates.dietaryTags;
    if (updates.sensoryScores !== undefined) dbUpdates.sensory_scores = updates.sensoryScores;
    if (updates.servingSize !== undefined) dbUpdates.serving_size = updates.servingSize;
    if (updates.portionSize !== undefined) dbUpdates.portion_size = updates.portionSize;
    if (updates.netWeight !== undefined) dbUpdates.net_weight = updates.netWeight;
    if (updates.pricePkr !== undefined) dbUpdates.price_pkr = updates.pricePkr;
    if (updates.shelfLife !== undefined) dbUpdates.shelf_life = updates.shelfLife;
    if (updates.storageInstructions !== undefined) dbUpdates.storage_instructions = updates.storageInstructions;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
    if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
    if (updates.childFriendly !== undefined) dbUpdates.child_friendly = updates.childFriendly;
    if (updates.batchCode !== undefined) dbUpdates.batch_code = updates.batchCode;
    if (updates.labStatus !== undefined) dbUpdates.lab_status = updates.labStatus;

    // Try server endpoint
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const headers = await getAuthHeaders();
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(dbUpdates)
        });
        if (res.ok) return true;
        const errJson = await res.json().catch(() => ({}));
        if (res.status === 403) {
          throw new Error(errJson.error || 'Access denied: Admin role required to update products.');
        }
      }
    } catch (e: any) {
      if (e?.message?.includes('Access denied') || e?.message?.includes('Forbidden')) throw e;
      // Fall through
    }

    try {
      const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    // Try server endpoint
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const headers = await getAuthHeaders();
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers
        });
        if (res.ok) return true;
        const errJson = await res.json().catch(() => ({}));
        if (res.status === 403) {
          throw new Error(errJson.error || 'Access denied: Admin role required to delete products.');
        }
      }
    } catch (e: any) {
      if (e?.message?.includes('Access denied') || e?.message?.includes('Forbidden')) throw e;
      // Fall through
    }

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }
};

export const intakeLogsService = {
  async getForUser(userId?: string): Promise<DailyIntakeLogEntry[]> {
    if (!isSupabaseConfigured) return INITIAL_DAILY_LOGS;
    try {
      let query = supabase.from('daily_intake_logs').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[NutriBake Supabase] Intake logs query fallback:', error.message);
        return INITIAL_DAILY_LOGS;
      }
      if (data && data.length > 0) {
        return data.map(mapDbIntakeLogToApp);
      }
      return INITIAL_DAILY_LOGS;
    } catch {
      return INITIAL_DAILY_LOGS;
    }
  },

  async insert(log: DailyIntakeLogEntry, userId?: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const payload = mapAppIntakeLogToDb(log, userId);
      const { error } = await supabase.from('daily_intake_logs').insert(payload);
      return !error;
    } catch {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('daily_intake_logs').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async clearAll(userId?: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      let query = supabase.from('daily_intake_logs').delete();
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.neq('id', '');
      }
      const { error } = await query;
      return !error;
    } catch {
      return false;
    }
  }
};

export const sampleOrdersService = {
  async getAll(userId?: string, isAdmin?: boolean): Promise<SampleTrialOrder[]> {
    if (!isSupabaseConfigured) return INITIAL_SAMPLE_ORDERS;
    // 1. Try server-side endpoint
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const queryParam = userId && !isAdmin ? `?userId=${encodeURIComponent(userId)}` : '';
        const res = await fetch(`/api/sample-orders${queryParam}`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            return json.data.map(mapDbOrderToApp);
          }
        }
      }
    } catch {
      // Fall through
    }

    // 2. Direct client query
    try {
      let query = supabase.from('sample_orders').select('*').order('created_at', { ascending: false });
      if (userId && !isAdmin) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[NutriBake Supabase] Sample orders query fallback:', error.message);
        return INITIAL_SAMPLE_ORDERS;
      }
      if (data && data.length > 0) {
        return data.map(mapDbOrderToApp);
      }
      return INITIAL_SAMPLE_ORDERS;
    } catch {
      return INITIAL_SAMPLE_ORDERS;
    }
  },

  async insert(order: SampleTrialOrder, userId?: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    const payload = mapAppOrderToDb(order, userId);

    // Try server endpoint
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch('/api/sample-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return true;
      }
    } catch {
      // Fall through
    }

    try {
      const { error } = await supabase.from('sample_orders').insert(payload);
      return !error;
    } catch {
      return false;
    }
  },

  async updateStatus(id: string, status: SampleOrderStatus, notes?: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (notes !== undefined) updates.tracking_notes = notes;

    // Try server endpoint
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch(`/api/sample-orders/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (res.ok) return true;
      }
    } catch {
      // Fall through
    }

    try {
      const { error } = await supabase.from('sample_orders').update(updates).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch(`/api/sample-orders/${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
        if (res.ok) return true;
      }
    } catch {
      // Fall through
    }
    try {
      const { error } = await supabase.from('sample_orders').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }
};

export const sensoryTrialsService = {
  async getAll(): Promise<SensoryTrialEntry[]> {
    if (!isSupabaseConfigured) return INITIAL_SENSORY_TRIALS;
    try {
      const { data, error } = await supabase
        .from('sensory_trials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('[NutriBake Supabase] Sensory trials query fallback:', error.message);
        return INITIAL_SENSORY_TRIALS;
      }
      if (data && data.length > 0) {
        return data.map(mapDbSensoryToApp);
      }
      return INITIAL_SENSORY_TRIALS;
    } catch {
      return INITIAL_SENSORY_TRIALS;
    }
  },

  async insert(trial: SensoryTrialEntry): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const payload = mapAppSensoryToDb(trial);
      const { error } = await supabase.from('sensory_trials').insert(payload);
      return !error;
    } catch {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('sensory_trials').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }
};

export const tastingNotesService = {
  async getForUser(userId?: string): Promise<Record<string, ProductTastingNote>> {
    if (!isSupabaseConfigured) return INITIAL_TASTING_NOTES;
    try {
      let query = supabase.from('product_tasting_notes').select('*');
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[NutriBake Supabase] Tasting notes query fallback:', error.message);
        return INITIAL_TASTING_NOTES;
      }
      if (data && data.length > 0) {
        const notesMap: Record<string, ProductTastingNote> = {};
        data.forEach((row: any) => {
          notesMap[row.product_id] = {
            productId: row.product_id,
            rating: row.rating,
            notes: row.notes,
            date: row.date
          };
        });
        return notesMap;
      }
      return INITIAL_TASTING_NOTES;
    } catch {
      return INITIAL_TASTING_NOTES;
    }
  },

  async upsert(productId: string, rating: number, notes: string, date: string, userId?: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const payload = {
        id: `note-${userId || 'anon'}-${productId}`,
        user_id: userId || null,
        product_id: productId,
        rating,
        notes,
        date
      };
      const { error } = await supabase.from('product_tasting_notes').upsert(payload);
      return !error;
    } catch {
      return false;
    }
  }
};

export const familyProfilesService = {
  async getForUser(userId?: string): Promise<ChildFamilyProfile[]> {
    if (!isSupabaseConfigured) return INITIAL_FAMILY_PROFILES;
    try {
      let query = supabase.from('family_profiles').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[NutriBake Supabase] Family profiles query fallback:', error.message);
        return INITIAL_FAMILY_PROFILES;
      }
      if (data && data.length > 0) {
        return data.map(mapDbFamilyToApp);
      }
      return INITIAL_FAMILY_PROFILES;
    } catch {
      return INITIAL_FAMILY_PROFILES;
    }
  },

  async insert(profile: ChildFamilyProfile, userId?: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const payload = mapAppFamilyToDb(profile, userId);
      const { error } = await supabase.from('family_profiles').insert(payload);
      return !error;
    } catch {
      return false;
    }
  },

  async update(id: string, updates: Partial<ChildFamilyProfile>): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.age !== undefined) dbUpdates.age = updates.age;
      if (updates.allergies !== undefined) dbUpdates.allergies = updates.allergies;
      if (updates.favoriteProducts !== undefined) dbUpdates.favorite_products = updates.favoriteProducts;
      if (updates.fiberTarget !== undefined) dbUpdates.fiber_target = updates.fiberTarget;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      const { error } = await supabase.from('family_profiles').update(dbUpdates).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('family_profiles').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }
};

export const profilesService = {
  async getProfile(userId: string, email?: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) return null;
      return mapDbProfileToApp(data, email);
    } catch {
      return null;
    }
  },

  async getAllProfiles(): Promise<UserProfile[]> {
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch('/api/admin/profiles');
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data)) {
            return json.data.map((d: any) => mapDbProfileToApp(d));
          }
        }
      }
    } catch {
      // Fall through
    }
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((d: any) => mapDbProfileToApp(d));
      }
    } catch {
      // Fall through
    }
    return [];
  },

  async updateRole(userId: string, role: 'user' | 'admin'): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch(`/api/admin/profiles/${encodeURIComponent(userId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role })
        });
        if (res.ok) return true;
      }
    } catch {
      // Fall through
    }
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
      return !error;
    } catch {
      return false;
    }
  },

  async syncProfile(user: UserProfile): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        saved_product_ids: user.savedProductIds,
        preferences: user.preferences,
        daily_fiber_goal_grams: user.dailyFiberGoalGrams,
        current_fiber_intake_grams: user.currentFiberIntakeGrams,
        recommendation_history_count: user.recommendationHistoryCount,
        member_since: user.memberSince,
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('profiles').upsert(payload);
      return !error;
    } catch {
      return false;
    }
  }
};

export const alertsService = {
  async getAlerts(userId?: string): Promise<AlertNotification[]> {
    if (!isSupabaseConfigured) return INITIAL_ALERTS;
    try {
      let query = supabase.from('alerts').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('[NutriBake Supabase] Alerts query fallback:', error.message);
        return INITIAL_ALERTS;
      }
      if (data && data.length > 0) {
        return data.map(mapDbAlertToApp);
      }
      return INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  },

  async getAll(): Promise<AlertNotification[]> {
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch('/api/admin/alerts');
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data)) {
            return json.data.map(mapDbAlertToApp);
          }
        }
      }
    } catch {
      // Fall through
    }
    return this.getAlerts();
  },

  async insert(alert: AlertNotification, userId?: string): Promise<boolean> {
    const payload = mapAppAlertToDb(alert, userId);
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch('/api/admin/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return true;
      }
    } catch {
      // Fall through
    }
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('alerts').upsert(payload);
      return !error;
    } catch {
      return false;
    }
  },

  async update(id: string, updates: Partial<AlertNotification>): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch(`/api/admin/alerts/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (res.ok) return true;
      }
    } catch {
      // Fall through
    }
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('alerts').update(updates).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch(`/api/admin/alerts/${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
        if (res.ok) return true;
      }
    } catch {
      // Fall through
    }
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('alerts').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async markAsRead(alertId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from('alerts').update({ read: true }).eq('id', alertId);
      return !error;
    } catch {
      return false;
    }
  }
};

export const websiteContentService = {
  async get(): Promise<any | null> {
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch('/api/admin/website-content');
        if (res.ok) {
          const json = await res.json();
          return json.content;
        }
      }
    } catch {
      // Fall through
    }
    return null;
  },

  async save(content: any): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch('/api/admin/website-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(content)
        });
        return res.ok;
      }
    } catch {
      // Fall through
    }
    return false;
  }
};

export const teamService = {
  async getAll(): Promise<TeamMember[]> {
    // 1. Try server-side endpoint first (which reads directly from Supabase public.team)
    try {
      if (typeof window !== 'undefined' && window.fetch) {
        const res = await fetch('/api/team');
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data)) {
            return json.data.map(mapDbTeamToApp);
          }
        }
      }
    } catch (e: any) {
      console.warn('[NutriBake] GET /api/team fetch notice:', e?.message);
    }

    // 2. Direct client query to Supabase team table
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('team')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data) {
          return data.map(mapDbTeamToApp);
        }
      } catch (e: any) {
        console.warn('[NutriBake] Direct Supabase team select notice:', e?.message);
      }
    }

    return INITIAL_TEAM_MEMBERS;
  },

  async insert(member: TeamMember): Promise<boolean> {
    const payload = mapAppTeamToDb(member);

    // Call server endpoint (which performs privileged server-side Supabase mutation)
    if (typeof window !== 'undefined' && window.fetch) {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/team', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return true;
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server returned HTTP ${res.status}`);
    }

    return false;
  },

  async update(id: string, updates: Partial<TeamMember>): Promise<boolean> {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.focus !== undefined && updates.bio === undefined) dbUpdates.bio = updates.focus;
    if (updates.department !== undefined) dbUpdates.department = updates.department;
    if (updates.subRole !== undefined) dbUpdates.sub_role = updates.subRole;
    if (updates.idNumber !== undefined) dbUpdates.id_number = updates.idNumber;
    if (updates.institution !== undefined) dbUpdates.institution = updates.institution;
    if (updates.expertise !== undefined) dbUpdates.expertise = updates.expertise;
    if (updates.displayOrder !== undefined) dbUpdates.display_order = updates.displayOrder;

    // Call server endpoint (which performs privileged server-side Supabase mutation)
    if (typeof window !== 'undefined' && window.fetch) {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/team/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(dbUpdates)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return true;
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server returned HTTP ${res.status}`);
    }

    return false;
  },

  async delete(id: string): Promise<boolean> {
    // Call server endpoint (which performs privileged server-side Supabase mutation)
    if (typeof window !== 'undefined' && window.fetch) {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/team/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return true;
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server returned HTTP ${res.status}`);
    }

    return false;
  }
};
