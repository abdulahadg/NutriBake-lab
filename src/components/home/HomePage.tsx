import React from 'react';
import { HeroSection } from './HeroSection';
import { FeaturedProductsSection } from './FeaturedProductsSection';
import { NutriBakeDifferenceSection } from './NutriBakeDifferenceSection';
import { NutritionSection } from './NutritionSection';
import { PersonalizedRecommendationSection } from './PersonalizedRecommendationSection';
import { BakedWithPurposeSection } from './BakedWithPurposeSection';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <FeaturedProductsSection />
      <NutriBakeDifferenceSection />
      <NutritionSection />
      <PersonalizedRecommendationSection />
      <BakedWithPurposeSection />
    </div>
  );
};
