// Application-wide constants
export const APP_NAME = 'APSONIC';
export const BRAND_TAGLINE = 'Good Quality, Good Life';

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/apsonic',
  instagram: 'https://instagram.com/apsonic',
  twitter: 'https://twitter.com/apsonic',
  youtube: 'https://youtube.com/apsonic',
  linkedin: 'https://linkedin.com/company/apsonic',
  tiktok: 'https://tiktok.com/@apsonic',
};

// Footer navigation structure, translated. `t` is the "footer" namespace
export interface FooterLink {
  label: string;
  href?: string;
  subItems?: FooterLink[];
}

export interface FooterSection {
  title: string;
  items: FooterLink[];
}

export function getFooterSections(t: (key: string) => string): FooterSection[] {
  const products = {
    title: t('products.title'),
    items: [
      { label: t('products.brandSelect'), href: '/products' },
      {
        label: 'APSONIC',
        subItems: [
          { label: t('products.categories.underbone'), href: '/products?category=underbone' },
          { label: t('products.categories.street'), href: '/products?category=street' },
          { label: t('products.categories.sport'), href: '/products?category=sport' },
          { label: t('products.categories.scooter'), href: '/products?category=scooter' },
          { label: t('products.categories.atv'), href: '/products?category=atv' },
          { label: t('products.categories.tricycle'), href: '/products?category=tricycle' },
        ],
      },
      {
        label: t('products.proGroup'),
        subItems: [
          { label: t('products.categories.proStreet'), href: '/products?category=pro-street' },
          { label: t('products.categories.proOffroad'), href: '/products?category=pro-offroad' },
        ],
      },
      {
        label: t('products.emotoGroup'),
        subItems: [
          { label: t('products.categories.emotoTricycle'), href: '/products?category=emoto-tricycle' },
        ],
      },
    ],
  };

  const services = {
    title: t('services.title'),
    items: [
      { label: t('services.manuals'), href: '/services/locations' },
      { label: t('services.networkLookup'), href: '/services' },
    ],
  };

  const contact = {
    title: t('contact.title'),
    items: [{ label: t('contact.inquiry'), href: '/contact' }],
  };

  return [products, services, contact];
}

// Navigation Items
export const NAV_ITEMS = [
  { label: '产品', href: '/products', labelKey: 'products' },
  { label: '服务', href: '/services', labelKey: 'services' },
  { label: '联系', href: '/contact', labelKey: 'contact' },
];

// Hero Slogan
export const HERO_SLOGAN = {
  zh: '好质量 好生活',
  fr: 'Bonne qualité pour une meilleure vie',
  en: 'Good Quality, Good Life',
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
};

// Carousel Configuration
export const CAROUSEL_CONFIG = {
  defaultInterval: 5000,
  scrollGap: 24,
  cardWidth: 280,
};
