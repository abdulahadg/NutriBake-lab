import {
  Product,
  IngredientProfile,
  ResearchPaper,
  UserProfile,
  AlertNotification,
  AdminAnalytics,
  TeamMember,
  AcademicSupervisor
} from '../types';
import cupcakesImg from '../assets/images/nutribake_cupcakes_1789159074122.jpg';
import cookiesImg from '../assets/images/nutribake_cookies_1789159094420.jpg';
import nutriballsImg from '../assets/images/nutribake_nutriballs_1789159111855.jpg';
import officialLogoImg from '../assets/images/nutribake_official_logo_1789230811697.jpg';
import officialLogoSvg from '../assets/images/nutribake_official_logo.svg';

export const THEME_LOGO_IMAGE = officialLogoImg;
export const THEME_LOGO_SVG = officialLogoSvg;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-cupcakes',
    name: 'Golden Crumb Cupcakes',
    category: 'cupcakes',
    tagline: 'Nutrient-dense baked items rich in fiber and essential nutrients.',
    description: 'Baked to golden tender perfection in fluted liners using unripe green banana composite flour and garnished with toasted white sesame seeds. Formulated with green banana RS2 resistant starch and organic inulin to nourish gut microbiome microflora without post-meal blood sugar surges.',
    whyThisProduct: 'Addresses conventional bakery items that are high in refined flour and added sugar while lacking fiber, delivering 6.8g of gut-friendly prebiotic fiber and essential plant minerals.',
    nutritionScore: 96,
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
    mainFunctionalIngredient: 'Green Banana Flour & Toasted Sesame',
    allIngredients: [
      'Green Banana Flour (RS2 Resistant Starch)',
      'Almond Meal',
      'Cold-Pressed Coconut Oil',
      'Toasted White Sesame Seeds',
      'Organic Chicory Inulin',
      'Pasture-Raised Egg Whites',
      'Madagascar Vanilla Extract',
      'Non-Aluminum Baking Powder'
    ],
    functionalIngredients: [
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
    allergenInformation: 'Contains: Almonds, sesame seeds, and eggs.',
    crossContamination: 'May contain traces of peanuts, milk, soy, wheat, or other tree nuts.',
    dietaryTags: ['High Fiber', 'Prebiotic RS2', 'Low Glycemic', 'Gluten-Conscious', 'Dairy-Free'],
    sensoryScores: {
      taste: 96,
      texture: 95,
      aroma: 97,
      appearance: 98,
      overallAcceptability: 96.5,
      panelNotes: 'Golden domed tops with toasted sesame crunch, exceptionally moist and tender crumb, mild warm aroma.'
    },
    servingSize: '1 Cupcake (65g)',
    portionSize: '1 Cupcake',
    netWeight: '65 g',
    pricePkr: 50,
    shelfLife: '7 days ambient, 14 days refrigerated',
    storageInstructions: 'Store in an airtight container in a cool dry pantry.',
    imageUrl: cupcakesImg,
    isFeatured: true,
    childFriendly: true,
    batchCode: 'NB-2026-CUP-01',
    labStatus: 'Approved'
  },
  {
    id: 'prod-cookies',
    name: 'Cocolina Cookies',
    category: 'cookies',
    tagline: 'Formulated with natural coconut, seeds, and low-glycemic sweeteners.',
    description: 'Crispy golden edges give way to a chewy, satisfying center. Each cookie is crafted from natural coconut flakes, whole rolled oats, calcium-rich stoneground sesame tahini, and slow-fermenting prebiotic fiber for steady metabolic balance.',
    whyThisProduct: 'Replaces conventional high-sugar biscuits with a therapeutic, diabetic-friendly formulation packed with beta-glucan soluble fiber, healthy plant fats, and low-glycemic natural sweetness.',
    nutritionScore: 95,
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
    mainFunctionalIngredient: 'Natural Coconut, Whole Oats & Sesame Tahini',
    allIngredients: [
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
    functionalIngredients: [
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
    allergenInformation: 'Contains: Sesame and coconut.',
    crossContamination: 'May contain traces of tree nuts, peanuts, milk, or soy.',
    dietaryTags: ['High Fiber', 'Vegan', 'Prebiotic RS2', 'Dairy-Free', 'Mineral Dense'],
    sensoryScores: {
      taste: 95,
      texture: 97,
      aroma: 96,
      appearance: 96,
      overallAcceptability: 96.0,
      panelNotes: 'Beautiful rustic cracked finish, fragrant toasted coconut and tahini notes, satisfying chew.'
    },
    servingSize: '2 Cookies (50g)',
    portionSize: '2 Cookies',
    netWeight: '50 g',
    pricePkr: 35,
    shelfLife: '18 days ambient sealed, 1 month refrigerated',
    storageInstructions: 'Store in an airtight container away from direct moisture, sunlight, and heat.',
    imageUrl: cookiesImg,
    isFeatured: true,
    childFriendly: true,
    batchCode: 'NB-2026-CK-02',
    labStatus: 'Approved'
  },
  {
    id: 'prod-nutriballs',
    name: 'Nutri Balls',
    category: 'nutriballs',
    tagline: 'Wholesome, naturally sweet energy bites made with dates, nuts, desi ghee & chocolate coating.',
    description: 'Wholesome, naturally sweet energy bites made with dates, almonds, walnuts, mixed seeds and desi ghee, finished with a delicious coconut husk and chocolate coating. A convenient, satisfying snack with a rich nutty texture.',
    whyThisProduct: 'We believe better nutrition should not come at the cost of taste. NutriBake focuses on freshly prepared products with carefully selected ingredients, rather than relying on long shelf life processing and preservation. Perfect for clean energy without added refined sugars.',
    nutritionScore: 98,
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
    mainFunctionalIngredient: 'Dates, Almonds, Walnuts, Desi Ghee & Chocolate Coating',
    allIngredients: [
      'Dates',
      'Almonds',
      'Mixed Seeds (Pumpkin, Sunflower, Chia)',
      'Walnuts',
      'Desi Ghee',
      'Coconut Husk',
      'Chocolate Coating'
    ],
    functionalIngredients: [
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
    allergenInformation: 'Contains: Almonds and walnuts. May contain other nuts and seeds.',
    crossContamination: 'May contain traces of peanuts, milk, soy, wheat, or other nuts if produced in a facility handling these allergens.',
    dietaryTags: ['Naturally Sweet', 'Desi Ghee', 'High Fiber', 'No Refined Sugar', 'Nutrient Dense'],
    sensoryScores: {
      taste: 98,
      texture: 97,
      aroma: 98,
      appearance: 98,
      overallAcceptability: 97.8,
      panelNotes: 'Rich nutty texture, delightful chocolate coating with subtle toasted coconut notes and natural date sweetness.'
    },
    servingSize: '1 Nutri Ball (50g)',
    portionSize: '1 Nutri Ball',
    netWeight: '50 g',
    pricePkr: 10,
    shelfLife: 'Up to 3 months when refrigerated, subject to final shelf-life testing.',
    storageInstructions: 'Keep refrigerated, especially during summer. Store in an airtight container and protect from moisture and heat.',
    imageUrl: nutriballsImg,
    isFeatured: true,
    childFriendly: true,
    batchCode: 'NB-2026-NB-03',
    labStatus: 'Approved'
  }
];

export const PROJECT_DETAILS = {
  name: 'NutriBake',
  title: 'NutriBake — Nutritional Therapeutics & Confectionery Laboratory',
  subtitle: 'Therapeutic Nutrition & Confectionery Laboratory',
  tagline: 'Healthier Ingredients . Smarter Choices . Better Tomorrow.',
  motto: 'Nutrition Meets Baking',
  establishedYear: 2025,
  projectCode: '2k23-SWEM-45',
  groupNumber: 45,
  institution: 'University of Sindh, Jamshoro',
  departments: [
    {
      name: 'Department of Software Engineering',
      faculty: 'Faculty of Engineering and Technology',
      university: 'University of Sindh, Jamshoro'
    },
    {
      name: 'Department of Nutrition & Food Science',
      faculty: 'Faculty of Natural Sciences',
      university: 'University of Sindh, Jamshoro'
    }
  ],
  abstract: 'NutriBake is a food science and technology project focused on developing functional bakery products for improved nutritional value and more informed dietary choices. The project addresses conventional bakery items that are high in refined flour, added sugar and sodium while lacking fiber and other essential nutrients. Its goal is to bridge food science with technology through functional recipe formulations and automated health recommendations for individuals managing diabetes or hypertension, as well as pediatric dietary needs. The methodology combines food science-based formulation with sensory evaluation, including comparison of taste, texture and flavor profiles, supported by a technology layer for product and recommendation management. The developed work includes functional bakery formulations such as Golden Crumb Cupcakes, Cocolina Cookies, and Nutri Balls, using nutrient-dense and therapeutic functional ingredients. The project also incorporates a web-based technology stack using HTML5, Vite, React, APIs, Laravel and MongoDB. Overall, NutriBake brings functional food formulation, sensory evaluation and digital recommendations together to support more health-conscious bakery choices.',
  whyNutriBake: 'We believe better nutrition should not come at the cost of taste. NutriBake focuses on freshly baked products prepared with carefully selected ingredients, rather than relying on long shelf life processing and preservation. We also explore nutrition focused and therapeutic bakery products designed around specific dietary needs, including diabetic friendly product concepts.',
  whatWeDo: [
    'Fresh & nutritious bakery products',
    'Healthy recipe and product development',
    'Therapeutic bakery concepts',
    'Nutrition focused ingredient selection',
    'Product formulation and testing',
    'Sensory evaluation and improvement',
    'Food safety and quality considerations'
  ],
  approachSteps: [
    { step: 1, name: 'Research', desc: 'Investigating clinical nutrition literature, functional flours (banana flour), and glycemic kinetics.' },
    { step: 2, name: 'Formulate', desc: 'Recipe engineering combining food science precision with optimal macronutrient and fiber balance.' },
    { step: 3, name: 'Bake', desc: 'Controlled temperature baking trials maintaining integrity of fiber and natural lipids.' },
    { step: 4, name: 'Evaluate', desc: 'Rigorous sensory panel testing comparing taste, texture, aroma, and appearance.' },
    { step: 5, name: 'Improve', desc: 'Data-driven formulation refinement to guarantee high consumer acceptability.' },
    { step: 6, name: 'Serve', desc: 'Digital catalog, portion guidelines, and personalized automated recommendations.' }
  ],
  techStack: [
    { category: 'Frontend', items: ['HTML5', 'CSS3 (Tailwind CSS)', 'JavaScript (ES6+)', 'React 18', 'Vite'] },
    { category: 'Backend & APIs', items: ['PHP (Laravel Framework)', 'Node.js Express', 'RESTful APIs', 'SMTP Mailer'] },
    { category: 'Databases', items: ['MySQL (Relational DBMS)', 'MongoDB'] },
    { category: 'Version Control & Hosting', items: ['Git', 'GitHub', 'Hostinger / Cloud Run'] }
  ]
};

export const ACADEMIC_SUPERVISORS: AcademicSupervisor[] = [
  {
    name: 'Prof. Dr. Arifa Bhutto',
    title: 'Chairman of Software Engineering & Project Supervisor',
    department: 'Department of Software Engineering, Faculty of Engineering and Technology',
    institution: 'University of Sindh, Jamshoro',
    role: 'Chairman, Department of Software Engineering & Lead Project Supervisor',
    bio: 'Distinguished Professor and Chairman of the Department of Software Engineering at the University of Sindh, Jamshoro. As Project Supervisor for NutriBake (Project 2k23-SWEM-45), Prof. Dr. Arifa Bhutto provides executive academic leadership, guiding full-stack software architecture, data modeling for clinical nutrition, algorithmic personalization, and research integrity.',
    designation: 'Chairman & Professor',
    supervisoryFocus: 'Software Engineering Architecture, Algorithm Personalization & Interdisciplinary Innovation',
    highlights: [
      'Chairman, Department of Software Engineering',
      'Faculty of Engineering & Technology, University of Sindh, Jamshoro',
      'Lead Project Supervisor for Final Year Project 2k23-SWEM-45',
      'Guiding Full-Stack System Architecture & Clinical Nutrition Personalization',
      'Champion of Interdisciplinary Engineering & Food Science Research'
    ]
  },
  {
    name: 'Ma\'am Afsheen Shah',
    title: 'Head of Department & Project Supervisor',
    department: 'Department of Nutrition & Food Science, Faculty of Natural Sciences',
    institution: 'University of Sindh, Jamshoro',
    role: 'Nutrition Supervisor & Academic Mentor',
    bio: 'Dedicated academic leader and mentor guiding the biochemical formulation, type-2 resistant starch evaluation, and sensory panel methodologies for therapeutic bakery development.',
    designation: 'Head of Department',
    supervisoryFocus: 'Biochemical Formulations, Resistant Starch Kinetics & Sensory Evaluation',
    highlights: [
      'Head, Department of Nutrition & Food Science',
      'Faculty of Natural Sciences, University of Sindh',
      'Supervising Clinical Assays & Prebiotic Starch Metrics',
      'Sensory Evaluation Panel Testing & Consumer Acceptability'
    ]
  },
  {
    name: 'Engr. Amir Mal',
    title: 'Technical Co-Supervisor',
    department: 'Department of Software Engineering, Faculty of Engineering and Technology',
    institution: 'University of Sindh, Jamshoro',
    role: 'Technical Co-Supervisor',
    bio: 'Advising on system engineering, database management, and technical integration between web platforms and automated recommendation logic.',
    designation: 'Lecturer & Co-Supervisor',
    supervisoryFocus: 'System Reliability, API Architecture & Database Engineering',
    highlights: [
      'Lecturer, Department of Software Engineering',
      'Faculty of Engineering & Technology, University of Sindh',
      'Technical Co-Supervisor for Final Year Project 2k23-SWEM-45',
      'Advising on Relational & NoSQL Database Pipelines',
      'Technical Code Quality Assurance & Testing Frameworks'
    ]
  }
];

export const SOFTWARE_ENG_TEAM: TeamMember[] = [
  {
    id: 'team-abdul-hannan-memon',
    name: 'Abdul Hannan Memon',
    idNumber: '08/2K23/SWE',
    department: 'Department of Software Engineering',
    role: 'Group Leader | Frontend & Analyst',
    subRole: 'Founder & CEO, IDH',
    institution: 'University of Sindh, Jamshoro',
    expertise: ['Education', 'Frontend UI/UX', 'Python', 'AI'],
    focus: 'Team coordination, UI/UX layout, navigation, and user experience.',
    bio: 'Team coordination, UI/UX layout, navigation, and user experience.',
    displayOrder: 1
  },
  {
    id: 'team-ali-hassan-chand',
    name: 'Ali Hassan Chand',
    idNumber: '26/2K23/SWE',
    department: 'Department of Software Engineering',
    role: 'Tech Lead | Full-Stack Engineer',
    subRole: 'Founder & CTO, MWI',
    institution: 'University of Sindh, Jamshoro',
    expertise: ['Full-Stack Development', 'System Architecture', 'Project Management', 'React', 'Laravel'],
    focus: 'Technical strategy, backend implementation, logic, and database systems.',
    bio: 'Technical strategy, backend implementation, logic, and database systems.',
    displayOrder: 2
  },
  {
    id: 'team-haris-ahmed-ansari',
    name: 'Haris Ahmed Ansari',
    idNumber: '63/2K23/SWE',
    department: 'Department of Software Engineering',
    role: 'Researcher | Key Documentation | Quality Assurance',
    institution: 'University of Sindh, Jamshoro',
    expertise: ['MERN Stack Development', 'Software Testing & System Validation'],
    focus: 'Functional food research, documentation, quality assurance, and system reliability.',
    bio: 'Functional food research, documentation, quality assurance, and system reliability.',
    displayOrder: 3
  }
];

export const NUTRITION_SCIENCE_TEAM: TeamMember[] = [
  {
    id: 'team-aamna-siddiqui',
    name: 'Aamna Siddiqui',
    department: 'Nutrition & Food Science Department',
    role: 'Student Researcher',
    subRole: 'Final-Year BS Nutrition & Food Science Student',
    institution: 'University of Sindh, Jamshoro',
    expertise: ['Therapeutic Formulations', 'Macronutrient Balancing', 'Nutritional Profiling'],
    focus: 'Functional ingredient selection and dietary optimization for targeted health requirements.',
    bio: 'Functional ingredient selection and dietary optimization for targeted health requirements.',
    displayOrder: 4
  },
  {
    id: 'team-lydia-shaloom',
    name: 'Lydia Shaloom',
    department: 'Nutrition & Food Science Department',
    role: 'Student Researcher',
    subRole: 'Final-Year BS Nutrition & Food Science Student',
    institution: 'University of Sindh, Jamshoro',
    expertise: ['Sensory Evaluation', 'Hedonic Scaling', 'Flavour & Texture Optimization'],
    focus: 'Complete sensory testing panels, comparing taste, texture, aroma, and mouthfeel.',
    bio: 'Complete sensory testing panels, comparing taste, texture, aroma, and mouthfeel.',
    displayOrder: 5
  },
  {
    id: 'team-noor-un-nisa',
    name: 'Noor-un-Nisa',
    department: 'Nutrition & Food Science Department',
    role: 'Student Researcher',
    subRole: 'Final-Year BS Nutrition & Food Science Student',
    institution: 'University of Sindh, Jamshoro',
    expertise: ['Food Safety & Quality', 'Shelf-Life Kinetics', 'Safe Food Formulation'],
    focus: 'Controlled laboratory trials, hygiene protocols, storage testing, and allergen mitigation.',
    bio: 'Controlled laboratory trials, hygiene protocols, storage testing, and allergen mitigation.',
    displayOrder: 6
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  ...SOFTWARE_ENG_TEAM,
  ...NUTRITION_SCIENCE_TEAM
];

export const INGREDIENT_PROFILES: IngredientProfile[] = [
  {
    id: 'ing-banana-flour',
    name: 'Green Banana Flour',
    category: 'Flour',
    description: 'Derived from unripe green bananas (Musa acuminata) dried and finely milled under controlled temperature to preserve resistant starch content.',
    functionInBaking: 'Substitutes 20–40% of refined wheat flour, creating cohesive moisture retention without adding sweet banana flavor.',
    nutritionalRole: 'Prebiotic dietary fiber source rich in Resistant Starch Type 2 (RS2), potassium, and essential micronutrients.',
    scientificInsight: 'Resistant starch escapes digestion in the small intestine and ferments in the colon into beneficial Short-Chain Fatty Acids (SCFAs) like butyrate, supporting gut health.',
    productsUsedIn: ['Golden Sesame Prebiotic Cupcakes', 'Wholesome Oat & Sesame Cracked Cookies', 'Raw Cacao & Walnut Vitality NutriBalls'],
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=800&auto=format&fit=crop',
    fiberYield: 'High (45-55% total starch is resistant in raw form)',
    glycemicRating: 'Very Low'
  },
  {
    id: 'ing-nuts',
    name: 'Selected Tree Nuts (Walnuts & Almonds)',
    category: 'Nut',
    description: 'Carefully sorted, gently roasted whole tree nuts providing structured mouthfeel and concentrated nutritional density.',
    functionInBaking: 'Introduces desirable textural crunch, crumb variation, and natural emulsifying plant fats.',
    nutritionalRole: 'Supplies alpha-linolenic omega-3 fatty acids, plant-based protein, dietary fiber, and natural vitamin E.',
    scientificInsight: 'Regular dietary incorporation of functional tree nuts is clinically associated with improved lipid profiles and favorable postprandial glycemic buffering.',
    productsUsedIn: ['Golden Sesame Prebiotic Cupcakes', 'Wholesome Oat & Sesame Cracked Cookies', 'Raw Cacao & Walnut Vitality NutriBalls'],
    imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?q=80&w=800&auto=format&fit=crop',
    fiberYield: 'Moderate (7-10g per 100g)',
    glycemicRating: 'Very Low'
  },
  {
    id: 'ing-coconut',
    name: 'Defatted & Desiccated Coconut',
    category: 'Natural Fiber',
    description: 'Pure coconut meat mechanically cold-pressed to extract virgin oils, followed by gentle drying into fiber-dense flour and fragrant flakes.',
    functionInBaking: 'Exceptional liquid binding capacity, tender crumb structure, and natural bakery aroma.',
    nutritionalRole: 'Exceptionally high insoluble fiber and Medium Chain Triglycerides (MCTs) including lauric acid.',
    scientificInsight: 'Coconut dietary fiber binds dietary lipids and water within the digestive tract, aiding regular gastrointestinal transit time.',
    productsUsedIn: ['Golden Sesame Prebiotic Cupcakes', 'Wholesome Oat & Sesame Cracked Cookies'],
    imageUrl: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?q=80&w=800&auto=format&fit=crop',
    fiberYield: 'Very High (38-42g per 100g flour)',
    glycemicRating: 'Low'
  },
  {
    id: 'ing-fiber-complex',
    name: 'Fiber-Enhancing Complex (Inulin & Flaxseed)',
    category: 'Natural Fiber',
    description: 'Synergistic formulation of chicory root inulin (fructooligosaccharide) and whole cold-milled golden flaxseed.',
    functionInBaking: 'Mimics fat mouthfeel, increases crumb softness and moistness, and extends natural freshness without chemical humectants.',
    nutritionalRole: 'Combines soluble prebiotic fiber with plant lignans and soluble mucilage.',
    scientificInsight: 'Inulin selectively stimulates the growth of Bifidobacteria in human microbiota while moderating the overall glycemic response of baked goods.',
    productsUsedIn: ['Golden Sesame Prebiotic Cupcakes', 'Wholesome Oat & Sesame Cracked Cookies'],
    imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=800&auto=format&fit=crop',
    fiberYield: 'Extremely High (85-90% soluble prebiotic fiber)',
    glycemicRating: 'Very Low'
  }
];

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'res-01',
    title: 'Physicochemical, nutritional and sensory evaluation of bakery products formulated with green banana flour as a functional ingredient',
    authors: 'A. Rahman, S. Fatima, M. Tariq (Laboratory Research Archive)',
    journal: 'Journal of Food Science and Functional Nutrition Studies',
    year: 2024,
    doi: '10.1016/j.jfst.2024.08.012',
    abstract: 'Investigation into substitution levels (10% to 40%) of green banana flour (GBF) in confectionery formulations. Findings demonstrated significant increases in resistant starch (RS) from 1.1g to 5.4g per 100g, while maintaining sensory acceptability scores exceeding 90% across trained descriptive panels.',
    keyFinding: 'Optimal 25-30% GBF replacement preserves traditional muffin texture while tripling prebiotic dietary fiber.',
    nutriBakeApplication: 'Directly informs the dough formulation and moisture retention protocol of NutriBake Banana Flour Muffins and Hearth Loaves.',
    tags: ['Banana Flour', 'Resistant Starch', 'Sensory Acceptability', 'Bakery Formulation']
  },
  {
    id: 'res-02',
    title: 'Glycemic response and digestive kinetics of resistant-starch fortified confectionery items',
    authors: 'H. Akhtar, Z. Ahmed, et al.',
    journal: 'International Food Technology & Therapeutics',
    year: 2023,
    doi: '10.1080/09637486.2023.18902',
    abstract: 'Clinical evaluation of in vitro starch digestibility across traditional sucrose-rich baked goods versus resistant starch & nut lipid composite matrices. Demonstrated an average 42% attenuation in rapid glucose release.',
    keyFinding: 'Incorporation of natural nut lipids alongside non-gelatinized resistant starch creates a sustained-release carbohydrate matrix.',
    nutriBakeApplication: 'Adopted in the Nut & Banana Energy Bar and Healthy Banana Loaf recipes to ensure low-glycemic profiles.',
    tags: ['Glycemic Index', 'Nut Lipids', 'Digestive Kinetics', 'Carbohydrate Matrix']
  },
  {
    id: 'res-03',
    title: 'Soluble dietary fiber and coconut flour applications in crumb texture preservation and shelf-life kinetics',
    authors: 'E. Chen, V. Santos, K. Malik',
    journal: 'Cereal Chemistry & Functional Confectionery',
    year: 2024,
    doi: '10.1002/cche.2024.1104',
    abstract: 'Study examining defatted coconut flour and inulin combinations to replace saturated hydrogenated shortenings in cookie formulations. Crumb friability and moisture kinetics indicated improved shelf-life stability with zero synthetic emulsifiers.',
    keyFinding: 'Natural coconut dietary fiber binds moisture without retrogradation, extending natural bakery softness by 4 days.',
    nutriBakeApplication: 'Utilized as the standard baseline for NutriBake Coconut Fiber Cookies and Breakfast Biscuits.',
    tags: ['Coconut Flour', 'Inulin', 'Clean Label', 'Shelf Stability']
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-sarah-demo',
  name: 'Sarah Jenkins',
  email: 'sarah.j@example.com',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  ageGroup: 'adult',
  dietaryPreference: 'vegetarian',
  savedProductIds: ['prod-cupcakes', 'prod-cookies', 'prod-nutriballs'],
  savedProducts: ['prod-cupcakes', 'prod-cookies', 'prod-nutriballs'],
  preferences: {
    dailyFiberTargetGrams: 30,
    dietaryGoal: 'High Fiber & Gut Vitality',
    allergens: []
  },
  dailyFiberGoalGrams: 30,
  currentFiberIntakeGrams: 22,
  recommendationHistoryCount: 4,
  memberSince: 'March 2026'
};

export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'alt-01',
    title: 'Fresh Formulation Approved',
    message: 'Batch NB-2026-CUP-01 (Golden Sesame Prebiotic Cupcakes) completed 72-hour sensory trials with 96.5% acceptability.',
    type: 'batch-update',
    date: 'Today, 08:30 AM',
    read: false
  },
  {
    id: 'alt-02',
    title: 'Fiber Target Progress',
    message: 'You have reached 73% of your daily functional dietary fiber goal (22g of 30g).',
    type: 'nutrition-tip',
    date: 'Today, 07:15 AM',
    read: false
  },
  {
    id: 'alt-03',
    title: 'New Research Paper Linked',
    message: 'University of Sindh laboratory team published updated evaluation on resistant starch shelf kinetics.',
    type: 'info',
    date: 'Yesterday',
    read: true
  }
];

export const INITIAL_ADMIN_ANALYTICS: AdminAnalytics = {
  totalUsers: 1420,
  totalProducts: 8,
  activeRecommendations: 389,
  nutritionRecords: 48,
  topCategories: [
    { category: 'Muffins & Loaves', count: 420, percentage: 38 },
    { category: 'Artisan Breads', count: 340, percentage: 31 },
    { category: 'Confectionery Cookies', count: 210, percentage: 19 },
    { category: 'Energy & Snack Bars', count: 130, percentage: 12 }
  ],
  weeklyRecommendationRuns: [
    { day: 'Mon', count: 48 },
    { day: 'Tue', count: 62 },
    { day: 'Wed', count: 55 },
    { day: 'Thu', count: 74 },
    { day: 'Fri', count: 88 },
    { day: 'Sat', count: 95 },
    { day: 'Sun', count: 67 }
  ],
  sensoryAcceptabilityAvg: 93.8
};

export const COMPARISON_DATA = [
  {
    metric: 'Primary Flours',
    traditional: '100% Bleached & Refined White Wheat Flour',
    nutribake: 'Stoneground Heritage Wheat + Unripe Green Banana Flour (RS2)'
  },
  {
    metric: 'Dietary Fiber per Serving',
    traditional: '0.8g – 1.2g (Minimal roughage)',
    nutribake: '4.8g – 7.2g (High prebiotic and resistant starch yield)'
  },
  {
    metric: 'Glycemic Index & Peak',
    traditional: 'High GI (70 – 85) with rapid insulin spikes',
    nutribake: 'Low GI (32 – 44) for sustained postprandial energy'
  },
  {
    metric: 'Functional Ingredients',
    traditional: 'None (Primarily empty caloric carbohydrates)',
    nutribake: 'Resistant starch, raw nuts, cold-pressed coconut, soluble inulin'
  },
  {
    metric: 'Lipid Quality',
    traditional: 'Hydrogenated shortenings, trans fats, refined seed oils',
    nutribake: 'Natural nut lipids, virgin coconut oil, golden flaxseed ALA omega-3'
  },
  {
    metric: 'Sugar Content',
    traditional: '22g – 34g refined white sucrose / high-fructose corn syrup',
    nutribake: '1.2g – 7.5g naturally buffered sweetness from raw fruits & honey'
  },
  {
    metric: 'Formulation & Verification',
    traditional: 'Standard industrial convenience recipes',
    nutribake: 'Controlled lab development with sensory panel acceptability rating >90%'
  }
];

export const FUTURE_ROADMAP = [
  {
    title: 'Shelf-Life Kinetics & Water Activity Studies',
    timeframe: 'Stage 1 — Academic Expansion',
    description: 'Conducting comprehensive isotherm moisture sorption analysis to extend ambient stability to 30+ days without chemical preservative salts.',
    status: 'Future Opportunity'
  },
  {
    title: 'Automated AI Metabolic Recommendation Engine',
    timeframe: 'Stage 2 — Technological Roadmap',
    description: 'Machine learning algorithms matching individual continuous glucose monitor (CGM) profiles with tailored prebiotic flour composites.',
    status: 'Future Opportunity'
  },
  {
    title: 'Controlled Pilot Plant & Commercial Scaling',
    timeframe: 'Stage 3 — Commercialization',
    description: 'Transitioning from batch university laboratory ovens to high-capacity continuous convection baking lines for regional retail supply.',
    status: 'Future Opportunity'
  },
  {
    title: 'Therapeutic Clinical Trials on Pediatric Microbiome',
    timeframe: 'Stage 4 — Research Horizon',
    description: 'Formal double-blind dietary intervention evaluating short-chain fatty acid fecal biomarkers in school-aged children consuming functional snacks.',
    status: 'Future Opportunity'
  }
];
