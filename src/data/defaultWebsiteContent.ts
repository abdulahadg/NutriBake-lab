export interface WebsiteContentData {
  announcementRibbon: {
    badge: string;
    text: string;
    linkText: string;
    linkTarget: string;
  };
  announcementBanner?: {
    enabled?: boolean;
    badge: string;
    message: string;
    linkText: string;
    linkTarget?: string;
  };
  heroContent: {
    badge: string;
    heading: string;
    subheading: string;
  };
  hero?: {
    badgeText: string;
    title: string;
    titleHighlight: string;
    description: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
  };
  heroHighlights?: {
    emoji: string;
    title: string;
    desc: string;
  }[];
  labHighlights: {
    institution: string;
    department: string;
    accreditation: string;
  };
}

export const DEFAULT_WEBSITE_CONTENT: WebsiteContentData = {
  announcementRibbon: {
    badge: 'Warmly Baked with Love',
    text: 'Type-2 Prebiotic Banana Starch & California Almonds',
    linkText: 'Family & Kids Treats →',
    linkTarget: 'family'
  },
  announcementBanner: {
    enabled: true,
    badge: 'Warmly Baked with Love',
    message: 'Type-2 Prebiotic Banana Starch & California Almonds',
    linkText: 'Family & Kids Treats →',
    linkTarget: 'family'
  },
  heroContent: {
    badge: 'NutriBake Botanical Bakery',
    heading: 'Better Nutrition. Baked with Love.',
    subheading: 'Pure prebiotic bakes crafted with sweet green banana flour, wholesome California almonds, and natural dietary fiber. Wholesome bakery comfort made gentle on your digestion.'
  },
  hero: {
    badgeText: 'NutriBake Botanical Bakery',
    title: 'Better Nutrition.',
    titleHighlight: 'Baked with Love.',
    description: 'Pure prebiotic bakes crafted with sweet green banana flour, wholesome California almonds, and natural dietary fiber. Wholesome bakery comfort made gentle on your digestion.',
    ctaPrimaryText: 'Taste the Bakes',
    ctaSecondaryText: 'Our Bakery Story'
  },
  heroHighlights: [
    {
      emoji: '🍯',
      title: 'Naturally Sweetened',
      desc: 'Sweetened gently with unripe green banana and organic dates—zero refined cane sugars.'
    },
    {
      emoji: '🌾',
      title: '7.2g Prebiotic RS2',
      desc: 'Type-2 resistant starch ferments deeply in the microbiome to foster sustained satiety.'
    },
    {
      emoji: '🧁',
      title: 'Melt-in-Mouth Softness',
      desc: 'Golden crumb elasticity developed through cold-milled almonds and defatted coconut.'
    },
    {
      emoji: '💛',
      title: 'Baked with Whole Heart',
      desc: 'Validated research from Univ. of Sindh Food Science meets everyday family nourishment.'
    }
  ],
  labHighlights: {
    institution: 'University of Sindh, Jamshoro',
    department: 'Dept. of Nutrition & Food Science',
    accreditation: 'Academic Lab'
  }
};
