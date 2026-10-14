import { PRODUCT_MODELS } from './product-models';
import {
  DEFAULT_KEY_FEATURES,
  DEFAULT_STORY_SPLIT,
  DEFAULT_SPEC_BANNERS,
} from './specs/default-product-specs';

export interface ProductHeroContent {
  headlineLines: Array<{ text: string; color: 'white' | 'brand' }>;
  left: string;
  middle: string;
  right: string;
  rider: string;
  topLeftBadge?: string;
}

export interface KeyFeatureMetric {
  value: number;
  unit: string;
  suffix?: string;
}

export interface KeyFeatureItem {
  title: string;
  image: string;
  tall?: boolean;
  layout: 'below' | 'inline-top' | 'bottom-left' | 'bottom-right';
  label?: string;
  metric?: KeyFeatureMetric;
  text?: string;
  highlight?: { lines: string[]; trail: string };
}

export interface StorySplitVariant {
  id: string;
  colorLabel: string;
  dotColor: string;
  image: string;
}

export interface ProductStorySplitContent {
  title: string;
  description: string;
  background: string;
  variants: StorySplitVariant[];
}

export interface SpecBannerFeatureCard {
  image: string;
  label?: string;
  multiplier?: string;
}

export interface SpecBannerContent {
  id: string;
  background: string;
  align: 'left' | 'right';
  titleLines: string[];
  description: string;
  metric?: { label: string; value: number; unit: string };
  featureCards?: SpecBannerFeatureCard[];
  badge?: string;
}

export interface ProductAestheticContent {
  title: string;
  subtitle: string;
  subtitleHighlight?: string;
  backgroundImage: string;
  firstImage: string;
  secondImage: string;
  badgeImage?: string;
  images: string[];
}

export interface ProductReviewItem {
  id: string;
  author: string;
  rating: number;
  comment: string;
  content: string;
  date: string;
}

export interface KeySpecItem {
  label: string;
  value: number;
  prefix?: string;
  unit?: string;
}

export interface FullSpecItem {
  label: string;
  value: string;
}

export interface ProductTechSpecsContent {
  keySpecs: KeySpecItem[];
  fullSpecs: FullSpecItem[];
}

export interface ProductDetailData {
  id: string;
  hero: ProductHeroContent;
  keyFeatures: KeyFeatureItem[];
  storySplit: ProductStorySplitContent;
  banners: SpecBannerContent[];
  specBanners: SpecBannerContent[];
  aestheticDesign: ProductAestheticContent;
  reviews: ProductReviewItem[];
  techSpecs: ProductTechSpecsContent;
}

export { DEFAULT_KEY_FEATURES, DEFAULT_STORY_SPLIT, DEFAULT_SPEC_BANNERS };

export const getKnownProductDetailIds = (): string[] => {
  return PRODUCT_MODELS.map((m) => m.id);
};

export const getProductDetailContent = (id: string): ProductDetailData => {
  const model = PRODUCT_MODELS.find((m) => m.id === id) || PRODUCT_MODELS[0];
  return {
    id: model.id,
    hero: {
      headlineLines: [
        { text: model.model, color: 'brand' },
        { text: 'POWER & RELIABILITY', color: 'white' },
      ],
      left: model.image,
      middle: model.image,
      right: model.image,
      rider: model.image,
    },
    keyFeatures: DEFAULT_KEY_FEATURES,
    storySplit: DEFAULT_STORY_SPLIT,
    banners: DEFAULT_SPEC_BANNERS,
    specBanners: DEFAULT_SPEC_BANNERS,
    aestheticDesign: {
      title: 'Aesthetic Design',
      subtitle: 'Modern and sleek styling',
      subtitleHighlight: 'Built for Performance',
      backgroundImage: model.image,
      firstImage: model.image,
      secondImage: model.image,
      images: [model.image],
    },
    reviews: [
      {
        id: 'rev-1',
        author: 'Kofi Owusu',
        rating: 5,
        comment: 'Extremely reliable motorcycle, great fuel economy.',
        content: 'Extremely reliable motorcycle, great fuel economy.',
        date: 'Jan 2025',
      },
    ],
    techSpecs: {
      keySpecs: [
        { label: 'MAX SPEED', value: 95, unit: 'KM/H' },
        { label: 'FUEL TANK CAPACITY', value: 10, unit: 'L' },
        { label: 'N.W', value: 110, unit: 'KG' },
        { label: 'GROUND CLEARANCE', value: 165, unit: 'MM' },
      ],
      fullSpecs: [
        { label: 'DISPLACEMENT(ML)', value: `${model.displacement || 110}cc` },
        { label: 'ENGINE TYPE', value: '4-Stroke Single Cylinder' },
        { label: 'COOLING', value: 'Air Cooled' },
        { label: 'STARTER', value: 'Kick / Electric' },
      ],
    },
  };
};

export const getProductDetailData = getProductDetailContent;
