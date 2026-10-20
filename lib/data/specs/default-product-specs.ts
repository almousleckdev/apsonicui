import type { KeyFeatureItem, SpecBannerContent, ProductStorySplitContent } from '../product-detail';

export const DEFAULT_KEY_FEATURES: KeyFeatureItem[] = [
  {
    title: 'Engine',
    image: '/images/products/detail/aloba/engine-iso.png',
    tall: true,
    layout: 'below',
    label: 'DISPLACEMENT',
    metric: { value: 110, unit: 'cc' },
  },
  {
    title: 'Frame',
    image: '/images/products/detail/aloba/frame-iso.png',
    layout: 'below',
    label: 'STRENGTH',
    text: 'STEEL',
  },
  {
    title: 'Headlights',
    image: '/images/products/detail/aloba/headlight-iso.png',
    layout: 'bottom-right',
    label: 'VISIBILITY',
    text: 'LED',
  },
  {
    title: 'Absorber',
    image: '/images/products/detail/aloba/absorber-iso.png',
    layout: 'bottom-left',
    label: 'SUSPENSION',
    metric: { value: 4, unit: 'DAMPERS' },
  },
  {
    title: 'Pedal',
    image: '/images/products/detail/aloba/pedal-iso.png',
    layout: 'bottom-right',
    label: 'CONTROL',
    text: 'ALLOY',
  },
];

export const DEFAULT_STORY_SPLIT: ProductStorySplitContent = {
  title: 'AP110-A PLUS',
  description: 'Built for reliability, fuel efficiency, and smooth city & rural transit.',
  background: '/images/products/detail/aloba/split-bg.png',
  variants: [
    { id: 'white', colorLabel: 'White', dotColor: '#FFFFFF', image: '/categories/弯梁车/AP110-A PLUS(白).png' },
    { id: 'red', colorLabel: 'Red', dotColor: '#E53E3E', image: '/categories/弯梁车/AP110-A PLUS(红).png' },
    { id: 'blue', colorLabel: 'Blue', dotColor: '#3182CE', image: '/categories/弯梁车/AP110-A PLUS(蓝).png' },
  ],
};

export const DEFAULT_SPEC_BANNERS: SpecBannerContent[] = [
  {
    id: 'banner-1',
    background: '/images/products/detail/aloba/banner-1.jpg',
    align: 'left',
    titleLines: ['POWERFUL', 'PERFORMANCE'],
    description: 'Engineered for durability across African roads.',
    metric: { label: 'MAX TORQUE', value: 8, unit: 'N·m' },
  },
];
