-- NutriBake Database Restoration: Original Website Data Seed
-- Idempotent and deterministic restoration of original products, sensory trials, sample orders, daily intake logs, alerts, profiles, family profiles, and tasting notes.

-- 1. Products Restoration
INSERT INTO public.products (
  id, name, category, tagline, description, why_this_product, nutrition_score, nutrition,
  main_functional_ingredient, all_ingredients, functional_ingredients, allergens, dietary_tags,
  sensory_scores, serving_size, portion_size, net_weight, price_pkr, shelf_life, storage_instructions,
  image_url, is_featured, child_friendly, batch_code, lab_status
) VALUES
(
  'prod-cupcakes',
  'Golden Crumb Cupcakes',
  'cupcakes',
  'Nutrient-dense baked items rich in fiber and essential nutrients.',
  'Baked to golden tender perfection in fluted liners using unripe green banana composite flour and garnished with toasted white sesame seeds. Formulated with green banana RS2 resistant starch and organic inulin to nourish gut microbiome microflora without post-meal blood sugar surges.',
  'Addresses conventional bakery items that are high in refined flour and added sugar while lacking fiber, delivering 6.8g of gut-friendly prebiotic fiber and essential plant minerals.',
  96,
  '{"calories": 175, "proteinGrams": 5.6, "carbsGrams": 24, "dietaryFiberGrams": 6.8, "sugarsGrams": 3.8, "totalFatGrams": 5.2, "saturatedFatGrams": 1.1, "sodiumMg": 95, "resistantStarchGrams": 4.6, "glycemicIndexEst": 38}'::jsonb,
  'Green Banana Flour & Toasted Sesame',
  '["Green Banana Flour (RS2 Resistant Starch)", "Almond Meal", "Cold-Pressed Coconut Oil", "Toasted White Sesame Seeds", "Organic Chicory Inulin", "Pasture-Raised Egg Whites", "Madagascar Vanilla Extract", "Non-Aluminum Baking Powder"]'::jsonb,
  '[{"name": "Green Banana RS2 Flour", "role": "Resistant Starch Prebiotic Core", "scientificBenefit": "Escapes upper gastrointestinal digestion to ferment into health-promoting short-chain fatty acids (SCFAs) like butyrate."}, {"name": "Toasted White Sesame Seeds", "role": "Lignans & Mineral Density", "scientificBenefit": "Rich in sesamin lignans, calcium, and vitamin E, providing cellular antioxidant protection and subtle nutty crunch."}, {"name": "Organic Inulin", "role": "Soluble Dietary Fiber", "scientificBenefit": "Enhances crumb moisture retention and selectively feeds Bifidobacteria strains."}]'::jsonb,
  '["Tree Nuts (Almonds)", "Sesame", "Eggs"]'::jsonb,
  '["High Fiber", "Prebiotic RS2", "Low Glycemic", "Gluten-Conscious", "Dairy-Free"]'::jsonb,
  '{"taste": 96, "texture": 95, "aroma": 97, "appearance": 98, "overallAcceptability": 96.5, "panelNotes": "Golden domed tops with toasted sesame crunch, exceptionally moist and tender crumb, mild warm aroma."}'::jsonb,
  '1 Cupcake (65g)',
  '1 Cupcake',
  '65 g',
  50,
  '7 days ambient, 14 days refrigerated',
  'Store in an airtight container in a cool dry pantry.',
  '/images/nutribake_cupcakes_1789159074122.jpg',
  true,
  true,
  'NB-2026-CUP-01',
  'Approved'
),
(
  'prod-cookies',
  'Cocolina Cookies',
  'cookies',
  'Formulated with natural coconut, seeds, and low-glycemic sweeteners.',
  'Crispy golden edges give way to a chewy, satisfying center. Each cookie is crafted from natural coconut flakes, whole rolled oats, calcium-rich stoneground sesame tahini, and slow-fermenting prebiotic fiber for steady metabolic balance.',
  'Replaces conventional high-sugar biscuits with a therapeutic, diabetic-friendly formulation packed with beta-glucan soluble fiber, healthy plant fats, and low-glycemic natural sweetness.',
  95,
  '{"calories": 140, "proteinGrams": 4.8, "carbsGrams": 19, "dietaryFiberGrams": 5.6, "sugarsGrams": 3.2, "totalFatGrams": 4.9, "saturatedFatGrams": 0.9, "sodiumMg": 75, "resistantStarchGrams": 3.8, "glycemicIndexEst": 34}'::jsonb,
  'Natural Coconut, Whole Oats & Sesame Tahini',
  '["Desiccated Coconut Flakes", "Gluten-Free Whole Rolled Oats", "Green Banana Flour", "Stoneground Sesame Tahini", "Unrefined Coconut Nectar", "Black Chia Seeds", "Cold-Pressed Extra Virgin Olive Oil", "Sea Salt", "Ceylon Cinnamon"]'::jsonb,
  '[{"name": "Desiccated Coconut", "role": "Natural Fiber & Satiety Lipids", "scientificBenefit": "Rich in dietary fiber and medium-chain fatty acids (MCTs) that facilitate smooth digestion and satisfying crumb aroma."}, {"name": "Whole Rolled Oats", "role": "Beta-Glucan Soluble Fiber", "scientificBenefit": "Beta-glucans form a viscous gel in the digestive tract, attenuating glycemic spikes and supporting heart health."}, {"name": "Stoneground Sesame Tahini", "role": "Healthy Plant Lipids & Calcium", "scientificBenefit": "Supplies bioavailable plant calcium and mono/polyunsaturated fatty acids for prolonged satiety."}]'::jsonb,
  '["Sesame", "Coconut"]'::jsonb,
  '["High Fiber", "Vegan", "Prebiotic RS2", "Dairy-Free", "Mineral Dense"]'::jsonb,
  '{"taste": 95, "texture": 97, "aroma": 96, "appearance": 96, "overallAcceptability": 96.0, "panelNotes": "Beautiful rustic cracked finish, fragrant toasted coconut and tahini notes, satisfying chew."}'::jsonb,
  '2 Cookies (50g)',
  '2 Cookies',
  '50 g',
  35,
  '18 days ambient sealed, 1 month refrigerated',
  'Store in an airtight container away from direct moisture, sunlight, and heat.',
  '/images/nutribake_cookies_1789159094420.jpg',
  true,
  true,
  'NB-2026-CK-02',
  'Approved'
),
(
  'prod-nutriballs',
  'Nutri Balls',
  'nutriballs',
  'Wholesome, naturally sweet energy bites made with dates, nuts, desi ghee & chocolate coating.',
  'Wholesome, naturally sweet energy bites made with dates, almonds, walnuts, mixed seeds and desi ghee, finished with a delicious coconut husk and chocolate coating. A convenient, satisfying snack with a rich nutty texture.',
  'We believe better nutrition should not come at the cost of taste. NutriBake focuses on freshly prepared products with carefully selected ingredients, rather than relying on long shelf life processing and preservation. Perfect for clean energy without added refined sugars.',
  98,
  '{"calories": 145, "proteinGrams": 4.5, "carbsGrams": 18, "dietaryFiberGrams": 5.2, "sugarsGrams": 11.2, "totalFatGrams": 6.5, "saturatedFatGrams": 1.8, "sodiumMg": 22, "resistantStarchGrams": 3.2, "glycemicIndexEst": 30}'::jsonb,
  'Dates, Almonds, Walnuts, Desi Ghee & Chocolate Coating',
  '["Dates", "Almonds", "Mixed Seeds (Pumpkin, Sunflower, Chia)", "Walnuts", "Desi Ghee", "Coconut Husk", "Chocolate Coating"]'::jsonb,
  '[{"name": "Dates & Mixed Seeds", "role": "Natural Sweetness & Mineral Fiber", "scientificBenefit": "Provide slow-burning natural sweetness, potassium, magnesium, and dietary fiber without sharp glycemic spikes."}, {"name": "Almonds & Walnuts", "role": "Plant Protein & ALA Omega-3 Fatty Acids", "scientificBenefit": "Rich in neuroprotective monounsaturated lipids, plant proteins, and antioxidants supporting heart and cognitive function."}, {"name": "Pure Desi Ghee", "role": "Butyric Acid & Nutrient Bioavailability", "scientificBenefit": "Supplies butyric acid to strengthen the gut mucosal lining and enhances the absorption of fat-soluble vitamins."}, {"name": "Coconut Husk & Chocolate Coating", "role": "Fiber Texture & Antioxidant Flavanols", "scientificBenefit": "Coconut husk adds beneficial fibrous bulk while the rich chocolate coating contributes mood-lifting polyphenols."}]'::jsonb,
  '["Almonds", "Walnuts"]'::jsonb,
  '["Naturally Sweet", "Desi Ghee", "High Fiber", "No Refined Sugar", "Nutrient Dense"]'::jsonb,
  '{"taste": 98, "texture": 97, "aroma": 98, "appearance": 98, "overallAcceptability": 97.8, "panelNotes": "Rich nutty texture, delightful chocolate coating with subtle toasted coconut notes and natural date sweetness."}'::jsonb,
  '1 Nutri Ball (50g)',
  '1 Nutri Ball',
  '50 g',
  10,
  'Up to 3 months when refrigerated, subject to final shelf-life testing.',
  'Keep refrigerated, especially during summer. Store in an airtight container and protect from moisture and heat.',
  '/images/nutribake_nutriballs_1789159111855.jpg',
  true,
  true,
  'NB-2026-NB-03',
  'Approved'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  why_this_product = EXCLUDED.why_this_product,
  nutrition_score = EXCLUDED.nutrition_score,
  nutrition = EXCLUDED.nutrition,
  main_functional_ingredient = EXCLUDED.main_functional_ingredient,
  all_ingredients = EXCLUDED.all_ingredients,
  functional_ingredients = EXCLUDED.functional_ingredients,
  allergens = EXCLUDED.allergens,
  dietary_tags = EXCLUDED.dietary_tags,
  sensory_scores = EXCLUDED.sensory_scores,
  serving_size = EXCLUDED.serving_size,
  portion_size = EXCLUDED.portion_size,
  net_weight = EXCLUDED.net_weight,
  price_pkr = EXCLUDED.price_pkr,
  shelf_life = EXCLUDED.shelf_life,
  storage_instructions = EXCLUDED.storage_instructions,
  image_url = EXCLUDED.image_url,
  is_featured = EXCLUDED.is_featured,
  child_friendly = EXCLUDED.child_friendly,
  batch_code = EXCLUDED.batch_code,
  lab_status = EXCLUDED.lab_status,
  updated_at = NOW();

-- 2. Sensory Trials Restoration
INSERT INTO public.sensory_trials (
  id, product_id, product_name, batch_code, panelist_name, panelist_type,
  date, taste, texture, aroma, appearance, overall_acceptability, hedonic_scale9, panel_notes
) VALUES
(
  'sen-01',
  'prod-cupcakes',
  'Golden Sesame Prebiotic Cupcakes',
  'NB-2026-CUP-01',
  'Lydia Shaloom',
  'Trained Descriptive',
  'March 09, 2026',
  96, 98, 95, 97, 96.5, 8.8,
  'Superior crumb elasticity and uniform pore distribution. Completely masked green banana astringency through light cinnamon and coconut fat.'
),
(
  'sen-02',
  'prod-cookies',
  'Wholesome Oat & Sesame Cracked Cookies',
  'NB-2026-COK-02',
  'Aamna Siddiqui',
  'Student Researcher',
  'March 10, 2026',
  95, 97, 96, 96, 96.0, 8.7,
  'Pleasant roasted notes from stoneground tahini and golden flaxseed. Crumb retains moisture over 5-day ambient shelf testing.'
),
(
  'sen-03',
  'prod-nutriballs',
  'Raw Cacao & Walnut Vitality NutriBalls',
  'NB-2026-BAL-03',
  'Noor-un-Nisa',
  'Student Researcher',
  'March 10, 2026',
  98, 96, 98, 95, 97.0, 9.0,
  'Intense natural cacao notes seamlessly combined with finely milled walnut lipids. No synthetic gums needed for firm spherification.'
),
(
  'sen-04',
  'prod-cupcakes',
  'Golden Sesame Prebiotic Cupcakes',
  'NB-2026-CUP-02',
  'Dr. Asif Ali Shah',
  'Faculty Supervisor',
  'March 11, 2026',
  94, 95, 94, 96, 95.0, 8.5,
  'Satisfactory specific loaf volume and cell aeration. Meets standard parameters for publication-grade functional formulation.'
)
ON CONFLICT (id) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  product_name = EXCLUDED.product_name,
  batch_code = EXCLUDED.batch_code,
  panelist_name = EXCLUDED.panelist_name,
  panelist_type = EXCLUDED.panelist_type,
  date = EXCLUDED.date,
  taste = EXCLUDED.taste,
  texture = EXCLUDED.texture,
  aroma = EXCLUDED.aroma,
  appearance = EXCLUDED.appearance,
  overall_acceptability = EXCLUDED.overall_acceptability,
  hedonic_scale9 = EXCLUDED.hedonic_scale9,
  panel_notes = EXCLUDED.panel_notes;

-- 3. Sample Orders Restoration
INSERT INTO public.sample_orders (
  id, order_number, date, recipient_name, email, address, status, trial_type, tracking_notes, items
) VALUES
(
  'ord-8821',
  'NB-2026-TR-8821',
  'March 11, 2026',
  'Dr. Sarah Lin',
  'sarah.lin@example.com',
  'Faculty Residence #14, University of Sindh, Jamshoro',
  'Dispatched',
  'Clinical Study',
  'Dispatched with ice pack via Sindh Lab Logistics. Expected delivery in 24 hrs.',
  '[{"productId": "prod-cupcakes", "productName": "Golden Sesame Prebiotic Cupcakes", "quantity": 2, "batchCode": "NB-2026-CUP-01"}, {"productId": "prod-nutriballs", "productName": "Raw Cacao & Walnut Vitality NutriBalls", "quantity": 2, "batchCode": "NB-2026-BAL-03"}]'::jsonb
),
(
  'ord-8820',
  'NB-2026-TR-8820',
  'March 08, 2026',
  'Prof. Tariq Mahmood (Metabolic Clinical Trial)',
  'tariq.m@usindh.edu.pk',
  'Department of Clinical Nutrition, Medical Complex, Jamshoro',
  'Delivered',
  'Academic Panel',
  'Delivered for Phase 2 Postprandial Glycemic Index study.',
  '[{"productId": "prod-cookies", "productName": "Wholesome Oat & Sesame Cracked Cookies", "quantity": 10, "batchCode": "NB-2026-COK-02"}]'::jsonb
),
(
  'ord-8822',
  'NB-2026-TR-8822',
  'March 12, 2026',
  'Dr. Zainab Bilal (Pediatric Clinic)',
  'zainab.pediatrics@gmail.com',
  'Children Health Pavilion, Unit 4, Hyderabad',
  'Lab Blended',
  'Family Nutrition',
  'Green banana composite dough mixed and resting in lab chiller.',
  '[{"productId": "prod-cupcakes", "productName": "Golden Sesame Prebiotic Cupcakes", "quantity": 4, "batchCode": "NB-2026-CUP-02"}, {"productId": "prod-cookies", "productName": "Wholesome Oat & Sesame Cracked Cookies", "quantity": 4, "batchCode": "NB-2026-COK-03"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  order_number = EXCLUDED.order_number,
  date = EXCLUDED.date,
  recipient_name = EXCLUDED.recipient_name,
  email = EXCLUDED.email,
  address = EXCLUDED.address,
  status = EXCLUDED.status,
  trial_type = EXCLUDED.trial_type,
  tracking_notes = EXCLUDED.tracking_notes,
  items = EXCLUDED.items,
  updated_at = NOW();

-- 4. Daily Intake Logs Restoration
INSERT INTO public.daily_intake_logs (
  id, product_id, product_name, portion_description, meal_time, servings, fiber_grams, resistant_starch_grams, calories, protein_grams, timestamp
) VALUES
(
  'log-01',
  'prod-cupcakes',
  'Golden Sesame Prebiotic Cupcakes',
  '1 Cupcake (85g)',
  'breakfast',
  1, 6.8, 3.4, 190, 5.2,
  'Today, 08:15 AM'
),
(
  'log-02',
  'prod-cookies',
  'Wholesome Oat & Sesame Cracked Cookies',
  '2 Cookies (50g)',
  'morning-snack',
  1, 5.6, 3.8, 140, 4.8,
  'Today, 11:30 AM'
),
(
  'log-03',
  'prod-nutriballs',
  'Raw Cacao & Walnut Vitality NutriBalls',
  '2 Balls (45g)',
  'afternoon-snack',
  1, 6.2, 2.9, 160, 4.5,
  'Today, 03:45 PM'
)
ON CONFLICT (id) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  product_name = EXCLUDED.product_name,
  portion_description = EXCLUDED.portion_description,
  meal_time = EXCLUDED.meal_time,
  servings = EXCLUDED.servings,
  fiber_grams = EXCLUDED.fiber_grams,
  resistant_starch_grams = EXCLUDED.resistant_starch_grams,
  calories = EXCLUDED.calories,
  protein_grams = EXCLUDED.protein_grams,
  timestamp = EXCLUDED.timestamp;

-- 5. Alerts & Notifications Restoration
INSERT INTO public.alerts (
  id, title, message, type, date, read
) VALUES
(
  'alt-01',
  'Fresh Formulation Approved',
  'Batch NB-2026-CUP-01 (Golden Sesame Prebiotic Cupcakes) completed 72-hour sensory trials with 96.5% acceptability.',
  'batch-update',
  'Today, 08:30 AM',
  false
),
(
  'alt-02',
  'Fiber Target Progress',
  'You have reached 73% of your daily functional dietary fiber goal (22g of 30g).',
  'nutrition-tip',
  'Today, 07:15 AM',
  false
),
(
  'alt-03',
  'New Research Paper Linked',
  'University of Sindh laboratory team published updated evaluation on resistant starch shelf kinetics.',
  'info',
  'Yesterday',
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  message = EXCLUDED.message,
  type = EXCLUDED.type,
  date = EXCLUDED.date,
  read = EXCLUDED.read;
