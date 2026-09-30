import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const rawSecretKey = process.env.SUPABASE_SECRET_KEY || '';
const supabaseSecretKey = (rawSecretKey && !rawSecretKey.includes('•'))
  ? rawSecretKey
  : (process.env.SUPABASE_PUBLISHABLE_KEY || '');

const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseSecretKey) return null;
  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
};

export async function seedNutriBakeDatabase() {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    console.warn('[NutriBake Seed] Skipped database seeding: SUPABASE_URL or key not configured');
    return;
  }

  console.log('[NutriBake Seed] Starting idempotent database restoration...');

  // ==========================================
  // 1. PRODUCTS RESTORATION
  // ==========================================
  const products = [
    {
      id: 'prod-cupcakes',
      name: 'Golden Crumb Cupcakes',
      category: 'cupcakes',
      tagline: 'Nutrient-dense baked items rich in fiber and essential nutrients.',
      description: 'Baked to golden tender perfection in fluted liners using unripe green banana composite flour and garnished with toasted white sesame seeds. Formulated with green banana RS2 resistant starch and organic inulin to nourish gut microbiome microflora without post-meal blood sugar surges.',
      why_this_product: 'Addresses conventional bakery items that are high in refined flour and added sugar while lacking fiber, delivering 6.8g of gut-friendly prebiotic fiber and essential plant minerals.',
      nutrition_score: 96,
      nutrition: {
        calories: 175,
        proteinGrams: 5.6,
        carbsGrams: 24,
        dietaryFiberGrams: 6.8,
        sugarsGrams: 3.8,
        totalFatGrams: 5.2,
        saturatedFatGrams: 1.1,
        sodiumMg: 95,
        resistantStarchGrams: 4.6,
        glycemicIndexEst: 38
      },
      main_functional_ingredient: 'Green Banana Flour & Toasted Sesame',
      all_ingredients: [
        'Green Banana Flour (RS2 Resistant Starch)',
        'Almond Meal',
        'Cold-Pressed Coconut Oil',
        'Toasted White Sesame Seeds',
        'Organic Chicory Inulin',
        'Pasture-Raised Egg Whites',
        'Madagascar Vanilla Extract',
        'Non-Aluminum Baking Powder'
      ],
      functional_ingredients: [
        {
          name: 'Green Banana RS2 Flour',
          role: 'Resistant Starch Prebiotic Core',
          scientificBenefit: 'Escapes upper gastrointestinal digestion to ferment into health-promoting short-chain fatty acids (SCFAs) like butyrate.'
        },
        {
          name: 'Toasted White Sesame Seeds',
          role: 'Lignans & Mineral Density',
          scientificBenefit: 'Rich in sesamin lignans, calcium, and vitamin E, providing cellular antioxidant protection and subtle nutty crunch.'
        },
        {
          name: 'Organic Inulin',
          role: 'Soluble Dietary Fiber',
          scientificBenefit: 'Enhances crumb moisture retention and selectively feeds Bifidobacteria strains.'
        }
      ],
      allergens: ['Tree Nuts (Almonds)', 'Sesame', 'Eggs'],
      allergen_information: 'Contains: Almonds, sesame seeds, and eggs.',
      cross_contamination: 'May contain traces of peanuts, milk, soy, wheat, or other tree nuts.',
      dietary_tags: ['High Fiber', 'Prebiotic RS2', 'Low Glycemic', 'Gluten-Conscious', 'Dairy-Free'],
      sensory_scores: {
        taste: 96,
        texture: 95,
        aroma: 97,
        appearance: 98,
        overallAcceptability: 96.5,
        panelNotes: 'Golden domed tops with toasted sesame crunch, exceptionally moist and tender crumb, mild warm aroma.'
      },
      serving_size: '1 Cupcake (65g)',
      portion_size: '1 Cupcake',
      net_weight: '65 g',
      price_pkr: 50,
      shelf_life: '7 days ambient, 14 days refrigerated',
      storage_instructions: 'Store in an airtight container in a cool dry pantry.',
      image_url: '/images/nutribake_cupcakes_1789159074122.jpg',
      is_featured: true,
      child_friendly: true,
      batch_code: 'NB-2026-CUP-01',
      lab_status: 'Approved'
    },
    {
      id: 'prod-cookies',
      name: 'Cocolina Cookies',
      category: 'cookies',
      tagline: 'Formulated with natural coconut, seeds, and low-glycemic sweeteners.',
      description: 'Crispy golden edges give way to a chewy, satisfying center. Each cookie is crafted from natural coconut flakes, whole rolled oats, calcium-rich stoneground sesame tahini, and slow-fermenting prebiotic fiber for steady metabolic balance.',
      why_this_product: 'Replaces conventional high-sugar biscuits with a therapeutic, diabetic-friendly formulation packed with beta-glucan soluble fiber, healthy plant fats, and low-glycemic natural sweetness.',
      nutrition_score: 95,
      nutrition: {
        calories: 140,
        proteinGrams: 4.8,
        carbsGrams: 19,
        dietaryFiberGrams: 5.6,
        sugarsGrams: 3.2,
        totalFatGrams: 4.9,
        saturatedFatGrams: 0.9,
        sodiumMg: 75,
        resistantStarchGrams: 3.8,
        glycemicIndexEst: 34
      },
      main_functional_ingredient: 'Natural Coconut, Whole Oats & Sesame Tahini',
      all_ingredients: [
        'Desiccated Coconut Flakes',
        'Gluten-Free Whole Rolled Oats',
        'Green Banana Flour',
        'Stoneground Sesame Tahini',
        'Unrefined Coconut Nectar',
        'Black Chia Seeds',
        'Cold-Pressed Extra Virgin Olive Oil',
        'Sea Salt',
        'Ceylon Cinnamon'
      ],
      functional_ingredients: [
        {
          name: 'Desiccated Coconut',
          role: 'Natural Fiber & Satiety Lipids',
          scientificBenefit: 'Rich in dietary fiber and medium-chain fatty acids (MCTs) that facilitate smooth digestion and satisfying crumb aroma.'
        },
        {
          name: 'Whole Rolled Oats',
          role: 'Beta-Glucan Soluble Fiber',
          scientificBenefit: 'Beta-glucans form a viscous gel in the digestive tract, attenuating glycemic spikes and supporting heart health.'
        },
        {
          name: 'Stoneground Sesame Tahini',
          role: 'Healthy Plant Lipids & Calcium',
          scientificBenefit: 'Supplies bioavailable plant calcium and mono/polyunsaturated fatty acids for prolonged satiety.'
        }
      ],
      allergens: ['Sesame', 'Coconut'],
      allergen_information: 'Contains: Sesame and coconut.',
      cross_contamination: 'May contain traces of tree nuts, peanuts, milk, or soy.',
      dietary_tags: ['High Fiber', 'Vegan', 'Prebiotic RS2', 'Dairy-Free', 'Mineral Dense'],
      sensory_scores: {
        taste: 95,
        texture: 97,
        aroma: 96,
        appearance: 96,
        overallAcceptability: 96.0,
        panelNotes: 'Beautiful rustic cracked finish, fragrant toasted coconut and tahini notes, satisfying chew.'
      },
      serving_size: '2 Cookies (50g)',
      portion_size: '2 Cookies',
      net_weight: '50 g',
      price_pkr: 35,
      shelf_life: '18 days ambient sealed, 1 month refrigerated',
      storage_instructions: 'Store in an airtight container away from direct moisture, sunlight, and heat.',
      image_url: '/images/nutribake_cookies_1789159094420.jpg',
      is_featured: true,
      child_friendly: true,
      batch_code: 'NB-2026-CK-02',
      lab_status: 'Approved'
    },
    {
      id: 'prod-nutriballs',
      name: 'Nutri Balls',
      category: 'nutriballs',
      tagline: 'Wholesome, naturally sweet energy bites made with dates, nuts, desi ghee & chocolate coating.',
      description: 'Wholesome, naturally sweet energy bites made with dates, almonds, walnuts, mixed seeds and desi ghee, finished with a delicious coconut husk and chocolate coating. A convenient, satisfying snack with a rich nutty texture.',
      why_this_product: 'We believe better nutrition should not come at the cost of taste. NutriBake focuses on freshly prepared products with carefully selected ingredients, rather than relying on long shelf life processing and preservation. Perfect for clean energy without added refined sugars.',
      nutrition_score: 98,
      nutrition: {
        calories: 145,
        proteinGrams: 4.5,
        carbsGrams: 18,
        dietaryFiberGrams: 5.2,
        sugarsGrams: 11.2,
        totalFatGrams: 6.5,
        saturatedFatGrams: 1.8,
        sodiumMg: 22,
        resistantStarchGrams: 3.2,
        glycemicIndexEst: 30
      },
      main_functional_ingredient: 'Dates, Almonds, Walnuts, Desi Ghee & Chocolate Coating',
      all_ingredients: [
        'Dates',
        'Almonds',
        'Mixed Seeds (Pumpkin, Sunflower, Chia)',
        'Walnuts',
        'Desi Ghee',
        'Coconut Husk',
        'Chocolate Coating'
      ],
      functional_ingredients: [
        {
          name: 'Dates & Mixed Seeds',
          role: 'Natural Sweetness & Mineral Fiber',
          scientificBenefit: 'Provide slow-burning natural sweetness, potassium, magnesium, and dietary fiber without sharp glycemic spikes.'
        },
        {
          name: 'Almonds & Walnuts',
          role: 'Plant Protein & ALA Omega-3 Fatty Acids',
          scientificBenefit: 'Rich in neuroprotective monounsaturated lipids, plant proteins, and antioxidants supporting heart and cognitive function.'
        },
        {
          name: 'Pure Desi Ghee',
          role: 'Butyric Acid & Nutrient Bioavailability',
          scientificBenefit: 'Supplies butyric acid to strengthen the gut mucosal lining and enhances the absorption of fat-soluble vitamins.'
        },
        {
          name: 'Coconut Husk & Chocolate Coating',
          role: 'Fiber Texture & Antioxidant Flavanols',
          scientificBenefit: 'Coconut husk adds beneficial fibrous bulk while the rich chocolate coating contributes mood-lifting polyphenols.'
        }
      ],
      allergens: ['Almonds', 'Walnuts'],
      allergen_information: 'Contains: Almonds and walnuts. May contain other nuts and seeds.',
      cross_contamination: 'May contain traces of peanuts, milk, soy, wheat, or other nuts if produced in a facility handling these allergens.',
      dietary_tags: ['Naturally Sweet', 'Desi Ghee', 'High Fiber', 'No Refined Sugar', 'Nutrient Dense'],
      sensory_scores: {
        taste: 98,
        texture: 97,
        aroma: 98,
        appearance: 98,
        overallAcceptability: 97.8,
        panelNotes: 'Rich nutty texture, delightful chocolate coating with subtle toasted coconut notes and natural date sweetness.'
      },
      serving_size: '1 Nutri Ball (50g)',
      portion_size: '1 Nutri Ball',
      net_weight: '50 g',
      price_pkr: 10,
      shelf_life: 'Up to 3 months when refrigerated, subject to final shelf-life testing.',
      storage_instructions: 'Keep refrigerated, especially during summer. Store in an airtight container and protect from moisture and heat.',
      image_url: '/images/nutribake_nutriballs_1789159111855.jpg',
      is_featured: true,
      child_friendly: true,
      batch_code: 'NB-2026-NB-03',
      lab_status: 'Approved'
    }
  ];

  const { error: prodError } = await supabaseAdmin
    .from('products')
    .upsert(products, { onConflict: 'id' });

  if (prodError) {
    console.error('[NutriBake Seed] Products upsert failed:', prodError.message);
  } else {
    console.log(`[NutriBake Seed] Successfully restored ${products.length} products to database.`);
  }

  // ==========================================
  // 2. SENSORY TRIALS RESTORATION
  // ==========================================
  const sensoryTrials = [
    {
      id: 'sen-01',
      product_id: 'prod-cupcakes',
      product_name: 'Golden Sesame Prebiotic Cupcakes',
      batch_code: 'NB-2026-CUP-01',
      panelist_name: 'Lydia Shaloom',
      panelist_type: 'Trained Descriptive',
      date: 'March 09, 2026',
      taste: 96,
      texture: 98,
      aroma: 95,
      appearance: 97,
      overall_acceptability: 96.5,
      hedonic_scale9: 8.8,
      panel_notes: 'Superior crumb elasticity and uniform pore distribution. Completely masked green banana astringency through light cinnamon and coconut fat.'
    },
    {
      id: 'sen-02',
      product_id: 'prod-cookies',
      product_name: 'Wholesome Oat & Sesame Cracked Cookies',
      batch_code: 'NB-2026-COK-02',
      panelist_name: 'Aamna Siddiqui',
      panelist_type: 'Student Researcher',
      date: 'March 10, 2026',
      taste: 95,
      texture: 97,
      aroma: 96,
      appearance: 96,
      overall_acceptability: 96.0,
      hedonic_scale9: 8.7,
      panel_notes: 'Pleasant roasted notes from stoneground tahini and golden flaxseed. Crumb retains moisture over 5-day ambient shelf testing.'
    },
    {
      id: 'sen-03',
      product_id: 'prod-nutriballs',
      product_name: 'Raw Cacao & Walnut Vitality NutriBalls',
      batch_code: 'NB-2026-BAL-03',
      panelist_name: 'Noor-un-Nisa',
      panelist_type: 'Student Researcher',
      date: 'March 10, 2026',
      taste: 98,
      texture: 96,
      aroma: 98,
      appearance: 95,
      overall_acceptability: 97.0,
      hedonic_scale9: 9.0,
      panel_notes: 'Intense natural cacao notes seamlessly combined with finely milled walnut lipids. No synthetic gums needed for firm spherification.'
    },
    {
      id: 'sen-04',
      product_id: 'prod-cupcakes',
      product_name: 'Golden Sesame Prebiotic Cupcakes',
      batch_code: 'NB-2026-CUP-02',
      panelist_name: 'Dr. Asif Ali Shah',
      panelist_type: 'Faculty Supervisor',
      date: 'March 11, 2026',
      taste: 94,
      texture: 95,
      aroma: 94,
      appearance: 96,
      overall_acceptability: 95.0,
      hedonic_scale9: 8.5,
      panel_notes: 'Satisfactory specific loaf volume and cell aeration. Meets standard parameters for publication-grade functional formulation.'
    }
  ];

  const { error: sensoryError } = await supabaseAdmin
    .from('sensory_trials')
    .upsert(sensoryTrials, { onConflict: 'id' });

  if (sensoryError) {
    console.error('[NutriBake Seed] Sensory trials upsert failed:', sensoryError.message);
  } else {
    console.log(`[NutriBake Seed] Successfully restored ${sensoryTrials.length} sensory trials to database.`);
  }

  // ==========================================
  // 3. SAMPLE ORDERS RESTORATION
  // ==========================================
  const sampleOrders = [
    {
      id: 'ord-8821',
      order_number: 'NB-2026-TR-8821',
      date: 'March 11, 2026',
      recipient_name: 'Dr. Sarah Lin',
      email: 'sarah.lin@example.com',
      address: 'Faculty Residence #14, University of Sindh, Jamshoro',
      status: 'Dispatched',
      trial_type: 'Clinical Study',
      tracking_notes: 'Dispatched with ice pack via Sindh Lab Logistics. Expected delivery in 24 hrs.',
      items: [
        {
          productId: 'prod-cupcakes',
          productName: 'Golden Sesame Prebiotic Cupcakes',
          quantity: 2,
          batchCode: 'NB-2026-CUP-01'
        },
        {
          productId: 'prod-nutriballs',
          productName: 'Raw Cacao & Walnut Vitality NutriBalls',
          quantity: 2,
          batchCode: 'NB-2026-BAL-03'
        }
      ]
    },
    {
      id: 'ord-8820',
      order_number: 'NB-2026-TR-8820',
      date: 'March 08, 2026',
      recipient_name: 'Prof. Tariq Mahmood (Metabolic Clinical Trial)',
      email: 'tariq.m@usindh.edu.pk',
      address: 'Department of Clinical Nutrition, Medical Complex, Jamshoro',
      status: 'Delivered',
      trial_type: 'Academic Panel',
      tracking_notes: 'Delivered for Phase 2 Postprandial Glycemic Index study.',
      items: [
        {
          productId: 'prod-cookies',
          productName: 'Wholesome Oat & Sesame Cracked Cookies',
          quantity: 10,
          batchCode: 'NB-2026-COK-02'
        }
      ]
    },
    {
      id: 'ord-8822',
      order_number: 'NB-2026-TR-8822',
      date: 'March 12, 2026',
      recipient_name: 'Dr. Zainab Bilal (Pediatric Clinic)',
      email: 'zainab.pediatrics@gmail.com',
      address: 'Children Health Pavilion, Unit 4, Hyderabad',
      status: 'Lab Blended',
      trial_type: 'Family Nutrition',
      tracking_notes: 'Green banana composite dough mixed and resting in lab chiller.',
      items: [
        {
          productId: 'prod-cupcakes',
          productName: 'Golden Sesame Prebiotic Cupcakes',
          quantity: 4,
          batchCode: 'NB-2026-CUP-02'
        },
        {
          productId: 'prod-cookies',
          productName: 'Wholesome Oat & Sesame Cracked Cookies',
          quantity: 4,
          batchCode: 'NB-2026-COK-03'
        }
      ]
    }
  ];

  const { error: orderError } = await supabaseAdmin
    .from('sample_orders')
    .upsert(sampleOrders, { onConflict: 'id' });

  if (orderError) {
    console.error('[NutriBake Seed] Sample orders upsert failed:', orderError.message);
  } else {
    console.log(`[NutriBake Seed] Successfully restored ${sampleOrders.length} sample orders to database.`);
  }

  // ==========================================
  // 4. USERS & PROFILES RESTORATION
  // ==========================================
  let sarahUserId: string | null = null;
  const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
  const existingUsers = userList?.users || [];

  // Find or create Sarah Jenkins (sarah.j@example.com)
  const existingSarah = existingUsers.find(u => u.email === 'sarah.j@example.com');
  if (existingSarah) {
    sarahUserId = existingSarah.id;
  } else {
    const { data: newSarah, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'sarah.j@example.com',
      password: 'NutriBake2026User!',
      email_confirm: true,
      user_metadata: { name: 'Sarah Jenkins', role: 'user' }
    });
    if (newSarah?.user) {
      sarahUserId = newSarah.user.id;
    } else if (createError) {
      console.warn('[NutriBake Seed] Could not create Sarah Jenkins auth user:', createError.message);
    }
  }

  // Populate profiles
  for (const user of existingUsers) {
    const isAdmin = user.email === 'lab.lead@nutribake.edu' || user.email?.includes('admin');
    const isSarah = user.email === 'sarah.j@example.com';
    const profileData: any = {
      id: user.id,
      email: user.email,
      name: isSarah ? 'Sarah Jenkins' : (user.user_metadata?.name || (isAdmin ? 'Laboratory Administrator' : 'NutriBake User')),
      role: isAdmin ? 'admin' : 'user',
      avatar: isSarah ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' : null,
      age_group: isSarah ? 'adult' : null,
      dietary_preference: isSarah ? 'vegetarian' : null,
      saved_product_ids: isSarah ? ['prod-cupcakes', 'prod-cookies', 'prod-nutriballs'] : [],
      preferences: isSarah ? {
        dailyFiberTargetGrams: 30,
        dietaryGoal: 'High Fiber & Gut Vitality',
        allergens: []
      } : {
        dailyFiberTargetGrams: 28,
        dietaryGoal: 'High Fiber & Gut Vitality',
        allergens: []
      },
      daily_fiber_goal_grams: isSarah ? 30 : 28,
      current_fiber_intake_grams: isSarah ? 22 : 0,
      recommendation_history_count: isSarah ? 4 : 0,
      member_since: 'March 2026'
    };

    await supabaseAdmin.from('profiles').upsert(profileData, { onConflict: 'id' });
  }

  // If sarahUserId was just created, ensure profile is inserted
  if (sarahUserId && !existingUsers.some(u => u.id === sarahUserId)) {
    await supabaseAdmin.from('profiles').upsert({
      id: sarahUserId,
      email: 'sarah.j@example.com',
      name: 'Sarah Jenkins',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      age_group: 'adult',
      dietary_preference: 'vegetarian',
      saved_product_ids: ['prod-cupcakes', 'prod-cookies', 'prod-nutriballs'],
      preferences: {
        dailyFiberTargetGrams: 30,
        dietaryGoal: 'High Fiber & Gut Vitality',
        allergens: []
      },
      daily_fiber_goal_grams: 30,
      current_fiber_intake_grams: 22,
      recommendation_history_count: 4,
      member_since: 'March 2026'
    }, { onConflict: 'id' });
  }
  console.log('[NutriBake Seed] Successfully synced user profiles.');

  // ==========================================
  // 5. DAILY INTAKE LOGS RESTORATION
  // ==========================================
  const dailyLogs = [
    {
      id: 'log-01',
      user_id: sarahUserId,
      product_id: 'prod-cupcakes',
      product_name: 'Golden Sesame Prebiotic Cupcakes',
      portion_description: '1 Cupcake (85g)',
      meal_time: 'breakfast',
      servings: 1,
      fiber_grams: 6.8,
      resistant_starch_grams: 3.4,
      calories: 190,
      protein_grams: 5.2,
      timestamp: 'Today, 08:15 AM'
    },
    {
      id: 'log-02',
      user_id: sarahUserId,
      product_id: 'prod-cookies',
      product_name: 'Wholesome Oat & Sesame Cracked Cookies',
      portion_description: '2 Cookies (50g)',
      meal_time: 'morning-snack',
      servings: 1,
      fiber_grams: 5.6,
      resistant_starch_grams: 3.8,
      calories: 140,
      protein_grams: 4.8,
      timestamp: 'Today, 11:30 AM'
    },
    {
      id: 'log-03',
      user_id: sarahUserId,
      product_id: 'prod-nutriballs',
      product_name: 'Raw Cacao & Walnut Vitality NutriBalls',
      portion_description: '2 Balls (45g)',
      meal_time: 'afternoon-snack',
      servings: 1,
      fiber_grams: 6.2,
      resistant_starch_grams: 2.9,
      calories: 160,
      protein_grams: 4.5,
      timestamp: 'Today, 03:45 PM'
    }
  ];

  const { error: logsError } = await supabaseAdmin
    .from('daily_intake_logs')
    .upsert(dailyLogs, { onConflict: 'id' });

  if (logsError) {
    console.error('[NutriBake Seed] Daily logs upsert failed:', logsError.message);
  } else {
    console.log(`[NutriBake Seed] Successfully restored ${dailyLogs.length} intake logs.`);
  }

  // ==========================================
  // 6. ALERTS RESTORATION
  // ==========================================
  const alerts = [
    {
      id: 'alt-01',
      user_id: sarahUserId,
      title: 'Fresh Formulation Approved',
      message: 'Batch NB-2026-CUP-01 (Golden Sesame Prebiotic Cupcakes) completed 72-hour sensory trials with 96.5% acceptability.',
      type: 'batch-update',
      date: 'Today, 08:30 AM',
      read: false
    },
    {
      id: 'alt-02',
      user_id: sarahUserId,
      title: 'Fiber Target Progress',
      message: 'You have reached 73% of your daily functional dietary fiber goal (22g of 30g).',
      type: 'nutrition-tip',
      date: 'Today, 07:15 AM',
      read: false
    },
    {
      id: 'alt-03',
      user_id: sarahUserId,
      title: 'New Research Paper Linked',
      message: 'University of Sindh laboratory team published updated evaluation on resistant starch shelf kinetics.',
      type: 'info',
      date: 'Yesterday',
      read: true
    }
  ];

  const { error: alertsError } = await supabaseAdmin
    .from('alerts')
    .upsert(alerts, { onConflict: 'id' });

  if (alertsError) {
    console.error('[NutriBake Seed] Alerts upsert failed:', alertsError.message);
  } else {
    console.log(`[NutriBake Seed] Successfully restored ${alerts.length} alerts.`);
  }

  // ==========================================
  // 7. FAMILY PROFILES RESTORATION
  // ==========================================
  if (sarahUserId) {
    const familyProfiles = [
      {
        id: 'fam-01',
        user_id: sarahUserId,
        name: 'Liam Lin',
        age: 7,
        allergies: ['Peanuts'],
        favorite_products: ['Golden Sesame Prebiotic Cupcakes'],
        fiber_target: 20,
        notes: 'School lunchbox favorite. Certified peanut-free batch tested.'
      },
      {
        id: 'fam-02',
        user_id: sarahUserId,
        name: 'Maya Lin',
        age: 11,
        allergies: [],
        favorite_products: ['Wholesome Oat & Sesame Cracked Cookies', 'Raw Cacao & Walnut Vitality NutriBalls'],
        fiber_target: 24,
        notes: 'Consumes before afternoon swimming practice for sustained energy.'
      }
    ];

    const { error: familyError } = await supabaseAdmin
      .from('family_profiles')
      .upsert(familyProfiles, { onConflict: 'id' });

    if (familyError) {
      console.error('[NutriBake Seed] Family profiles upsert failed:', familyError.message);
    } else {
      console.log(`[NutriBake Seed] Successfully restored ${familyProfiles.length} family profiles.`);
    }

    // ==========================================
    // 8. PRODUCT TASTING NOTES RESTORATION
    // ==========================================
    const tastingNotes = [
      {
        id: 'note-cupcakes',
        user_id: sarahUserId,
        product_id: 'prod-cupcakes',
        rating: 5,
        notes: 'Incredible crumb softness and subtle nutty richness. Zero heavy aftertaste, digested very gently with morning tea.',
        date: 'March 10, 2026'
      },
      {
        id: 'note-cookies',
        user_id: sarahUserId,
        product_id: 'prod-cookies',
        rating: 5,
        notes: 'Remarkable roasted tahini and coconut aroma. Keeps me satiated for 4 hours with no blood sugar crash.',
        date: 'March 11, 2026'
      }
    ];

    const { error: notesError } = await supabaseAdmin
      .from('product_tasting_notes')
      .upsert(tastingNotes, { onConflict: 'id' });

    if (notesError) {
      console.error('[NutriBake Seed] Tasting notes upsert failed:', notesError.message);
    } else {
      console.log(`[NutriBake Seed] Successfully restored ${tastingNotes.length} tasting notes.`);
    }
  }

  // ==========================================
  // 9. TEAM RESTORATION
  // ==========================================
  const team = [
    {
      id: 'team-abdul-hannan-memon',
      name: 'Abdul Hannan Memon',
      role: 'Group Leader | Frontend & Analyst',
      bio: 'Team coordination, UI/UX layout, navigation, and user experience.',
      department: 'Department of Software Engineering',
      sub_role: 'Founder & CEO, IDH',
      id_number: '08/2K23/SWE',
      institution: 'University of Sindh, Jamshoro',
      expertise: ['Education', 'Frontend UI/UX', 'Python', 'AI'],
      display_order: 1
    },
    {
      id: 'team-ali-hassan-chand',
      name: 'Ali Hassan Chand',
      role: 'Tech Lead | Full-Stack Engineer',
      bio: 'Technical strategy, backend implementation, logic, and database systems.',
      department: 'Department of Software Engineering',
      sub_role: 'Founder & CTO, MWI',
      id_number: '26/2K23/SWE',
      institution: 'University of Sindh, Jamshoro',
      expertise: ['Full-Stack Development', 'System Architecture', 'Project Management', 'React', 'Laravel'],
      display_order: 2
    },
    {
      id: 'team-haris-ahmed-ansari',
      name: 'Haris Ahmed Ansari',
      role: 'Researcher | Key Documentation | Quality Assurance',
      bio: 'Functional food research, documentation, quality assurance, and system reliability.',
      department: 'Department of Software Engineering',
      sub_role: '',
      id_number: '63/2K23/SWE',
      institution: 'University of Sindh, Jamshoro',
      expertise: ['MERN Stack Development', 'Software Testing & System Validation'],
      display_order: 3
    },
    {
      id: 'team-aamna-siddiqui',
      name: 'Aamna Siddiqui',
      role: 'Student Researcher',
      bio: 'Functional ingredient selection and dietary optimization for targeted health requirements.',
      department: 'Nutrition & Food Science Department',
      sub_role: 'Final-Year BS Nutrition & Food Science Student',
      id_number: '',
      institution: 'University of Sindh, Jamshoro',
      expertise: ['Therapeutic Formulations', 'Macronutrient Balancing', 'Nutritional Profiling'],
      display_order: 4
    },
    {
      id: 'team-lydia-shaloom',
      name: 'Lydia Shaloom',
      role: 'Student Researcher',
      bio: 'Complete sensory testing panels, comparing taste, texture, aroma, and mouthfeel.',
      department: 'Nutrition & Food Science Department',
      sub_role: 'Final-Year BS Nutrition & Food Science Student',
      id_number: '',
      institution: 'University of Sindh, Jamshoro',
      expertise: ['Sensory Evaluation', 'Hedonic Scaling', 'Flavour & Texture Optimization'],
      display_order: 5
    },
    {
      id: 'team-noor-un-nisa',
      name: 'Noor-un-Nisa',
      role: 'Student Researcher',
      bio: 'Controlled laboratory trials, hygiene protocols, storage testing, and allergen mitigation.',
      department: 'Nutrition & Food Science Department',
      sub_role: 'Final-Year BS Nutrition & Food Science Student',
      id_number: '',
      institution: 'University of Sindh, Jamshoro',
      expertise: ['Food Safety & Quality', 'Shelf-Life Kinetics', 'Safe Food Formulation'],
      display_order: 6
    }
  ];

  try {
    const { error: teamError } = await supabaseAdmin
      .from('team')
      .upsert(team, { onConflict: 'id' });

    if (teamError) {
      console.warn('[NutriBake Seed] Team upsert notice:', teamError.message);
    } else {
      console.log(`[NutriBake Seed] Successfully restored ${team.length} team members to database.`);
    }
  } catch (err: any) {
    console.warn('[NutriBake Seed] Team table sync notice:', err?.message);
  }

  console.log('[NutriBake Seed] Complete! All tables seeded with original NutriBake dataset.');
  return { success: true };
}

// Run directly if invoked from CLI
if (process.argv[1]?.endsWith('seedDatabase.ts')) {
  seedNutriBakeDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[NutriBake Seed] Fatal Error:', err);
      process.exit(1);
    });
}
