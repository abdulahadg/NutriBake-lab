import { DailyIntakeLogEntry, SampleTrialOrder, SensoryTrialEntry, ProductTastingNote, ChildFamilyProfile } from '../types';

export const INITIAL_DAILY_LOGS: DailyIntakeLogEntry[] = [
  {
    id: 'log-01',
    productId: 'prod-cupcakes',
    productName: 'Golden Sesame Prebiotic Cupcakes',
    portionDescription: '1 Cupcake (85g)',
    mealTime: 'breakfast',
    servings: 1,
    fiberGrams: 6.8,
    resistantStarchGrams: 3.4,
    calories: 190,
    proteinGrams: 5.2,
    timestamp: 'Today, 08:15 AM'
  },
  {
    id: 'log-02',
    productId: 'prod-cookies',
    productName: 'Wholesome Oat & Sesame Cracked Cookies',
    portionDescription: '2 Cookies (50g)',
    mealTime: 'morning-snack',
    servings: 1,
    fiberGrams: 5.6,
    resistantStarchGrams: 3.8,
    calories: 140,
    proteinGrams: 4.8,
    timestamp: 'Today, 11:30 AM'
  },
  {
    id: 'log-03',
    productId: 'prod-nutriballs',
    productName: 'Raw Cacao & Walnut Vitality NutriBalls',
    portionDescription: '2 Balls (45g)',
    mealTime: 'afternoon-snack',
    servings: 1,
    fiberGrams: 6.2,
    resistantStarchGrams: 2.9,
    calories: 160,
    proteinGrams: 4.5,
    timestamp: 'Today, 03:45 PM'
  }
];

export const INITIAL_SAMPLE_ORDERS: SampleTrialOrder[] = [
  {
    id: 'ord-8821',
    orderNumber: 'NB-2026-TR-8821',
    date: 'March 11, 2026',
    recipientName: 'Dr. Sarah Lin',
    email: 'sarah.lin@example.com',
    address: 'Faculty Residence #14, University of Sindh, Jamshoro',
    status: 'Dispatched',
    trialType: 'Clinical Study',
    trackingNotes: 'Dispatched with ice pack via Sindh Lab Logistics. Expected delivery in 24 hrs.',
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
    orderNumber: 'NB-2026-TR-8820',
    date: 'March 08, 2026',
    recipientName: 'Prof. Tariq Mahmood (Metabolic Clinical Trial)',
    email: 'tariq.m@usindh.edu.pk',
    address: 'Department of Clinical Nutrition, Medical Complex, Jamshoro',
    status: 'Delivered',
    trialType: 'Academic Panel',
    trackingNotes: 'Delivered for Phase 2 Postprandial Glycemic Index study.',
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
    orderNumber: 'NB-2026-TR-8822',
    date: 'March 12, 2026',
    recipientName: 'Dr. Zainab Bilal (Pediatric Clinic)',
    email: 'zainab.pediatrics@gmail.com',
    address: 'Children Health Pavilion, Unit 4, Hyderabad',
    status: 'Lab Blended',
    trialType: 'Family Nutrition',
    trackingNotes: 'Green banana composite dough mixed and resting in lab chiller.',
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

export const INITIAL_SENSORY_TRIALS: SensoryTrialEntry[] = [
  {
    id: 'sen-01',
    productId: 'prod-cupcakes',
    productName: 'Golden Sesame Prebiotic Cupcakes',
    batchCode: 'NB-2026-CUP-01',
    panelistName: 'Lydia Shaloom',
    panelistType: 'Trained Descriptive',
    date: 'March 09, 2026',
    taste: 96,
    texture: 98,
    aroma: 95,
    appearance: 97,
    overallAcceptability: 96.5,
    hedonicScale9: 8.8,
    panelNotes: 'Superior crumb elasticity and uniform pore distribution. Completely masked green banana astringency through light cinnamon and coconut fat.'
  },
  {
    id: 'sen-02',
    productId: 'prod-cookies',
    productName: 'Wholesome Oat & Sesame Cracked Cookies',
    batchCode: 'NB-2026-COK-02',
    panelistName: 'Aamna Siddiqui',
    panelistType: 'Student Researcher',
    date: 'March 10, 2026',
    taste: 95,
    texture: 97,
    aroma: 96,
    appearance: 96,
    overallAcceptability: 96.0,
    hedonicScale9: 8.7,
    panelNotes: 'Pleasant roasted notes from stoneground tahini and golden flaxseed. Crumb retains moisture over 5-day ambient shelf testing.'
  },
  {
    id: 'sen-03',
    productId: 'prod-nutriballs',
    productName: 'Raw Cacao & Walnut Vitality NutriBalls',
    batchCode: 'NB-2026-BAL-03',
    panelistName: 'Noor-un-Nisa',
    panelistType: 'Student Researcher',
    date: 'March 10, 2026',
    taste: 98,
    texture: 96,
    aroma: 98,
    appearance: 95,
    overallAcceptability: 97.0,
    hedonicScale9: 9.0,
    panelNotes: 'Intense natural cacao notes seamlessly combined with finely milled walnut lipids. No synthetic gums needed for firm spherification.'
  },
  {
    id: 'sen-04',
    productId: 'prod-cupcakes',
    productName: 'Golden Sesame Prebiotic Cupcakes',
    batchCode: 'NB-2026-CUP-02',
    panelistName: 'Dr. Asif Ali Shah',
    panelistType: 'Faculty Supervisor',
    date: 'March 11, 2026',
    taste: 94,
    texture: 95,
    aroma: 94,
    appearance: 96,
    overallAcceptability: 95.0,
    hedonicScale9: 8.5,
    panelNotes: 'Satisfactory specific loaf volume and cell aeration. Meets standard parameters for publication-grade functional formulation.'
  }
];

export const INITIAL_TASTING_NOTES: Record<string, ProductTastingNote> = {
  'prod-cupcakes': {
    productId: 'prod-cupcakes',
    rating: 5,
    notes: 'Incredible crumb softness and subtle nutty richness. Zero heavy aftertaste, digested very gently with morning tea.',
    date: 'March 10, 2026'
  },
  'prod-cookies': {
    productId: 'prod-cookies',
    rating: 5,
    notes: 'Remarkable roasted tahini and coconut aroma. Keeps me satiated for 4 hours with no blood sugar crash.',
    date: 'March 11, 2026'
  }
};

export const INITIAL_FAMILY_PROFILES: ChildFamilyProfile[] = [
  {
    id: 'fam-01',
    name: 'Liam Lin',
    age: 7,
    allergies: ['Peanuts'],
    favoriteProducts: ['Golden Sesame Prebiotic Cupcakes'],
    fiberTarget: 20,
    notes: 'School lunchbox favorite. Certified peanut-free batch tested.'
  },
  {
    id: 'fam-02',
    name: 'Maya Lin',
    age: 11,
    allergies: [],
    favoriteProducts: ['Wholesome Oat & Sesame Cracked Cookies', 'Raw Cacao & Walnut Vitality NutriBalls'],
    fiberTarget: 24,
    notes: 'Consumes before afternoon swimming practice for sustained energy.'
  }
];
